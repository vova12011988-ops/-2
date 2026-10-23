import React, { useState } from 'react';
import {
  PIPE_CATALOG,
  generateDobromyslovTable,
  getMaxAllowedFilling
} from '../utils/hydraulicCalculations';
import { PipeDefinition, SewerSystemType } from '../types/hydraulic';
import { Table, Download, CheckCircle2, AlertTriangle, XCircle, Info, CloudRain, Home, Zap, Maximize2 } from 'lucide-react';

export const DobromyslovTable: React.FC = () => {
  const [selectedPipeId, setSelectedPipeId] = useState<string>('pp-110');
  const [slope, setSlope] = useState<number>(0.02);
  const [systemType, setSystemType] = useState<SewerSystemType>('rainwater_internal');
  const [customMaxFilling, setCustomMaxFilling] = useState<number | undefined>(undefined);
  const [filterMode, setFilterMode] = useState<'all' | 'normative' | 'full_only'>('all');

  const selectedPipe: PipeDefinition =
    PIPE_CATALOG.find(p => p.id === selectedPipeId) || PIPE_CATALOG[8]; // pp-110

  const maxFilling = getMaxAllowedFilling(selectedPipe, systemType, customMaxFilling);
  const tableData = generateDobromyslovTable(selectedPipe, slope, systemType, customMaxFilling);

  const filteredData =
    filterMode === 'normative'
      ? tableData.filter(row => row.isNormativeFilling)
      : filterMode === 'full_only'
      ? tableData.filter(row => row.hd >= 0.999)
      : tableData;

  const exportCsv = () => {
    const headers = [
      'h/d',
      'h (mm)',
      'omega (cm2)',
      'R (cm)',
      'V (m/s)',
      'q (l/s)',
      'V*sqrt(h/d)',
      'Normative compliance'
    ];
    const rows = tableData.map(r => [
      r.hd.toFixed(2),
      r.depthMm.toFixed(1),
      r.flowAreaCm2.toFixed(1),
      r.hydraulicRadiusCm.toFixed(2),
      r.velocity.toFixed(2),
      r.flowRateLs.toFixed(2),
      r.selfCleansingCriterion.toFixed(2),
      r.isNormativeFilling ? 'Норма' : 'Превышено'
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `таблица_добромыслова_${selectedPipe.dn}мм_i${slope}_${systemType}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Table className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">
              Таблицы А.Я. Добромыслова для безнапорных трубопроводов ПП (20 – 200 мм)
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Справочник пропускной способности с возможностью установки предельного наполнения h/d = 1,00 и по нормам РБ
          </p>
        </div>

        <button
          onClick={exportCsv}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-300 px-3 py-2 rounded-lg transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-gray-500" />
          Экспорт таблицы в CSV
        </button>
      </div>

      {/* System Type and Filling Limit selector bar */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-gray-700 mr-1">Нормативный режим / Коэффициент наполнения:</span>
          
          {/* Button 1.0 Full */}
          <button
            onClick={() => {
              setSystemType('full_flow_1_0');
              setCustomMaxFilling(1.0);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              customMaxFilling === 1.0 || systemType === 'full_flow_1_0'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            Полное наполнение (h/d = 1,00)
          </button>

          <button
            onClick={() => {
              setSystemType('rainwater_internal');
              setCustomMaxFilling(undefined);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              systemType === 'rainwater_internal' && customMaxFilling === undefined
                ? 'bg-blue-600 text-white font-bold shadow-2xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            Водостоки К2 (h/d ≤ 0,80)
          </button>

          <button
            onClick={() => {
              setSystemType('rainwater_external');
              setCustomMaxFilling(undefined);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              systemType === 'rainwater_external' && customMaxFilling === undefined
                ? 'bg-cyan-600 text-white font-bold shadow-2xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            Ливневка К2н (h/d = 1,00)
          </button>

          <button
            onClick={() => {
              setSystemType('domestic');
              setCustomMaxFilling(undefined);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              systemType === 'domestic' && customMaxFilling === undefined
                ? 'bg-amber-600 text-white font-bold shadow-2xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            Бытовая К1 (h/d ≤ 0,60 / 0,80)
          </button>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
        <div>
          <label className="font-bold text-gray-700 block mb-1">
            Труба ПП (DN 20–200 мм):
          </label>
          <select
            value={selectedPipeId}
            onChange={e => setSelectedPipeId(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg p-2 font-medium text-gray-900 outline-hidden cursor-pointer"
          >
            <optgroup label="🔥 Полипропилен ПП 2,0 (2,0 МПа / Таблица 11 Добромыслова, DN 20–200 мм)">
              {PIPE_CATALOG.filter(p => p.material === 'pp' && (p.series?.includes('2,0') || p.id.startsWith('pp-')) && !p.id.includes('drain')).map(pipe => (
                <option key={pipe.id} value={pipe.id}>
                  {pipe.name} (dвн = {pipe.internalDiameterMm} мм, стенка {pipe.wallThickness} мм)
                </option>
              ))}
            </optgroup>
            <optgroup label="📋 Полипропилен безнапорный (СТБ ГОСТ 32414, серия S20)">
              {PIPE_CATALOG.filter(p => p.id.includes('drain')).map(pipe => (
                <option key={pipe.id} value={pipe.id}>
                  {pipe.name} (dвн = {pipe.internalDiameterMm} мм, стенка {pipe.wallThickness} мм)
                </option>
              ))}
            </optgroup>
            <optgroup label="🔩 Другие материалы (Чугун SML, ПВХ)">
              {PIPE_CATALOG.filter(p => p.material !== 'pp').map(pipe => (
                <option key={pipe.id} value={pipe.id}>
                  {pipe.name} (dвн = {pipe.internalDiameterMm} мм)
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        <div>
          <label className="font-bold text-gray-700 block mb-1">Уклон трубопровода (i):</label>
          <select
            value={slope}
            onChange={e => setSlope(parseFloat(e.target.value))}
            className="w-full bg-white border border-gray-300 rounded-lg p-2 font-mono font-bold text-gray-900 outline-hidden cursor-pointer"
          >
            <option value="0.005">0.005 (0.5 см/м)</option>
            <option value="0.008">0.008 (0.8 см/м)</option>
            <option value="0.010">0.010 (1.0 см/м)</option>
            <option value="0.015">0.015 (1.5 см/м)</option>
            <option value="0.020">0.020 (2.0 см/м)</option>
            <option value="0.025">0.025 (2.5 см/м)</option>
            <option value="0.030">0.030 (3.0 см/м)</option>
            <option value="0.040">0.040 (4.0 см/м)</option>
            <option value="0.050">0.050 (5.0 см/м)</option>
          </select>
        </div>

        <div>
          <label className="font-bold text-gray-700 block mb-1">Лимит наполнения h/d:</label>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              step="0.05"
              min="0.1"
              max="1.0"
              value={maxFilling.toFixed(2)}
              onChange={e => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) {
                  setCustomMaxFilling(Math.min(1.0, Math.max(0.1, val)));
                }
              }}
              className="w-full bg-white border border-gray-300 rounded-lg p-2 font-mono font-bold text-gray-900 outline-hidden"
            />
            <button
              type="button"
              onClick={() => setCustomMaxFilling(1.0)}
              className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-bold px-2.5 py-2 rounded-lg whitespace-nowrap cursor-pointer text-[11px]"
              title="Установить полное наполнение 1,00"
            >
              1,00
            </button>
          </div>
        </div>

        <div>
          <label className="font-bold text-gray-700 block mb-1">Фильтр отображения:</label>
          <div className="flex bg-white rounded-lg border border-gray-300 p-0.5">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`flex-1 py-1.5 rounded text-[11px] font-semibold cursor-pointer transition-colors ${
                filterMode === 'all' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Все (0.05–1.0)
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('normative')}
              className={`flex-1 py-1.5 rounded text-[11px] font-semibold cursor-pointer transition-colors ${
                filterMode === 'normative' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ≤ {maxFilling.toFixed(2)}
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('full_only')}
              className={`flex-1 py-1.5 rounded text-[11px] font-semibold cursor-pointer transition-colors ${
                filterMode === 'full_only' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Показать только строку полного сечения h/d = 1.00"
            >
              h/d = 1,00
            </button>
          </div>
        </div>
      </div>

      {/* Normative limit Callout */}
      <div className="bg-indigo-50/80 border-l-4 border-indigo-600 p-3.5 rounded-r-lg text-xs text-indigo-950 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          {maxFilling >= 1.0 ? (
            <span>
              Установлен <strong>режим полного наполнения (h/d = 1,00 / 100% сечения)</strong>. 
              Согласно <strong>СН 4.01.02-2019 / ТКП 45-4.01-57-2012 (Республика Беларусь)</strong> гидравлический расчет трубопроводов наружной дождевой сети 
              допускается выполнять при полном наполнении h/d = 1,00. Полная пропускная способность трубы {selectedPipe.name} при i = {slope} составляет{' '}
              <strong className="text-indigo-900 font-mono underline">
                {tableData.find(r => r.hd >= 0.999)?.flowRateLs.toFixed(2) || '—'} л/с
              </strong>{' '}
              при скорости{' '}
              <strong className="font-mono">
                {tableData.find(r => r.hd >= 0.999)?.velocity.toFixed(2) || '—'} м/с
              </strong>.
            </span>
          ) : systemType === 'rainwater_internal' ? (
            <span>
              В системе <strong>внутренних водостоков (дождевой канализации К2)</strong> по{' '}
              <strong>СН 4.01.03-2019 п. 9.2 (РБ)</strong> расчетное наполнение горизонтальных подвесных линий принимается не более{' '}
              <strong>h/d ≤ 0,80</strong> для исключения гидравлических ударов и подпоров.
            </span>
          ) : (
            <span>
              В <strong>бытовой канализации (К1)</strong> по{' '}
              <strong>СН 4.01.03-2019 п. 7.4 / СП 4.01.11-2025 (РБ)</strong> наполнение для труб d ≤ 110 мм строго ограничено{' '}
              <strong>h/d ≤ 0,60</strong> для сохранения воздушной зоны и предотвращения срыва сифонов.
            </span>
          )}
        </div>
      </div>

      {/* Dobromyslov Data Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="py-3 px-3 font-semibold text-center">Наполнение h/d</th>
              <th className="py-3 px-3 font-semibold">Глубина h (мм)</th>
              <th className="py-3 px-3 font-semibold">Сечение ω (см²)</th>
              <th className="py-3 px-3 font-semibold">Гидр. радиус R (см)</th>
              <th className="py-3 px-3 font-semibold">Скорость V (м/с)</th>
              <th className="py-3 px-3 font-semibold">Расход q (л/с)</th>
              <th className="py-3 px-3 font-semibold">Расход Q (м³/ч)</th>
              <th className="py-3 px-3 font-semibold">V·√(h/d)</th>
              <th className="py-3 px-3 font-semibold text-center">Статус</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map(row => {
              const isExact1_0 = row.hd >= 0.999;
              const isLimit = row.isExactLimit;
              const isNorm = row.isNormativeFilling;

              return (
                <tr
                  key={row.hd}
                  className={`transition-colors ${
                    isExact1_0
                      ? 'bg-indigo-50/90 font-bold border-y-2 border-indigo-400'
                      : isLimit
                      ? 'bg-blue-100 font-semibold'
                      : !isNorm
                      ? 'bg-rose-50/30 hover:bg-rose-50/60'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="py-2.5 px-3 text-center font-mono font-bold">
                    <span className="flex items-center justify-center gap-1.5">
                      {row.hd.toFixed(2)}
                      {isExact1_0 && (
                        <span className="bg-indigo-600 text-white text-[9px] px-1.5 py-0.5 rounded font-sans uppercase">
                          100% Полное
                        </span>
                      )}
                      {isLimit && !isExact1_0 && (
                        <span className="bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded font-sans uppercase">
                          Лимит
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono">{row.depthMm.toFixed(1)}</td>
                  <td className="py-2.5 px-3 font-mono">{row.flowAreaCm2.toFixed(1)}</td>
                  <td className="py-2.5 px-3 font-mono">{row.hydraulicRadiusCm.toFixed(2)}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-gray-900">
                    {row.velocity.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-blue-700 text-sm">
                    {row.flowRateLs.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-gray-700">
                    {(row.flowRateLs * 3.6).toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 font-mono">
                    <span className={row.isSelfCleansingOk ? 'text-emerald-700 font-bold' : 'text-amber-700'}>
                      {row.selfCleansingCriterion.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {isNorm ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> В норме
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                        <XCircle className="w-3 h-3" /> Превышен лимит
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
