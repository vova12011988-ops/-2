import React, { useState } from 'react';
import {
  calculateWastewaterFlowRate,
  calculateRainwaterRoofFlowRate
} from '../utils/hydraulicCalculations';
import { Calculator, ArrowRight, CloudRain, Home, MapPin } from 'lucide-react';

interface FlowRateCalculatorProps {
  onApplyFlowRate: (flowLs: number) => void;
}

export const FlowRateCalculator: React.FC<FlowRateCalculatorProps> = ({ onApplyFlowRate }) => {
  const [activeSubTab, setActiveSubTab] = useState<'rainwater' | 'domestic'>('rainwater');

  // Rainwater state (СН 4.01.03-2019 п. 9.3 РБ)
  const [roofAreaM2, setRoofAreaM2] = useState<number>(1000);
  const [q20Intensity, setQ20Intensity] = useState<number>(85); // l/(s*ha) Минск
  const [roofSlopeType, setRoofSlopeType] = useState<'flat' | 'sloped'>('flat');

  // Domestic state (СН 4.01.03-2019 / СП 4.01.11-2025 РБ)
  const [consumersU, setConsumersU] = useState<number>(68);
  const [fixturesN, setFixturesN] = useState<number>(57);
  const [qhrU, setQhrU] = useState<number>(4.0); // л/ч на 1 работающего (Таблица А.1 СН 4.01.03)
  const [q0, setQ0] = useState<number>(0.14); // л/с (Таблица А.1)
  const [q0hr, setQ0hr] = useState<number>(80.0); // л/ч (Таблица А.1)
  const [q0s, setQ0s] = useState<number>(1.6); // л/с (унитаз со смывным бачком)
  const [additionalFlowLs, setAdditionalFlowLs] = useState<number>(7.2); // душевая группа
  const [pipeLengthM, setPipeLengthM] = useState<number>(4.6);

  // Rainwater calculation
  const rainResult = calculateRainwaterRoofFlowRate({
    roofAreaM2,
    q20Intensity,
    roofSlopeType
  });

  // Domestic calculation
  const domesticResult = calculateWastewaterFlowRate({
    consumersU,
    fixturesN,
    qhrU,
    q0,
    q0hr,
    q0s,
    additionalFlowLs,
    pipeLengthM
  });

  // Belarusian regional rain intensity parameters according to СН 4.01.03-2019 / ТКП 45-4.01-57
  const belarusCityPresets = [
    { name: 'Минск', q20: 85 },
    { name: 'Брест', q20: 90 },
    { name: 'Гомель', q20: 90 },
    { name: 'Гродно', q20: 80 },
    { name: 'Витебск', q20: 80 },
    { name: 'Могилев', q20: 80 },
    { name: 'Бобруйск', q20: 85 },
    { name: 'Барановичи', q20: 85 },
    { name: 'Полоцк / Новополоцк', q20: 75 },
    { name: 'Пинск', q20: 85 }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-6">
      {/* Tab Switcher: Rainwater vs Domestic */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">
              Определение расчетных расходов сточных вод (нормы Республики Беларусь)
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            СН 4.01.03-2019 (Раздел 9 «Внутренние водостоки», Приложение А «Нормы водопотребления») и СП 4.01.11-2025
          </p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveSubTab('rainwater')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'rainwater'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CloudRain className="w-4 h-4" />
            <span>Дождевые воды с кровли (К2)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('domestic')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'domestic'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Бытовые стоки (К1)</span>
          </button>
        </div>
      </div>

      {/* RAINWATER CALCULATOR VIEW (РБ) */}
      {activeSubTab === 'rainwater' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Roof Area */}
            <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 text-xs space-y-3">
              <div className="font-bold text-blue-950 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                  1
                </span>
                Площадь водосбора кровли F (м²)
              </div>

              <div>
                <label className="text-gray-600 block mb-1">
                  Площадь водосборной поверхности (м²):
                </label>
                <input
                  type="number"
                  step="50"
                  min="10"
                  value={roofAreaM2}
                  onChange={e => setRoofAreaM2(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2 font-mono font-bold text-sm text-gray-900 outline-hidden"
                />
              </div>

              <div className="flex gap-1.5 pt-1">
                {[200, 500, 1000, 2500, 5000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setRoofAreaM2(val)}
                    className="text-[11px] bg-white hover:bg-blue-100 text-blue-800 border border-blue-200 rounded px-2 py-0.5 cursor-pointer"
                  >
                    {val} м²
                  </button>
                ))}
              </div>
            </div>

            {/* Card 2: Rain Intensity (РБ) */}
            <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 text-xs space-y-3">
              <div className="font-bold text-blue-950 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                  2
                </span>
                Интенсивность q₂₀ (л/с с 1 га) по Беларуси
              </div>

              <div>
                <label className="text-gray-600 block mb-1">
                  Интенсивность дождя q₂₀ (продолжительностью 20 мин):
                </label>
                <input
                  type="number"
                  step="5"
                  min="20"
                  value={q20Intensity}
                  onChange={e => setQ20Intensity(Math.max(10, parseFloat(e.target.value) || 0))}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2 font-mono font-bold text-sm text-gray-900 outline-hidden"
                />
              </div>

              {/* Belarusian Cities presets */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-blue-600" /> Города Республики Беларусь:
                </span>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                  {belarusCityPresets.map(c => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setQ20Intensity(c.q20)}
                      className={`text-[10px] px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                        q20Intensity === c.q20
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-white hover:bg-blue-100 text-blue-900 border border-blue-200'
                      }`}
                    >
                      {c.name} ({c.q20})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3: Roof Type (СН 4.01.03-2019 п. 9.3) */}
            <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 text-xs space-y-3">
              <div className="font-bold text-blue-950 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                  3
                </span>
                Уклон кровли (СН 4.01.03-2019 п. 9.3)
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer">
                  <input
                    type="radio"
                    name="roofSlopeRb"
                    checked={roofSlopeType === 'flat'}
                    onChange={() => setRoofSlopeType('flat')}
                    className="text-blue-600"
                  />
                  <div>
                    <div className="font-bold text-gray-900">Плоская кровля (уклон ≤ 1,5%)</div>
                    <div className="text-[10px] text-gray-500">Q = (F · q₂₀) / 10 000 (л/с)</div>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer">
                  <input
                    type="radio"
                    name="roofSlopeRb"
                    checked={roofSlopeType === 'sloped'}
                    onChange={() => setRoofSlopeType('sloped')}
                    className="text-blue-600"
                  />
                  <div>
                    <div className="font-bold text-gray-900">Скатная кровля (уклон &gt; 1,5%)</div>
                    <div className="text-[10px] text-gray-500">
                      Q = (F · q₅) / 10 000 (q₅ ≈ 1,30 · q₂₀)
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Rainwater Result Banner */}
          <div className="bg-gradient-to-r from-blue-900 to-cyan-900 text-white rounded-xl p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-cyan-200 font-semibold flex items-center gap-1.5">
                  <CloudRain className="w-4 h-4" />
                  Расчетный расход дождевых вод с кровли (СН 4.01.03-2019 п. 9.3):
                </span>
                <div className="text-3xl font-extrabold font-mono text-white flex items-baseline gap-2">
                  <span>{rainResult.designFlowLs.toFixed(2)}</span>
                  <span className="text-base font-normal text-cyan-200">л/с</span>
                  <span className="text-sm font-mono font-normal text-cyan-300 ml-3">
                    ({rainResult.designFlowM3h.toFixed(2)} м³/ч)
                  </span>
                </div>
                <div className="text-xs text-cyan-200 pt-1 font-mono">
                  Q = ({roofAreaM2} м² × {q20Intensity} л/(с·га)
                  {roofSlopeType === 'sloped' ? ' × 1,3' : ''}) / 10 000 ={' '}
                  {rainResult.designFlowLs.toFixed(2)} л/с
                </div>
              </div>

              <button
                onClick={() => onApplyFlowRate(rainResult.designFlowLs)}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-3 rounded-xl transition-all shadow-md flex items-center gap-2 self-start md:self-auto cursor-pointer"
              >
                <span>Применить в расчет водостока ПП</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOMESTIC CALCULATOR VIEW (СН 4.01.03-2019 / СП 4.01.11-2025 РБ) */}
      {activeSubTab === 'domestic' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3 text-xs">
              <div className="font-bold text-gray-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                  1
                </span>
                Потребители и санитарные приборы
              </div>

              <div>
                <label className="text-gray-600 block mb-1">Потребители (U, чел):</label>
                <input
                  type="number"
                  value={consumersU}
                  onChange={e => setConsumersU(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2 font-mono font-bold outline-hidden"
                />
              </div>

              <div>
                <label className="text-gray-600 block mb-1">Количество сантехприборов (N, шт):</label>
                <input
                  type="number"
                  value={fixturesN}
                  onChange={e => setFixturesN(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2 font-mono font-bold outline-hidden"
                />
              </div>

              <div>
                <label className="text-gray-600 block mb-1">Длина отводного лежака (L, м):</label>
                <input
                  type="number"
                  step="0.1"
                  value={pipeLengthM}
                  onChange={e => setPipeLengthM(Math.max(0.5, parseFloat(e.target.value) || 1))}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2 font-mono font-bold outline-hidden"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3 text-xs">
              <div className="font-bold text-gray-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                  2
                </span>
                Нормы расхода (СН 4.01.03-2019, Табл. А.1)
              </div>

              <div>
                <label className="text-gray-600 block mb-1">Расход 1 потребителем (q_hr,u, л/ч):</label>
                <input
                  type="number"
                  step="0.1"
                  value={qhrU}
                  onChange={e => setQhrU(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2 font-mono font-bold outline-hidden"
                />
              </div>

              <div>
                <label className="text-gray-600 block mb-1">Секундный расход прибором (q0, л/с):</label>
                <input
                  type="number"
                  step="0.01"
                  value={q0}
                  onChange={e => setQ0(Math.max(0.01, parseFloat(e.target.value) || 0.01))}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2 font-mono font-bold outline-hidden"
                />
              </div>

              <div>
                <label className="text-gray-600 block mb-1">Макс. прибор (унитаз q0s, л/с):</label>
                <input
                  type="number"
                  step="0.1"
                  value={q0s}
                  onChange={e => setQ0s(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2 font-mono font-bold outline-hidden"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3 text-xs">
              <div className="font-bold text-gray-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                  3
                </span>
                Сосредоточенные нагрузки
              </div>

              <div>
                <label className="text-gray-600 block mb-1">Технологический сброс (q_add, л/с):</label>
                <input
                  type="number"
                  step="0.1"
                  value={additionalFlowLs}
                  onChange={e => setAdditionalFlowLs(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2 font-mono font-bold text-blue-700 outline-hidden"
                />
                <span className="text-[10px] text-gray-500 mt-1 block">
                  Группа душевых сеток в бытовых помещениях
                </span>
              </div>

              <div className="p-3 bg-white rounded-lg border border-gray-200">
                <div className="text-[11px] text-gray-600">Коэффициент Ks (Табл. 7.1 СП 4.01.11):</div>
                <div className="font-mono font-bold text-sm text-gray-900">
                  Ks = {domesticResult.Ks.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-blue-200 font-semibold">
                  Итоговый расчетный расход по формуле (7.2) СП 4.01.11-2025:
                </span>
                <div className="text-3xl font-extrabold font-mono text-white flex items-baseline gap-2">
                  <span>{domesticResult.totalFlowRateLs.toFixed(2)}</span>
                  <span className="text-base font-normal text-blue-200">л/с</span>
                  <span className="text-sm font-mono font-normal text-blue-300 ml-3">
                    ({(domesticResult.totalFlowRateLs * 3.6).toFixed(2)} м³/ч)
                  </span>
                </div>
                <div className="text-xs text-blue-200 font-mono pt-1">
                  P = {domesticResult.P.toFixed(5)} • N·P = {domesticResult.NP.toFixed(2)} • α ={' '}
                  {domesticResult.alpha.toFixed(3)}
                </div>
              </div>

              <button
                onClick={() => onApplyFlowRate(domesticResult.totalFlowRateLs)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-3 rounded-xl transition-all shadow-md flex items-center gap-2 self-start md:self-auto cursor-pointer"
              >
                <span>Применить в расчет бытовой трубы</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
