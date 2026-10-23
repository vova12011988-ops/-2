import React, { useState } from 'react';
import {
  Calculator,
  Table,
  Layers,
  FileText,
  Sliders,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Printer,
  ChevronRight,
  Info,
  Zap
} from 'lucide-react';
import { QuickCalculator } from './components/QuickCalculator';
import { DobromyslovTable } from './components/DobromyslovTable';
import { FlowRateCalculator } from './components/FlowRateCalculator';
import { NetworkTable } from './components/NetworkTable';
import { ReportView } from './components/ReportView';

type TabType = 'calculator' | 'tables' | 'flow' | 'network' | 'report';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('calculator');
  const [showNormsModal, setShowNormsModal] = useState<boolean>(false);

  const handleApplyFlowFromCalc = (flowLs: number) => {
    setActiveTab('calculator');
  };

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 font-sans flex flex-col">
      {/* Top Navigation Bar - Hidden on print */}
      <header className="bg-slate-900 text-white shadow-md border-b border-slate-800 print:hidden sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm font-black text-sm">
                ДБ
              </div>
              <div>
                <div className="text-base font-bold flex items-center gap-2">
                  <span>Расчет безнапорных сетей (Добромыслов)</span>
                  <span className="text-[10px] uppercase font-semibold bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 px-2 py-0.5 rounded">
                    Нормы РБ • h/d до 1,00
                  </span>
                </div>
                <div className="text-xs text-slate-400 hidden sm:block">
                  Трубы ПП 20–200 мм • Полное наполнение 1,00 • Водостоки h/d ≤ 0,8 • Бытовая h/d ≤ 0,6
                </div>
              </div>
            </div>

            {/* Normative Info button & Print */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowNormsModal(true)}
                className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden md:inline">Справка: Нормы РБ</span>
              </button>

              <button
                onClick={() => setActiveTab('report')}
                className="flex items-center gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium px-3.5 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Записка / Отчет</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 border-t border-slate-800 text-xs sm:text-sm scrollbar-none">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'calculator'
                  ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Калькулятор ПП (20–200 мм)</span>
            </button>

            <button
              onClick={() => setActiveTab('tables')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'tables'
                  ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Table className="w-4 h-4" />
              <span>Таблицы Добромыслова (h/d до 1,0)</span>
            </button>

            <button
              onClick={() => setActiveTab('flow')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'flow'
                  ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Расчет расходов (дождь / бытовой)</span>
            </button>

            <button
              onClick={() => setActiveTab('network')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'network'
                  ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Сеть участков (Ведомость)</span>
            </button>

            <button
              onClick={() => setActiveTab('report')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'report'
                  ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Пояснительная записка</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main App Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 print:p-0 print:m-0 print:max-w-full">
        {activeTab === 'calculator' && <QuickCalculator />}
        {activeTab === 'tables' && <DobromyslovTable />}
        {activeTab === 'flow' && <FlowRateCalculator onApplyFlowRate={handleApplyFlowFromCalc} />}
        {activeTab === 'network' && <NetworkTable />}
        {activeTab === 'report' && <ReportView />}
      </main>

      {/* Footer - Hidden on print */}
      <footer className="bg-white border-t border-gray-200 py-4 print:hidden text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Нормы Республики Беларусь: СН 4.01.03-2019, СП 4.01.11-2025, СН 4.01.02-2019, ТКП 45-4.01-57-2012 и таблицы А.Я. Добромыслова</span>
          </div>
          <div className="text-gray-400">
            Полное сечение: h/d = 1,00 • Водостоки: h/d ≤ 0,8 • Бытовая: h/d ≤ 0,6 (DN ≤ 110)
          </div>
        </div>
      </footer>

      {/* Regulatory Standards Modal */}
      {showNormsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2 text-base font-bold text-gray-900">
                <Info className="w-5 h-5 text-blue-600" />
                Нормы Республики Беларусь по наполнению трубопроводов
              </div>
              <button
                onClick={() => setShowNormsModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
              {/* Full flow 1.0 */}
              <div className="bg-indigo-50 p-3.5 rounded-xl border border-indigo-200 text-indigo-950">
                <div className="font-bold text-sm mb-1 text-indigo-900 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                  1. Режим полного наполнения h/d = 1,00 (100% сечения трубы):
                </div>
                <div className="space-y-1">
                  <div>
                    Согласно <strong>СН 4.01.02-2019</strong> и <strong>ТКП 45-4.01-57-2012 (Республика Беларусь)</strong> гидравлический расчет трубопроводов наружной дождевой (ливневой) канализации при пропуске расчетного расхода допускается выполнять при полном наполнении{' '}
                    <span className="font-bold text-indigo-800 bg-indigo-100 px-1 rounded">h/d = 1,00</span>.
                  </div>
                  <div className="text-[11px] text-indigo-800">
                    Также применяется для поверочных гидравлических расчетов, систем под напором или аварийных переливов.
                  </div>
                </div>
              </div>

              {/* Rainwater internal */}
              <div className="bg-cyan-50 p-3.5 rounded-xl border border-cyan-200 text-cyan-950">
                <div className="font-bold text-sm mb-1 text-cyan-900">
                  🌧️ 2. Внутренние водостоки зданий (СН 4.01.03-2019 п. 9.2 РБ):
                </div>
                <div className="space-y-1">
                  <div>
                    Для горизонтальных подвесных и подпольных самотечных линий водостока расчетное наполнение принимается{' '}
                    <span className="font-bold text-blue-700 bg-blue-100 px-1 rounded">h/d ≤ 0,80</span>{' '}
                    для всех диаметров (20–200 мм). 
                  </div>
                  <div className="text-[11px] text-cyan-800">
                    Запас 20% сечения защищает сеть от защемления воздуха и гидроударов.
                  </div>
                </div>
              </div>

              {/* Domestic standards */}
              <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-amber-950">
                <div className="font-bold text-sm mb-1 text-amber-900">
                  🚽 3. Бытовая канализация зданий (СН 4.01.03-2019 п. 7.4 / СП 4.01.11-2025 РБ):
                </div>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    <strong>Диаметры до 110 мм включительно:</strong>{' '}
                    <span className="font-bold text-rose-700 bg-rose-100 px-1 rounded">h/d ≤ 0,60</span>.
                    Строгое требование вентиляции трубопроводов и предотвращения срыва водяных затворов санитарных приборов.
                  </li>
                  <li>
                    <strong>Диаметры 160–200 мм:</strong>{' '}
                    <span className="font-bold text-amber-800 bg-amber-100 px-1 rounded">h/d ≤ 0,80</span>.
                  </li>
                  <li>
                    <strong>Минимальное наполнение:</strong>{' '}
                    <span className="font-bold">h/d ≥ 0,30</span> (исключение заиливания).
                  </li>
                </ul>
              </div>

              {/* Self-cleansing */}
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-emerald-950">
                <div className="font-bold text-sm mb-1">4. Кинематический критерий самоочищения:</div>
                <div className="font-mono font-bold text-sm bg-white p-2 rounded border border-emerald-300 my-1 inline-block">
                  V · √(h/d) ≥ 0,5 (для труб ПП по СТБ ГОСТ 32414)
                </div>
                <div className="mt-1">
                  Минимальная незаиливающая скорость: <strong>V ≥ 0,7 м/с</strong>. Максимальная допустимая: до <strong>4,0 м/с</strong>.
                </div>
              </div>

              {/* SP Belarus Verification */}
              <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-200 text-indigo-950">
                <div className="font-bold text-sm mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  5. Методика перепроверки по СП 4.01.11-2025 (п. 7.4 РБ):
                </div>
                <div className="text-xs space-y-1">
                  <div>
                    В программе реализован параллельный расчет по формуле Шези–Маннинга: 
                    <span className="font-mono font-bold"> V_СП = (1/n) · R^(2/3) · i^(1/2)</span> при коэффициенте шероховатости 
                    <span className="font-mono font-bold"> n = 0,0095</span>.
                  </div>
                  <div>
                    Сходимость с таблицами Добромыслова составляет <strong>98–99%</strong>, что обеспечивает двойной контроль для государственной экспертизы РБ.
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowNormsModal(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs py-2 px-4 rounded-lg cursor-pointer"
              >
                Понятно, закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
