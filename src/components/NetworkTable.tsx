import React, { useState } from 'react';
import { NetworkSection, PipeDefinition, SewerSystemType } from '../types/hydraulic';
import { PIPE_CATALOG, calculatePipeHydraulics } from '../utils/hydraulicCalculations';
import { Plus, Trash2, CheckCircle2, XCircle, AlertTriangle, Download, Printer, CloudRain, Home, Zap } from 'lucide-react';

export const NetworkTable: React.FC = () => {
  // Pre-seed with realistic engineering sections including rainwater and domestic
  const [sections, setSections] = useState<NetworkSection[]>([
    {
      id: 'sec-1',
      name: 'Участок 1: Подвесная линия водостока с кровли F=1000м² (К2)',
      systemType: 'rainwater_internal',
      pipeId: 'pp-110',
      slope: 0.02,
      flowRateLs: 9.0,
      lengthM: 18.0,
      note: 'Внутренний водосток: h/d = 0.77 ≤ 0.80 (в норме)'
    },
    {
      id: 'sec-2',
      name: 'Участок 2: Отводной дренаж группы фанкойлов (К2/техн)',
      systemType: 'rainwater_internal',
      pipeId: 'pp-25',
      slope: 0.03,
      flowRateLs: 0.12,
      lengthM: 12.5,
      note: 'Малый диаметр ПП DN 25'
    },
    {
      id: 'sec-3',
      name: 'Участок 3: Бытовой лежак К1 (душевой блок 8,60 л/с)',
      systemType: 'domestic',
      pipeId: 'pp-160',
      slope: 0.02,
      flowRateLs: 8.6,
      lengthM: 4.6,
      note: 'Бытовая сеть: для 8.6 л/с принят DN 160 (h/d = 0.35 ≤ 0.6)'
    },
    {
      id: 'sec-4',
      name: 'Участок 4: Выпуск ливневки при полном наполнении (h/d = 1.0)',
      systemType: 'full_flow_1_0',
      customMaxFilling: 1.0,
      pipeId: 'pp-110',
      slope: 0.02,
      flowRateLs: 11.0,
      lengthM: 15.0,
      note: 'Полное сечение трубы: h/d = 0.93 ≤ 1.00 (допустимо по нормам РБ)'
    }
  ]);

  const [newSectionName, setNewSectionName] = useState('');
  const [newSystemType, setNewSystemType] = useState<SewerSystemType>('full_flow_1_0');
  const [newPipeId, setNewPipeId] = useState('pp-110');
  const [newSlope, setNewSlope] = useState(0.02);
  const [newFlow, setNewFlow] = useState(8.6);
  const [newLength, setNewLength] = useState(10.0);

  const handleAddSection = () => {
    const name = newSectionName.trim() || `Участок ${sections.length + 1}`;
    const newSec: NetworkSection = {
      id: `sec-${Date.now()}`,
      name,
      systemType: newSystemType,
      customMaxFilling: newSystemType === 'full_flow_1_0' || newSystemType === 'rainwater_external' ? 1.0 : undefined,
      pipeId: newPipeId,
      slope: newSlope,
      flowRateLs: newFlow,
      lengthM: newLength
    };
    setSections([...sections, newSec]);
    setNewSectionName('');
  };

  const handleDeleteSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const handleUpdateSection = (id: string, updates: Partial<NetworkSection>) => {
    setSections(
      sections.map(sec => {
        if (sec.id === id) {
          return { ...sec, ...updates };
        }
        return sec;
      })
    );
  };

  // Calculate results for all sections taking into account their individual system type and custom filling limit
  const calculatedSections = sections.map(sec => {
    const pipe = PIPE_CATALOG.find(p => p.id === sec.pipeId) || PIPE_CATALOG[8];
    const result = calculatePipeHydraulics(
      pipe,
      sec.slope,
      { type: 'flowRate', value: sec.flowRateLs },
      sec.systemType,
      sec.customMaxFilling
    );
    return { ...sec, pipe, result };
  });

  const totalLength = sections.reduce((acc, s) => acc + (s.lengthM || 0), 0);
  const hasErrors = calculatedSections.some(s => s.result.status === 'error');

  const exportCsv = () => {
    const headers = [
      'Участок',
      'Тип сети',
      'Труба',
      'Длина (м)',
      'Уклон (i)',
      'Расход q (л/с)',
      'Наполнение h/d',
      'Лимит h/d',
      'Скорость V (м/с)',
      'V*sqrt(h/d)',
      'Статус'
    ];
    const rows = calculatedSections.map(s => [
      `"${s.name}"`,
      `"${s.systemType}"`,
      `"${s.pipe.name}"`,
      s.lengthM,
      s.slope,
      s.flowRateLs,
      s.result.fillingRatio.toFixed(3),
      s.result.maxAllowedFilling,
      s.result.velocity.toFixed(2),
      s.result.selfCleansingCriterion.toFixed(2),
      s.result.status
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `гидравлический_расчет_сети_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            Сводная ведомость гидравлического расчета сети (по нормам РБ)
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Спецификация участков безнапорной канализации с индивидуальным контролем наполнения (h/d ≤ 0,6; 0,8; 1,0)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-300 px-3 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            Экспорт в CSV
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Печать ведомости
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
          <span className="text-gray-500 uppercase tracking-wider block font-semibold">
            Количество участков:
          </span>
          <span className="text-2xl font-bold font-mono text-gray-900 mt-1 block">
            {sections.length} шт.
          </span>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
          <span className="text-gray-500 uppercase tracking-wider block font-semibold">
            Общая протяженность труб:
          </span>
          <span className="text-2xl font-bold font-mono text-blue-700 mt-1 block">
            {totalLength.toFixed(1)} м
          </span>
        </div>

        <div className={`p-4 rounded-xl border text-xs ${
          hasErrors
            ? 'bg-rose-50 border-rose-200 text-rose-900'
            : 'bg-emerald-50 border-emerald-200 text-emerald-900'
        }`}>
          <span className="uppercase tracking-wider block font-semibold">
            Состояние сети:
          </span>
          <div className="flex items-center gap-2 mt-1">
            {hasErrors ? (
              <>
                <XCircle className="w-5 h-5 text-rose-600" />
                <span className="text-sm font-bold">Есть превышение нормативного наполнения!</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-bold">Все участки соответствуют нормам РБ</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Network Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-xl">
        <table className="w-full text-xs text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase font-bold border-b border-gray-200">
            <tr>
              <th className="py-3 px-3">Участок</th>
              <th className="py-3 px-3">Тип сети / Лимит</th>
              <th className="py-3 px-3">Труба ПП</th>
              <th className="py-3 px-3">L (м)</th>
              <th className="py-3 px-3">i</th>
              <th className="py-3 px-3">q (л/с)</th>
              <th className="py-3 px-3">h/d расч.</th>
              <th className="py-3 px-3">h/d макс.</th>
              <th className="py-3 px-3">V (м/с)</th>
              <th className="py-3 px-3">V·√(h/d)</th>
              <th className="py-3 px-3">Статус</th>
              <th className="py-3 px-3 text-right">Удалить</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {calculatedSections.map(sec => {
              const res = sec.result;
              const isOver = !res.isFillingOk;

              return (
                <tr
                  key={sec.id}
                  className={`transition-colors ${
                    isOver ? 'bg-rose-50/60' : 'hover:bg-gray-50/80'
                  }`}
                >
                  <td className="py-3 px-3 font-medium text-gray-900 max-w-xs">
                    <div>{sec.name}</div>
                    {sec.note && (
                      <div className="text-[10px] text-gray-500 font-normal mt-0.5">
                        {sec.note}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <select
                      value={sec.systemType}
                      onChange={e => {
                        const val = e.target.value as SewerSystemType;
                        handleUpdateSection(sec.id, {
                          systemType: val,
                          customMaxFilling: val === 'full_flow_1_0' || val === 'rainwater_external' ? 1.0 : undefined
                        });
                      }}
                      className="bg-white border border-gray-200 rounded p-1 text-[11px] outline-hidden cursor-pointer"
                    >
                      <option value="full_flow_1_0">⚡ Полное (h/d = 1.00)</option>
                      <option value="rainwater_internal">Водосток (К2, h/d≤0.8)</option>
                      <option value="rainwater_external">Ливневка (К2н, h/d=1.0)</option>
                      <option value="domestic">Бытовая (К1, h/d≤0.6)</option>
                    </select>
                  </td>
                  <td className="py-3 px-3 font-medium">
                    <select
                      value={sec.pipeId}
                      onChange={e => handleUpdateSection(sec.id, { pipeId: e.target.value })}
                      className="bg-white border border-gray-200 rounded p-1 text-xs outline-hidden cursor-pointer"
                    >
                      <optgroup label="ПП 2,0 (2,0 МПа / Таблица 11 Добромыслова)">
                        {PIPE_CATALOG.filter(p => p.material === 'pp' && !p.id.includes('drain')).map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} (s = {p.wallThickness} мм)
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="ПП безнапорная (СТБ ГОСТ 32414)">
                        {PIPE_CATALOG.filter(p => p.id.includes('drain')).map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <input
                      type="number"
                      step="0.5"
                      value={sec.lengthM}
                      onChange={e =>
                        handleUpdateSection(sec.id, {
                          lengthM: parseFloat(e.target.value) || 0
                        })
                      }
                      className="w-16 bg-white border border-gray-200 rounded px-1.5 py-1 text-xs font-mono outline-hidden"
                    />
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <input
                      type="number"
                      step="0.005"
                      value={sec.slope}
                      onChange={e =>
                        handleUpdateSection(sec.id, {
                          slope: parseFloat(e.target.value) || 0.02
                        })
                      }
                      className="w-16 bg-white border border-gray-200 rounded px-1.5 py-1 text-xs font-mono outline-hidden"
                    />
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-blue-700">
                    <input
                      type="number"
                      step="0.1"
                      value={sec.flowRateLs}
                      onChange={e =>
                        handleUpdateSection(sec.id, {
                          flowRateLs: parseFloat(e.target.value) || 0
                        })
                      }
                      className="w-16 bg-white border border-gray-200 rounded px-1.5 py-1 text-xs font-mono font-bold text-blue-700 outline-hidden"
                    />
                  </td>
                  <td className="py-3 px-3 font-mono font-bold">
                    <span className={isOver ? 'text-rose-600' : 'text-gray-900'}>
                      {res.fillingRatio.toFixed(3)}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-gray-600">
                    ≤ {res.maxAllowedFilling.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 font-mono">{res.velocity.toFixed(2)}</td>
                  <td className="py-3 px-3 font-mono">
                    <span className={res.isSelfCleansingOk ? 'text-emerald-700' : 'text-amber-700'}>
                      {res.selfCleansingCriterion.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {isOver ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                        <XCircle className="w-3 h-3" /> Перегруз
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> В норме
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleDeleteSection(sec.id)}
                      className="text-gray-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                      title="Удалить участок"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add New Section Panel */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <div className="font-bold text-xs uppercase text-gray-700 mb-3 flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-blue-600" />
          Добавить расчетный участок в проект:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3 text-xs">
          <div className="md:col-span-2">
            <label className="text-gray-600 block mb-1">Наименование участка:</label>
            <input
              type="text"
              placeholder="Например: Выпуск К2 / Лежак К1"
              value={newSectionName}
              onChange={e => setNewSectionName(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs outline-hidden"
            />
          </div>
          <div>
            <label className="text-gray-600 block mb-1">Назначение / Лимит:</label>
            <select
              value={newSystemType}
              onChange={e => setNewSystemType(e.target.value as SewerSystemType)}
              className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs outline-hidden cursor-pointer"
            >
              <option value="full_flow_1_0">⚡ Полное (h/d=1.0)</option>
              <option value="rainwater_internal">Водосток (h/d≤0.8)</option>
              <option value="rainwater_external">Ливневка (h/d=1.0)</option>
              <option value="domestic">Бытовая (h/d≤0.6)</option>
            </select>
          </div>
          <div>
            <label className="text-gray-600 block mb-1">Труба ПП:</label>
            <select
              value={newPipeId}
              onChange={e => setNewPipeId(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs outline-hidden cursor-pointer"
            >
              <optgroup label="ПП 2,0 (2,0 МПа / Таблица 11 Добромыслова)">
                {PIPE_CATALOG.filter(p => p.material === 'pp' && !p.id.includes('drain')).map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} (s = {p.wallThickness} мм)
                  </option>
                ))}
              </optgroup>
              <optgroup label="ПП безнапорная (СТБ ГОСТ 32414)">
                {PIPE_CATALOG.filter(p => p.id.includes('drain')).map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
          <div>
            <label className="text-gray-600 block mb-1">Длина L (м):</label>
            <input
              type="number"
              step="0.5"
              value={newLength}
              onChange={e => setNewLength(parseFloat(e.target.value) || 1)}
              className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs font-mono outline-hidden"
            />
          </div>
          <div>
            <label className="text-gray-600 block mb-1">Уклон (i):</label>
            <input
              type="number"
              step="0.005"
              value={newSlope}
              onChange={e => setNewSlope(parseFloat(e.target.value) || 0.02)}
              className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs font-mono outline-hidden"
            />
          </div>
          <div className="flex flex-col justify-end">
            <button
              onClick={handleAddSection}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Добавить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
