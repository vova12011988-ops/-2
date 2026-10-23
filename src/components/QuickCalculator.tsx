import React, { useState } from 'react';
import {
  PIPE_CATALOG,
  calculatePipeHydraulics,
  comparePipeOptions,
  getMaxAllowedFilling
} from '../utils/hydraulicCalculations';
import { PipeCrossSection } from './PipeCrossSection';
import { HydraulicResult, PipeDefinition, SewerSystemType } from '../types/hydraulic';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Zap,
  Info,
  CloudRain,
  Home,
  Check,
  Maximize2,
  ShieldCheck,
  Scale
} from 'lucide-react';

interface QuickCalculatorProps {
  initialSystemType?: SewerSystemType;
  onSendToNetwork?: (result: HydraulicResult) => void;
  onSendToReport?: (result: HydraulicResult) => void;
}

export const QuickCalculator: React.FC<QuickCalculatorProps> = ({
  initialSystemType = 'rainwater_internal',
  onSendToNetwork,
  onSendToReport
}) => {
  const [systemType, setSystemType] = useState<SewerSystemType>(initialSystemType);
  const [customMaxFilling, setCustomMaxFilling] = useState<number | undefined>(undefined);
  const [selectedPipeId, setSelectedPipeId] = useState<string>('pp-110');
  const [slope, setSlope] = useState<number>(0.02);
  const [calcMode, setCalcMode] = useState<'flow' | 'filling'>('flow');
  const [flowRate, setFlowRate] = useState<number>(9.0); // e.g. typical rainwater roof flow
  const [fillingRatio, setFillingRatio] = useState<number>(0.8);

  const selectedPipe: PipeDefinition =
    PIPE_CATALOG.find(p => p.id === selectedPipeId) || PIPE_CATALOG[8]; // default pp-110

  const currentMaxAllowedFilling = getMaxAllowedFilling(selectedPipe, systemType, customMaxFilling);

  // Perform calculation
  const result: HydraulicResult = calculatePipeHydraulics(
    selectedPipe,
    slope,
    calcMode === 'flow'
      ? { type: 'flowRate', value: Math.max(0.01, flowRate) }
      : { type: 'fillingRatio', value: Math.max(0.05, Math.min(1.0, fillingRatio)) },
    systemType,
    customMaxFilling
  );

  // Compare all PP alternatives for current flow & slope against current limit
  const alternatives = comparePipeOptions(
    calcMode === 'flow' ? flowRate : result.flowRateLs,
    slope,
    systemType,
    'pp',
    customMaxFilling
  );

  const handleApplyPreset = (
    dn: string,
    presetSlope: number,
    presetFlow: number,
    sys: SewerSystemType,
    fillingLimit?: number
  ) => {
    setSystemType(sys);
    setCustomMaxFilling(fillingLimit);
    setSelectedPipeId(dn);
    setSlope(presetSlope);
    setCalcMode('flow');
    setFlowRate(presetFlow);
  };

  const handleSetFilling1_0 = () => {
    setCustomMaxFilling(1.0);
    if (calcMode === 'filling') {
      setFillingRatio(1.0);
    }
  };

  const slopePresets = [0.005, 0.008, 0.01, 0.015, 0.02, 0.025, 0.03, 0.04, 0.05];

  return (
    <div className="space-y-6">
      {/* System Type Selector (К1 бытовая, К2 дождевая, К2н наружная, и Полное наполнение 1,0) */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
            Назначение сети и нормативная база (Республика Беларусь):
          </div>
          <div className="text-xs text-gray-500">
            Выберите тип сети по нормам РБ (СН 4.01.03-2019, СП 4.01.11-2025, СН 4.01.02-2019) или включите режим полного наполнения h/d = 1,00
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Option 1: Rainwater Internal (К2) */}
          <button
            type="button"
            onClick={() => {
              setSystemType('rainwater_internal');
              setCustomMaxFilling(undefined);
              if (calcMode === 'filling') setFillingRatio(0.8);
            }}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              systemType === 'rainwater_internal' && customMaxFilling === undefined
                ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-500/20 text-blue-950 shadow-xs'
                : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
              <CloudRain className="w-4 h-4 text-blue-600" />
              <span>Водостоки зданий (К2)</span>
            </div>
            <div className="text-[11px] text-gray-500 mt-1 leading-tight">
              СН 4.01.03-2019 (п. 9.2 РБ): подвесные линии.{' '}
              <strong className="text-blue-700 block mt-0.5">Лимит: h/d ≤ 0,80</strong>
            </div>
          </button>

          {/* Option 2: Rainwater External (К2н) */}
          <button
            type="button"
            onClick={() => {
              setSystemType('rainwater_external');
              setCustomMaxFilling(undefined);
              if (calcMode === 'filling') setFillingRatio(1.0);
            }}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              systemType === 'rainwater_external' && customMaxFilling === undefined
                ? 'bg-cyan-50/90 border-cyan-500 ring-2 ring-cyan-500/20 text-cyan-950 shadow-xs'
                : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
              <CloudRain className="w-4 h-4 text-cyan-600" />
              <span>Ливневка наружная (К2н)</span>
            </div>
            <div className="text-[11px] text-gray-500 mt-1 leading-tight">
              СН 4.01.02-2019 / ТКП 45-4.01-57 (РБ).{' '}
              <strong className="text-cyan-700 block mt-0.5">Лимит: h/d = 1,00 (100%)</strong>
            </div>
          </button>

          {/* Option 3: Domestic (К1) */}
          <button
            type="button"
            onClick={() => {
              setSystemType('domestic');
              setCustomMaxFilling(undefined);
              if (calcMode === 'filling') setFillingRatio(selectedPipe.dn <= 110 ? 0.6 : 0.8);
            }}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              systemType === 'domestic' && customMaxFilling === undefined
                ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-500/20 text-amber-950 shadow-xs'
                : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
              <Home className="w-4 h-4 text-amber-600" />
              <span>Бытовая сеть (К1)</span>
            </div>
            <div className="text-[11px] text-gray-500 mt-1 leading-tight">
              СН 4.01.03-2019 / СП 4.01.11-2025 (РБ).{' '}
              <strong className="text-amber-800 block mt-0.5">h/d ≤ 0,60 (d≤110) / 0,8 (d≥160)</strong>
            </div>
          </button>

          {/* Option 4: Full flow 1.0 (Highlighted 1.0 mode) */}
          <button
            type="button"
            onClick={() => {
              setSystemType('full_flow_1_0');
              setCustomMaxFilling(1.0);
              if (calcMode === 'filling') setFillingRatio(1.0);
            }}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              customMaxFilling === 1.0 || systemType === 'full_flow_1_0'
                ? 'bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-500 ring-2 ring-indigo-500/30 text-indigo-950 shadow-xs'
                : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
              <Maximize2 className="w-4 h-4 text-indigo-600" />
              <span>Полное наполнение (1,0)</span>
            </div>
            <div className="text-[11px] text-gray-500 mt-1 leading-tight">
              Расчет при 100% сечении трубы.{' '}
              <strong className="text-indigo-700 block mt-0.5">Лимит: h/d = 1,00 (Полное)</strong>
            </div>
          </button>
        </div>

        {/* Quick Filling Coefficient Limit Selector Bar */}
        <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/80 p-3 rounded-lg border border-slate-200/80">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
            <span>Предельный коэффициент наполнения (лимит h/d):</span>
            <span className="bg-blue-600 text-white font-mono px-2 py-0.5 rounded text-xs">
              h/d ≤ {currentMaxAllowedFilling.toFixed(2)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] text-gray-500 mr-1 hidden sm:inline">Быстро установить:</span>
            
            {/* Button 1.0 */}
            <button
              type="button"
              onClick={handleSetFilling1_0}
              className={`px-3 py-1.5 rounded-lg font-bold font-mono transition-all flex items-center gap-1 cursor-pointer ${
                customMaxFilling === 1.0
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white hover:bg-indigo-50 text-indigo-800 border border-indigo-300'
              }`}
            >
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
              h/d = 1,00 (100% Полное)
            </button>

            {/* Button 0.8 */}
            <button
              type="button"
              onClick={() => {
                setCustomMaxFilling(0.8);
                if (calcMode === 'filling') setFillingRatio(0.8);
              }}
              className={`px-2.5 py-1.5 rounded-lg font-medium font-mono transition-colors cursor-pointer ${
                customMaxFilling === 0.8
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              h/d = 0,80 (Водосток)
            </button>

            {/* Button 0.6 */}
            <button
              type="button"
              onClick={() => {
                setCustomMaxFilling(0.6);
                if (calcMode === 'filling') setFillingRatio(0.6);
              }}
              className={`px-2.5 py-1.5 rounded-lg font-medium font-mono transition-colors cursor-pointer ${
                customMaxFilling === 0.6
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              h/d = 0,60 (Бытовая d≤110)
            </button>

            {/* Button Normative Reset */}
            <button
              type="button"
              onClick={() => setCustomMaxFilling(undefined)}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                customMaxFilling === undefined
                  ? 'bg-slate-700 text-white font-bold shadow-xs'
                  : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-300'
              }`}
              title="Использовать стандартный нормативный лимит для выбранного типа сети"
            >
              По нормам РБ
            </button>

            {/* Custom Manual Input */}
            <div className="flex items-center gap-1 pl-1">
              <span className="text-[11px] text-gray-500">Свой:</span>
              <input
                type="number"
                step="0.05"
                min="0.1"
                max="1.0"
                placeholder="1.0"
                value={customMaxFilling ?? ''}
                onChange={e => {
                  const val = parseFloat(e.target.value);
                  if (isNaN(val)) {
                    setCustomMaxFilling(undefined);
                  } else {
                    setCustomMaxFilling(Math.max(0.1, Math.min(1.0, val)));
                  }
                }}
                className="w-16 bg-white border border-gray-300 rounded px-1.5 py-1 text-xs font-mono font-bold text-center outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Presets Bar */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-cyan-50 border border-blue-200/80 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2 text-blue-900 font-medium text-xs sm:text-sm">
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>Быстрые инженерные расчеты:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Preset 1.0 Full Filling */}
          <button
            onClick={() => handleApplyPreset('pp-110', 0.02, 11.83, 'full_flow_1_0', 1.0)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            ⚡ Полное наполнение h/d=1,0 (DN 110, i=0.02, q=11,83 л/с)
          </button>
          <button
            onClick={() => handleApplyPreset('pp-110', 0.02, 9.0, 'rainwater_internal', 0.8)}
            className="bg-white hover:bg-blue-100/60 text-blue-800 border border-blue-300 font-medium px-2.5 py-1.5 rounded-lg transition-colors shadow-2xs cursor-pointer"
          >
            🌧️ Водосток: Кровля 1000 м² (9,0 л/с, h/d≤0,8)
          </button>
          <button
            onClick={() => handleApplyPreset('pp-160', 0.015, 22.5, 'rainwater_internal', 0.8)}
            className="bg-white hover:bg-blue-100/60 text-blue-800 border border-blue-300 font-medium px-2.5 py-1.5 rounded-lg transition-colors shadow-2xs cursor-pointer"
          >
            🌧️ Водосток: Кровля 2500 м² (22,5 л/с)
          </button>
          <button
            onClick={() => handleApplyPreset('pp-110', 0.02, 8.6, 'domestic', 0.6)}
            className="bg-white hover:bg-amber-100/60 text-amber-900 border border-amber-300 font-medium px-2.5 py-1.5 rounded-lg transition-colors shadow-2xs cursor-pointer"
          >
            🚽 Бытовая: Душевые 8,6 л/с (DN 110 vs 160)
          </button>
          <button
            onClick={() => handleApplyPreset('pp-25', 0.03, 0.15, 'rainwater_internal')}
            className="bg-white hover:bg-blue-100/60 text-blue-800 border border-blue-300 font-medium px-2.5 py-1.5 rounded-lg transition-colors shadow-2xs cursor-pointer"
          >
            💧 Кондиционеры (DN 25)
          </button>
        </div>
      </div>

      {/* Main 3-column calculation grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Controls (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-5">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center text-xs">
                1
              </span>
              Параметры трубы ПП (20 – 200 мм)
            </h2>
            <span className="text-[11px] font-mono font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              Лимит: h/d ≤ {currentMaxAllowedFilling.toFixed(2)}
            </span>
          </div>

          {/* Pipe Selection (All PP from 20 to 200) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
              Типоразмер трубы из полипропилена (ПП):
            </label>
            <select
              value={selectedPipeId}
              onChange={e => setSelectedPipeId(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-hidden cursor-pointer"
            >
              <optgroup label="🔥 Трубы ПП 2,0 (2,0 МПа / PN 20, Таблица 11 Добромыслова, DN 20–200 мм)">
                {PIPE_CATALOG.filter(p => p.material === 'pp' && (p.series?.includes('2,0') || p.id.startsWith('pp-')) && !p.id.includes('drain')).map(pipe => (
                  <option key={pipe.id} value={pipe.id}>
                    {pipe.name} (dвн = {pipe.internalDiameterMm} мм, стенка {pipe.wallThickness} мм)
                  </option>
                ))}
              </optgroup>
              <optgroup label="📋 Трубы ПП безнапорная канализация (СТБ ГОСТ 32414, серия S20)">
                {PIPE_CATALOG.filter(p => p.id.includes('drain')).map(pipe => (
                  <option key={pipe.id} value={pipe.id}>
                    {pipe.name} (dвн = {pipe.internalDiameterMm} мм, стенка {pipe.wallThickness} мм)
                  </option>
                ))}
              </optgroup>
              <optgroup label="🔩 Другие материалы (ПВХ, чугун SML)">
                {PIPE_CATALOG.filter(p => p.material !== 'pp').map(pipe => (
                  <option key={pipe.id} value={pipe.id}>
                    {pipe.name} (dвн = {pipe.internalDiameterMm} мм)
                  </option>
                ))}
              </optgroup>
            </select>

            {/* Quick DN Chips for fast switching 20..200 */}
            <div className="pt-2">
              <span className="text-[11px] text-gray-500 block mb-1">
                Быстрый выбор диаметра труб ПП 2,0 (DN):
              </span>
              <div className="flex flex-wrap gap-1">
                {[20, 25, 32, 40, 50, 63, 75, 90, 110, 125, 140, 160, 200].map(dnVal => {
                  const pipeForDn = PIPE_CATALOG.find(p => p.material === 'pp' && p.dn === dnVal && !p.id.includes('drain'));
                  if (!pipeForDn) return null;
                  const isCurrent = selectedPipe.dn === dnVal && !selectedPipe.id.includes('drain');
                  return (
                    <button
                      key={dnVal}
                      type="button"
                      onClick={() => setSelectedPipeId(pipeForDn.id)}
                      className={`text-xs px-2 py-1 rounded font-mono transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-blue-600 text-white font-bold shadow-2xs'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {dnVal}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pipe technical passport card */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-lg p-3 text-xs space-y-1.5 mt-2">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span className="font-bold text-gray-900">{selectedPipe.name}</span>
                <span className="font-mono text-[10px] bg-blue-100 text-blue-900 px-2 py-0.5 rounded font-bold">
                  {selectedPipe.series || selectedPipe.materialName}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-gray-600 pt-1.5 border-t border-slate-200">
                <div>Внутр. d: <strong className="text-gray-900">{selectedPipe.internalDiameterMm} мм</strong></div>
                <div>Стенка s: <strong className="text-blue-700">{selectedPipe.wallThickness} мм</strong></div>
                <div>Наружн. D: <strong className="text-gray-900">{selectedPipe.od} мм</strong></div>
                <div>Шероховатость: <strong className="text-gray-900">{selectedPipe.roughnessKe} мм</strong></div>
              </div>
              <div className="text-[10px] text-gray-500 pt-0.5">
                Норматив: <strong>{selectedPipe.standardNormDoc}</strong>
              </div>
            </div>
          </div>

          {/* Slope Input and Presets */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                Уклон трубопровода (i):
              </label>
              <span className="text-xs font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                i = {slope} ({(slope * 100).toFixed(1)} см/м)
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {slopePresets.map(presetVal => (
                <button
                  key={presetVal}
                  type="button"
                  onClick={() => setSlope(presetVal)}
                  className={`text-xs px-2.5 py-1 rounded-md font-mono transition-colors cursor-pointer ${
                    Math.abs(slope - presetVal) < 0.0001
                      ? 'bg-blue-600 text-white font-bold shadow-2xs'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {presetVal}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="number"
                step="0.001"
                min="0.001"
                max="0.15"
                value={slope}
                onChange={e => setSlope(parseFloat(e.target.value) || 0.001)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
              <span className="text-xs text-gray-500 whitespace-nowrap">м/м (до 0,15)</span>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setCalcMode('flow')}
                className={`flex-1 text-xs py-1.5 font-semibold rounded-md transition-all cursor-pointer ${
                  calcMode === 'flow'
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                По расходу (q)
              </button>
              <button
                type="button"
                onClick={() => setCalcMode('filling')}
                className={`flex-1 text-xs py-1.5 font-semibold rounded-md transition-all cursor-pointer ${
                  calcMode === 'filling'
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                По наполнению (h/d)
              </button>
            </div>

            {calcMode === 'flow' ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-700">
                    Расчетный расход q (л/с):
                  </label>
                  <span className="text-xs font-mono font-bold text-gray-900">
                    {flowRate.toFixed(2)} л/с ({(flowRate * 3.6).toFixed(2)} м³/ч)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0.05"
                    max="50.0"
                    step="0.05"
                    value={flowRate}
                    onChange={e => setFlowRate(parseFloat(e.target.value))}
                    className="flex-1 accent-blue-600 h-2 bg-gray-200 rounded-lg cursor-pointer"
                  />
                  <input
                    type="number"
                    step="0.05"
                    min="0.01"
                    value={flowRate}
                    onChange={e => setFlowRate(parseFloat(e.target.value) || 0)}
                    className="w-24 bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm font-mono font-bold text-right outline-hidden"
                  />
                </div>
                <div className="text-[11px] text-gray-500 flex justify-between">
                  <span>Расчетное наполнение: <strong className="font-mono text-gray-800">{result.fillingRatio.toFixed(3)}</strong></span>
                  <span>Лимит: <strong className="font-mono text-indigo-700">{currentMaxAllowedFilling.toFixed(2)}</strong></span>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-700">
                    Степень наполнения h/d (от 0,05 до 1,00):
                  </label>
                  <span className="text-xs font-mono font-bold text-gray-900 flex items-center gap-1.5">
                    {fillingRatio >= 0.999 && (
                      <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded font-sans">
                        100% ПОЛНОЕ
                      </span>
                    )}
                    {fillingRatio.toFixed(2)} ({(fillingRatio * 100).toFixed(0)}%)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0.05"
                    max="1.0"
                    step="0.01"
                    value={fillingRatio}
                    onChange={e => setFillingRatio(parseFloat(e.target.value))}
                    className="flex-1 accent-indigo-600 h-2 bg-gray-200 rounded-lg cursor-pointer"
                  />
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="1.0"
                    value={fillingRatio}
                    onChange={e => setFillingRatio(Math.min(1.0, Math.max(0.01, parseFloat(e.target.value) || 0.01)))}
                    className="w-20 bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm font-mono font-bold text-right outline-hidden"
                  />
                </div>

                {/* Quick filling values chips */}
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-[10px] text-gray-500 mr-1">Кнопки h/d:</span>
                  {[0.3, 0.5, 0.6, 0.7, 0.8, 0.9].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setFillingRatio(val)}
                      className={`text-[11px] font-mono px-2 py-0.5 rounded cursor-pointer transition-colors ${
                        Math.abs(fillingRatio - val) < 0.01
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {val.toFixed(2)}
                    </button>
                  ))}

                  {/* 1.00 Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setFillingRatio(1.0);
                      setCustomMaxFilling(1.0);
                    }}
                    className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded cursor-pointer transition-colors flex items-center gap-1 ${
                      fillingRatio >= 0.999
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-300'
                    }`}
                  >
                    <Zap className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                    1,00 (Полное)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Max Capacity Notice at Selected Filling Limit */}
          <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-lg text-xs text-indigo-950 space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-600" />
              Предельная пропускная способность при h/d = {currentMaxAllowedFilling.toFixed(2)}:
            </div>
            <div className="font-mono text-sm font-bold text-indigo-900">
              q<sub>max</sub> = {result.maxCapacityAtNormativeFillingLs.toFixed(2)} л/с
              <span className="text-xs font-normal text-indigo-700 ml-2">
                (V = {result.velocityAtNormativeFilling.toFixed(2)} м/с)
              </span>
            </div>
            <div className="text-[11px] text-indigo-800 leading-tight">
              {flowRate > result.maxCapacityAtNormativeFillingLs ? (
                <span className="text-red-600 font-bold">
                  Заданный расход {flowRate.toFixed(2)} л/с превышает пропускную способность трубы при h/d={currentMaxAllowedFilling.toFixed(2)}!
                </span>
              ) : (
                <span>
                  Запас пропускной способности при лимите h/d={currentMaxAllowedFilling.toFixed(2)}: {(result.maxCapacityAtNormativeFillingLs - flowRate).toFixed(2)} л/с.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Middle: Visual Diagram & Core Results (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-gray-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center text-xs">
                  2
                </span>
                Поперечное сечение
              </h2>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                result.status === 'optimal'
                  ? 'bg-emerald-100 text-emerald-800'
                  : result.status === 'acceptable'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {result.status === 'optimal'
                  ? 'В НОРМЕ'
                  : result.status === 'acceptable'
                  ? 'БЕЗРАСЧЕТНЫЙ'
                  : 'НАРУШЕНИЕ НОРМ'}
              </span>
            </div>

            <div className="flex justify-center py-1">
              <PipeCrossSection result={result} size={280} />
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-100 text-xs">
            <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200">
              <span className="text-gray-500 block">Фактическая скорость:</span>
              <span className="font-mono text-base font-bold text-gray-900">
                V = {result.velocity.toFixed(2)} м/с
              </span>
              <span className="text-[10px] text-gray-500 block">
                {result.isVelocityMinOk ? '≥ 0,7 м/с (норма)' : 'ниже 0,7 м/с'}
              </span>
            </div>

            <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200">
              <span className="text-gray-500 block">Площадь потока (ω):</span>
              <span className="font-mono text-base font-bold text-gray-900">
                {result.flowAreaCm2.toFixed(1)} см²
              </span>
              <span className="text-[10px] text-gray-500 block">
                R = {result.hydraulicRadiusCm.toFixed(2)} см
              </span>
            </div>
          </div>
        </div>

        {/* Right: Normative Compliance & Recommendations (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 shadow-xs p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center text-xs">
                  3
                </span>
                Проверка норм
              </h2>
              {currentMaxAllowedFilling >= 1.0 && (
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded">
                  h/d = 1.00
                </span>
              )}
            </div>

            <div className="space-y-2.5 text-xs">
              {/* Check 1: Max Filling for selected system */}
              <div className={`p-2.5 rounded-lg border flex items-start gap-2.5 ${
                result.isFillingOk
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}>
                {result.isFillingOk ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold">
                    Наполнение h/d ≤ {result.maxAllowedFilling.toFixed(2)}
                  </div>
                  <div className="font-mono text-[11px] mt-0.5">
                    Факт: {result.fillingRatio.toFixed(3)}
                    {result.isFillingOk ? ' (в норме)' : ' (ПРЕВЫШЕНО!)'}
                  </div>
                </div>
              </div>

              {/* Check 2: Self-cleansing */}
              <div className={`p-2.5 rounded-lg border flex items-start gap-2.5 ${
                result.isSelfCleansingOk
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50/80 border-amber-200 text-amber-950'
              }`}>
                {result.isSelfCleansingOk ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold">
                    Самоочищение V·√(h/d) ≥ {result.requiredSelfCleansingCriterion}
                  </div>
                  <div className="font-mono text-[11px] mt-0.5">
                    Факт: {result.selfCleansingCriterion.toFixed(2)}
                    {result.isSelfCleansingOk ? ' (обеспечено)' : ' (безрасчетный уклон)'}
                  </div>
                </div>
              </div>

              {/* Check 3: Velocity */}
              <div className={`p-2.5 rounded-lg border flex items-start gap-2.5 ${
                result.isVelocityMinOk && result.isVelocityMaxOk
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                {result.isVelocityMinOk && result.isVelocityMaxOk ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold">Скорость V (0,7 – 4,0 м/с)</div>
                  <div className="font-mono text-[11px] mt-0.5">
                    Факт: {result.velocity.toFixed(2)} м/с
                  </div>
                </div>
              </div>

              {/* Check 4: System Standard Note */}
              <div className="p-2.5 rounded-lg border bg-slate-50 border-slate-200 text-slate-700 text-[11px]">
                <span className="font-semibold block text-slate-800">Нормативная база (РБ):</span>
                {customMaxFilling !== undefined ? (
                  <span>Установлен пользовательский лимит наполнения: h/d ≤ {customMaxFilling.toFixed(2)}</span>
                ) : systemType === 'rainwater_internal' ? (
                  <span>СН 4.01.03-2019 п. 9.2 (Водостоки зданий РБ, h/d ≤ 0,8)</span>
                ) : systemType === 'rainwater_external' ? (
                  <span>СН 4.01.02-2019 / ТКП 45-4.01-57-2012 (Ливневка РБ, h/d = 1,0)</span>
                ) : systemType === 'full_flow_1_0' ? (
                  <span>Режим полного наполнения трубы h/d = 1,00 (100% сечения)</span>
                ) : (
                  <span>СН 4.01.03-2019 п. 7.4 / СП 4.01.11-2025 (Бытовая РБ, h/d ≤ 0,6)</span>
                )}
              </div>
            </div>
          </div>

          {/* Expert Conclusion Box */}
          <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
            result.status === 'optimal'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : result.status === 'acceptable'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            <div className="font-bold mb-1">Заключение:</div>
            <p className="text-[11px]">
              {result.recommendation}
            </p>
          </div>
        </div>
      </div>

      {/* SP Belarus (СП 4.01.11-2025 / СН 4.01.03-2019) Cross-Check Panel */}
      {result.spVerification && (
        <div className="bg-white rounded-xl border-2 border-indigo-200/80 shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                  Перепроверка по СП 4.01.11-2025 (Действующие нормы РБ для внутренней канализации)
                </h3>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Сравнение результатов гидравлического расчета по таблицам А.Я. Добромыслова и по нормативной методике СП 4.01.11-2025 (п. 7.4) / СН 4.01.03-2019
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Сходимость методик: {(100 - Math.min(10, result.spVerification.deltaFlowPercent)).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Side by side comparison cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            {/* Card 1: Dobromyslov Tables */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-3">
              <div className="flex items-center justify-between border-b border-blue-200/80 pb-2">
                <div className="font-bold text-blue-950 text-xs sm:text-sm flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  1. Метод А.Я. Добромыслова (Таблицы)
                </div>
                <span className="text-[11px] font-mono text-blue-700 bg-blue-100 px-2 py-0.5 rounded font-semibold">
                  Колбрук–Уайт (ke = {selectedPipe.roughnessKe} мм)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                  <span className="text-gray-500 block text-[11px]">Скорость потока (V):</span>
                  <span className="font-mono text-sm font-bold text-gray-900">
                    {result.velocity.toFixed(2)} м/с
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                  <span className="text-gray-500 block text-[11px]">Расход потока (q):</span>
                  <span className="font-mono text-sm font-bold text-blue-700">
                    {result.flowRateLs.toFixed(2)} л/с
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                  <span className="text-gray-500 block text-[11px]">Критерий V·√(h/d):</span>
                  <span className="font-mono text-sm font-bold text-emerald-700">
                    {result.selfCleansingCriterion.toFixed(2)}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                  <span className="text-gray-500 block text-[11px]">Коэфф. трения (λ):</span>
                  <span className="font-mono text-sm font-bold text-gray-700">
                    {result.lambda.toFixed(4)}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: SP 4.01.11-2025 Belarus */}
            <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-3">
              <div className="flex items-center justify-between border-b border-indigo-200/80 pb-2">
                <div className="font-bold text-indigo-950 text-xs sm:text-sm flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                  2. Метод СП 4.01.11-2025 (п. 7.4 РБ)
                </div>
                <span className="text-[11px] font-mono text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded font-semibold">
                  Шези–Маннинг (n = {result.spVerification.manningN})
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                  <span className="text-gray-500 block text-[11px]">Скорость V_СП (п. 7.4.1):</span>
                  <span className="font-mono text-sm font-bold text-gray-900">
                    {result.spVerification.velocitySp.toFixed(2)} м/с
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                  <span className="text-gray-500 block text-[11px]">Расход q_СП:</span>
                  <span className="font-mono text-sm font-bold text-indigo-700">
                    {result.spVerification.flowRateSpLs.toFixed(2)} л/с
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                  <span className="text-gray-500 block text-[11px]">Самоочищение V_СП·√(h/d):</span>
                  <span className="font-mono text-sm font-bold text-emerald-700">
                    {result.spVerification.selfCleansingCriterionSp.toFixed(2)}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                  <span className="text-gray-500 block text-[11px]">Норматив К (п. 7.4.2):</span>
                  <span className="font-mono text-sm font-bold text-gray-700">
                    ≥ {result.spVerification.requiredSelfCleansingCriterion.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Convergence Metrics & Official Clauses of SP 4.01.11-2025 */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-indigo-600" />
                Сравнение двух методик расчета:
              </div>
              <div className="font-mono text-[11px] text-slate-700 flex flex-wrap items-center gap-3">
                <span>Разница по расходу: <strong>Δq = {Math.abs(result.spVerification.deltaFlowLs).toFixed(2)} л/с</strong></span>
                <span>Расхождение: <strong className="text-indigo-700">{result.spVerification.deltaFlowPercent.toFixed(1)}%</strong></span>
                <span>Разница по скорости: <strong>ΔV = {Math.abs(result.spVerification.deltaVelocity).toFixed(2)} м/с</strong></span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2 rounded bg-white border border-slate-200">
                <div className="font-bold text-slate-900">п. 7.4.1 СП 4.01.11-2025</div>
                <div className="text-gray-600 mt-0.5">Гидравлический расчет по секундному расходу стоков и обеспечение самоочищения.</div>
              </div>
              <div className="p-2 rounded bg-white border border-slate-200">
                <div className="font-bold text-slate-900">п. 7.4.2 СП 4.01.11-2025</div>
                <div className="text-gray-600 mt-0.5">V·√(h/d) ≥ 0,5 для полимеров, V ≥ 0,7 м/с. Наполнение h/d ≤ 0,60 (d≤110), 0,80 (d≥160).</div>
              </div>
              <div className="p-2 rounded bg-white border border-slate-200">
                <div className="font-bold text-slate-900">п. 7.4.3 СП 4.01.11-2025</div>
                <div className="text-gray-600 mt-0.5">Безрасчетный уклон при малых расходах: i ≥ 0,02 (для 110 мм), i ≥ 0,008 (для 160 мм).</div>
              </div>
              <div className="p-2 rounded bg-white border border-slate-200">
                <div className="font-bold text-slate-900">п. 7.4.6 СП 4.01.11-2025</div>
                <div className="text-gray-600 mt-0.5">Предельный уклон безнапорных трубопроводов i ≤ 0,15 (15 см на метр).</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alternative PP Diameters Comparison Table (20 to 200 mm) */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
          <div>
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Линейка полипропиленовых труб (ПП) от 20 до 200 мм при расходе q = {result.flowRateLs.toFixed(2)} л/с и уклоне i = {slope}
            </h3>
            <p className="text-xs text-gray-500">
              Проверка всех типоразмеров при заданном лимите наполнения (h/d ≤ {currentMaxAllowedFilling.toFixed(2)}) по таблицам А.Я. Добромыслова
            </p>
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b border-gray-200">
                <th className="py-2.5 px-3 font-semibold">Труба ПП</th>
                <th className="py-2.5 px-3 font-semibold">dвн (мм)</th>
                <th className="py-2.5 px-3 font-semibold">Наполнение h/d</th>
                <th className="py-2.5 px-3 font-semibold">Лимит h/d</th>
                <th className="py-2.5 px-3 font-semibold">Скорость V (м/с)</th>
                <th className="py-2.5 px-3 font-semibold">V·√(h/d)</th>
                <th className="py-2.5 px-3 font-semibold">q_max при лимите</th>
                <th className="py-2.5 px-3 font-semibold">Статус</th>
                <th className="py-2.5 px-3 font-semibold text-right">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {alternatives.map(alt => {
                const isCurrent = alt.pipe.id === selectedPipe.id;
                const isOver = !alt.isFillingOk;
                const isOptimal = alt.status === 'optimal';

                return (
                  <tr
                    key={alt.pipe.id}
                    className={`transition-colors ${
                      isCurrent
                        ? 'bg-blue-50/70 font-medium'
                        : isOver
                        ? 'bg-rose-50/30 hover:bg-rose-50/50'
                        : isOptimal
                        ? 'bg-emerald-50/30 hover:bg-emerald-50/50'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="py-2 px-3">
                      <div className="font-bold text-gray-900">{alt.pipe.name}</div>
                    </td>
                    <td className="py-2 px-3 font-mono">{alt.pipe.internalDiameterMm}</td>
                    <td className="py-2 px-3 font-mono">
                      <span className={`px-1.5 py-0.5 rounded font-bold ${
                        isOver
                          ? 'bg-rose-100 text-rose-800'
                          : alt.fillingRatio >= 0.999
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {alt.fillingRatio.toFixed(3)}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-mono text-gray-600">
                      ≤ {alt.maxAllowedFilling.toFixed(2)}
                    </td>
                    <td className="py-2 px-3 font-mono">{alt.velocity.toFixed(2)}</td>
                    <td className="py-2 px-3 font-mono">
                      <span className={alt.isSelfCleansingOk ? 'text-emerald-700 font-bold' : 'text-amber-700'}>
                        {alt.selfCleansingCriterion.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-mono text-blue-700 font-semibold">
                      {alt.maxCapacityAtNormativeFillingLs.toFixed(2)} л/с
                    </td>
                    <td className="py-2 px-3">
                      {isOver ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                          <XCircle className="w-3 h-3" /> Перегруз
                        </span>
                      ) : isOptimal ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> В норме
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3" /> Безрасчетный
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-right">
                      {isCurrent ? (
                        <span className="text-[11px] text-blue-700 font-bold bg-blue-100 px-2 py-1 rounded">
                          Выбран
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedPipeId(alt.pipe.id)}
                          className="text-[11px] bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 font-medium px-2.5 py-1 rounded transition-colors shadow-2xs cursor-pointer"
                        >
                          Выбрать
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
