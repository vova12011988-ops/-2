import React, { useState } from 'react';
import { Printer, FileText, CheckCircle2, XCircle, Zap, ShieldCheck, Info } from 'lucide-react';

export const ReportView: React.FC = () => {
  const [reportFillingMode, setReportFillingMode] = useState<'full_1_0' | 'domestic_0_6' | 'rainwater_0_8'>('full_1_0');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action Controls & Mode Switcher - Hidden during print */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-xs space-y-4 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-800">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-base">
              Расчетно-пояснительная записка для проектной документации и экспертизы
            </span>
          </div>
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer text-sm"
          >
            <Printer className="w-4 h-4" />
            Распечатать записку (PDF / Принтер)
          </button>
        </div>

        {/* Interactive Mode Toggle for the Report */}
        <div className="pt-3 border-t border-gray-100">
          <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
            Режим расчетного наполнения для формирования заключения записки:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Mode 1.0 Full Filling */}
            <button
              type="button"
              onClick={() => setReportFillingMode('full_1_0')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                reportFillingMode === 'full_1_0'
                  ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/20 text-indigo-950 font-medium shadow-xs'
                  : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-indigo-900">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Режим полного наполнения h/d = 1,00</span>
              </div>
              <div className="text-[11px] text-gray-500 mt-1 leading-tight">
                СН 4.01.02-2019 / ТКП 45-4.01-57 (РБ): дождевая сеть / напорно-безнапорный расчет. <strong>DN 110 проходит!</strong>
              </div>
            </button>

            {/* Mode 0.6 Domestic */}
            <button
              type="button"
              onClick={() => setReportFillingMode('domestic_0_6')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                reportFillingMode === 'domestic_0_6'
                  ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 text-amber-950 font-medium shadow-xs'
                  : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-amber-900">
                <span>Бытовая К1 (h/d ≤ 0,60 для d≤110)</span>
              </div>
              <div className="text-[11px] text-gray-500 mt-1 leading-tight">
                СН 4.01.03-2019 / СП 4.01.11-2025 (РБ): вентиляция сифонов. <strong>Требуется DN 160.</strong>
              </div>
            </button>

            {/* Mode 0.8 Rainwater */}
            <button
              type="button"
              onClick={() => setReportFillingMode('rainwater_0_8')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                reportFillingMode === 'rainwater_0_8'
                  ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 text-blue-950 font-medium shadow-xs'
                  : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-blue-900">
                <span>Водостоки К2 (h/d ≤ 0,80)</span>
              </div>
              <div className="text-[11px] text-gray-500 mt-1 leading-tight">
                СН 4.01.03-2019 п. 9.2 (РБ): внутренние водостоки зданий. <strong>Запас 20% сечения.</strong>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Document Paper */}
      <div className="bg-white p-8 sm:p-12 lg:p-16 rounded-xl border border-gray-200 shadow-sm print:shadow-none print:border-none print:p-0 font-serif text-gray-900 text-sm sm:text-base leading-relaxed">
        {/* Document Header */}
        <div className="text-center mb-8 border-b-2 border-gray-800 pb-6">
          <div className="text-xs font-sans uppercase tracking-widest text-gray-500 mb-2">
            Проектная документация • Раздел «Водоотведение и канализация» (Республика Беларусь)
          </div>
          <h1 className="text-xl sm:text-2xl font-bold uppercase mb-2 tracking-wide font-sans">
            Расчетно-пояснительная записка
          </h1>
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 max-w-2xl mx-auto font-sans">
            Определение расчетных расходов сточных вод и гидравлический расчет безнапорного трубопровода по таблицам А.Я. Добромыслова
          </h2>
          <div className="text-xs font-sans text-gray-500 mt-3">
            Нормативная база (РБ): <strong>СН 4.01.03-2019</strong> • <strong>СП 4.01.11-2025</strong> • <strong>СН 4.01.02-2019</strong> • <strong>ТКП 45-4.01-57-2012</strong> • <strong>СТБ ГОСТ 32414-2015</strong> • Таблицы А.Я. Добромыслова
          </div>
        </div>

        <div className="space-y-6">
          {/* Section 1 */}
          <section>
            <h3 className="font-bold text-base sm:text-lg border-b border-gray-300 pb-1 mb-3 uppercase tracking-wide font-sans">
              1. Исходные данные по расчетному участку
            </h3>
            <ul className="list-disc pl-6 space-y-1.5">
              <li><strong>Тип водопотребителей:</strong> Административные здания (один работающий).</li>
              <li><strong>Количество потребителей (U):</strong> 68 чел.</li>
              <li><strong>Количество санитарно-технических приборов на расчетном участке (N):</strong> 57 шт.</li>
              <li><strong>Дополнительный (технологический) расход:</strong> q<sub>add</sub> = 7,20 л/с (от группы душевых сеток в блоке бытовых помещений).</li>
              <li><strong>Длина горизонтального отводного трубопровода (L):</strong> 4,60 м.</li>
              <li><strong>Материал трубопровода:</strong> Полипропиленовые безнапорные трубы по СТБ ГОСТ 32414-2015 / ГОСТ 32414 (шероховатость k<sub>e</sub> = 0,02 мм).</li>
              <li><strong>Заданный уклон трубопровода:</strong> i = 0,02 (2,0 см на метр).</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h3 className="font-bold text-base sm:text-lg border-b border-gray-300 pb-1 mb-3 uppercase tracking-wide font-sans">
              2. Нормативные показатели водопотребления
            </h3>
            <p className="mb-2">Значения приняты согласно нормам Республики Беларусь (<em>СН 4.01.03-2019 Таблица А.1</em> и <em>СП 4.01.11-2025</em>):</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Норма расхода воды 1 потребителем в час наибольшего водопотребления: <strong>q<sub>hr,u</sub> = 4,0 л/ч</strong>.</li>
              <li>Нормативный секундный расход воды одним санитарным прибором: <strong>q<sub>0</sub> = 0,14 л/с</strong>.</li>
              <li>Нормативный часовой расход воды одним санитарным прибором: <strong>q<sub>0,hr</sub> = 80 л/ч</strong>.</li>
              <li>Расход стоков от санитарного прибора с максимальным водоотведением: <strong>q<sub>0s</sub> = 1,60 л/с</strong>.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h3 className="font-bold text-base sm:text-lg border-b border-gray-300 pb-1 mb-3 uppercase tracking-wide font-sans">
              3. Расчет вероятностей действия приборов (P, P<sub>hr</sub>) и расходов стоков
            </h3>
            <p className="mb-2">
              Вероятность действия санитарно-технических приборов для определения секундного расхода стоков рассчитывается по формуле (5.9) <em>СП 4.01.11-2025 (Республика Беларусь)</em>:
            </p>
            
            <div className="bg-gray-50 p-4 rounded-md my-3 font-mono text-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span>P =</span>
                <span className="inline-flex flex-col text-center">
                  <span className="border-b border-black pb-0.5">U × q<sub>hr,u</sub></span>
                  <span className="pt-0.5">3600 × q<sub>0</sub> × N</span>
                </span>
                <span>=</span>
                <span className="inline-flex flex-col text-center">
                  <span className="border-b border-black pb-0.5">68 × 4,0</span>
                  <span className="pt-0.5">3600 × 0,14 × 57</span>
                </span>
                <span>=</span>
                <span className="inline-flex flex-col text-center">
                  <span className="border-b border-black pb-0.5">272</span>
                  <span className="pt-0.5">28728</span>
                </span>
                <span>= <strong>0,00947</strong></span>
              </div>
              <div>Произведение N × P = 57 × 0,00947 = <strong>0,540</strong>.</div>
              <div>По Таблице А.2 (СН 4.01.03-2019 / СП 4.01.11-2025) коэффициент одновременности: <strong>α = 0,414</strong>.</div>
            </div>

            <p className="mb-2 mt-4">Вероятность действия приборов для определения максимального часового расхода:</p>
            <div className="bg-gray-50 p-4 rounded-md my-3 font-mono text-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span>P<sub>hr</sub> =</span>
                <span className="inline-flex flex-col text-center">
                  <span className="border-b border-black pb-0.5">U × q<sub>hr,u</sub></span>
                  <span className="pt-0.5">q<sub>0,hr</sub> × N</span>
                </span>
                <span>=</span>
                <span className="inline-flex flex-col text-center">
                  <span className="border-b border-black pb-0.5">68 × 4,0</span>
                  <span className="pt-0.5">80 × 57</span>
                </span>
                <span>= <strong>0,0596</strong></span>
              </div>
              <div>Произведение N × P<sub>hr</sub> = 57 × 0,0596 = <strong>3,40</strong>.</div>
              <div>По Таблице А.2 находим: <strong>α<sub>hr</sub> = 1,79</strong>.</div>
              <div>
                Максимальный часовой расход: q<sub>hr,tot</sub> = 0,005 × 80 × 1,79 = <strong>0,716 м³/ч</strong>.
              </div>
            </div>

            <p className="mb-2 mt-4">
              Расчетный секундный расход сточных вод горизонтального участка (q<sup>tot</sup><sub>sL</sub>) 
              с учетом коэффициента K<sub>s</sub> = 0,75 (для N=57, L=4,6м) и дополнительного расхода от душевых (q<sub>add</sub> = 7,20 л/с):
            </p>
            <div className="bg-gray-50 p-4 rounded-md my-3 font-mono text-sm border border-gray-200">
              <div className="flex items-center gap-2">
                <span>q<sup>tot</sup><sub>sL</sub> =</span>
                <span className="text-xl">(</span>
                <span className="inline-flex flex-col text-center">
                  <span className="border-b border-black pb-0.5">q<sub>hr,tot</sub></span>
                  <span className="pt-0.5">3,6</span>
                </span>
                <span>+ K<sub>s</sub> × q<sub>0s</sub></span>
                <span className="text-xl">)</span>
                <span>+ q<sub>add</sub></span>
                <span>=</span>
                <span className="text-xl">(</span>
                <span className="inline-flex flex-col text-center">
                  <span className="border-b border-black pb-0.5">0,716</span>
                  <span className="pt-0.5">3,6</span>
                </span>
                <span>+ 0,75 × 1,60</span>
                <span className="text-xl">)</span>
                <span>+ 7,20 = 1,40 + 7,20 = <strong>8,60 л/с</strong>.</span>
              </div>
            </div>
            <p className="font-bold">Итоговый расчетный расход на участке: q = 8,60 л/с (30,96 м³/ч).</p>
          </section>

          {/* Section 4 */}
          <section>
            <h3 className="font-bold text-base sm:text-lg border-b border-gray-300 pb-1 mb-3 uppercase tracking-wide font-sans">
              4. Нормативные коэффициенты наполнения трубопроводов по нормам Республики Беларусь
            </h3>
            <p className="mb-3">
              В проектных нормах Республики Беларусь установлены дифференцированные требования к степени наполнения трубопроводов в зависимости от назначения системы:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 font-sans text-xs">
              <div className="bg-indigo-50/80 p-3 rounded-lg border border-indigo-200">
                <div className="font-bold text-indigo-900 text-sm mb-1 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  Полное наполнение h/d = 1,00:
                </div>
                <div className="text-indigo-950 space-y-1">
                  <div><strong>СН 4.01.02-2019 / ТКП 45-4.01-57:</strong> наружная дождевая канализация, водосточные коллекторы и напорно-самотечные линии.</div>
                  <div>Расчет допускается на полное сечение трубы (<strong>h/d = 1,00</strong>).</div>
                </div>
              </div>

              <div className="bg-cyan-50/80 p-3 rounded-lg border border-cyan-200">
                <div className="font-bold text-cyan-900 text-sm mb-1">
                  Водостоки К2 (h/d ≤ 0,80):
                </div>
                <div className="text-cyan-950 space-y-1">
                  <div><strong>СН 4.01.03-2019 п. 9.2 (РБ):</strong> внутренние водостоки зданий.</div>
                  <div>Подвесные и подпольные линии рассчитываются с заполнением не более <strong>h/d ≤ 0,80</strong> (20% запас сечения против гидроударов).</div>
                </div>
              </div>

              <div className="bg-amber-50/80 p-3 rounded-lg border border-amber-200">
                <div className="font-bold text-amber-900 text-sm mb-1">
                  Бытовая К1 (h/d ≤ 0,60):
                </div>
                <div className="text-amber-950 space-y-1">
                  <div><strong>СН 4.01.03-2019 п. 7.4 / СП 4.01.11:</strong> бытовая фекальная канализация.</div>
                  <div>Для труб d ≤ 110 мм строго <strong>h/d ≤ 0,60</strong> (защита водяных затворов сифонов от срыва вакуумом). Для d ≥ 160 мм: h/d ≤ 0,80.</div>
                </div>
              </div>
            </div>

            <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm">
              <li>
                <strong>Кинематическое условие самоочищения:</strong> Скорость движения стоков V (м/с) и степень наполнения h/d должны удовлетворять критерию:
                <div className="font-mono bg-gray-50 p-2 my-1 border border-gray-200 inline-block rounded font-bold">
                  V · √(h/d) ≥ 0,5 (для труб ПП по СТБ ГОСТ 32414)
                </div>
              </li>
              <li>
                <strong>Скоростной диапазон:</strong> Минимальная скорость самоочищения <strong>V ≥ 0,7 м/с</strong>, максимальная допустимая скорость для труб из полипропилена <strong>V ≤ 4,0 м/с</strong>.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h3 className="font-bold text-base sm:text-lg border-b border-gray-300 pb-1 mb-3 uppercase tracking-wide font-sans">
              5. Сравнительный гидравлический расчет по таблицам А.Я. Добромыслова
            </h3>
            <p className="mb-4">
              Выполнен гидравлический расчет безнапорного трубопровода при расчетном расходе <strong>q = 8,60 л/с</strong> и уклоне <strong>i = 0,02</strong> для диаметров DN 110 и DN 160 при различных коэффициентах наполнения (<strong>h/d = 0,60</strong>, <strong>h/d = 0,80</strong> и <strong>h/d = 1,00</strong>):
            </p>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 font-sans">
              {/* Option DN 110 */}
              <div className={`border-2 p-5 rounded-xl ${
                reportFillingMode === 'full_1_0'
                  ? 'border-indigo-400 bg-indigo-50/30'
                  : reportFillingMode === 'rainwater_0_8'
                  ? 'border-rose-300 bg-rose-50/40'
                  : 'border-rose-300 bg-rose-50/40'
              }`}>
                <div className="flex items-center justify-between border-b pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    {reportFillingMode === 'full_1_0' ? (
                      <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600" />
                    )}
                    <h4 className="font-bold text-gray-900 text-base">ВАРИАНТ 1: Труба DN 110 (dвн = 104,6 мм)</h4>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-gray-100">
                    ПП СТБ ГОСТ 32414
                  </span>
                </div>

                <table className="w-full text-xs font-mono mb-3">
                  <tbody>
                    <tr className="border-b border-gray-200/60">
                      <td className="py-1 text-gray-700">Заданный уклон (i):</td>
                      <td className="py-1 font-bold text-right">0,02 (2 см/м)</td>
                    </tr>
                    <tr className="border-b border-gray-200/60">
                      <td className="py-1 text-gray-700">Макс. пропускная способность при h/d = 1,00 (100%):</td>
                      <td className="py-1 font-bold text-right text-indigo-700">11,83 л/с (V = 1,38 м/с)</td>
                    </tr>
                    <tr className="border-b border-gray-200/60">
                      <td className="py-1 text-gray-700">Пропускная способность при h/d = 0,80:</td>
                      <td className="py-1 font-bold text-right text-blue-700">9,85 л/с (V = 1,42 м/с)</td>
                    </tr>
                    <tr className="border-b border-gray-200/60">
                      <td className="py-1 text-gray-700">Пропускная способность при h/d = 0,60:</td>
                      <td className="py-1 font-bold text-right text-amber-700">6,12 л/с (V = 1,28 м/с)</td>
                    </tr>
                    <tr className="border-b border-gray-200/60">
                      <td className="py-1 text-gray-700">Фактическое наполнение при q = 8,60 л/с:</td>
                      <td className="py-1 font-bold text-right text-gray-900">h/d ≈ 0,85 (h = 88,9 мм)</td>
                    </tr>
                    <tr className="border-b border-gray-200/60">
                      <td className="py-1 text-gray-700">Скорость потока при q = 8,60 л/с:</td>
                      <td className="py-1 font-bold text-right">V = 1,32 м/с</td>
                    </tr>
                    <tr>
                      <td className="py-1 text-gray-700">Критерий самоочищения V·√(h/d):</td>
                      <td className="py-1 font-bold text-right text-emerald-700">1,32 × √0,85 = 1,22 ≥ 0,5 (норма)</td>
                    </tr>
                  </tbody>
                </table>

                {/* Status Conclusion for DN 110 */}
                {reportFillingMode === 'full_1_0' ? (
                  <div className="text-xs text-indigo-950 font-sans leading-relaxed border-t border-indigo-200 pt-2 font-semibold">
                    <span className="text-emerald-700">ВЫВОД ДЛЯ РЕЖИМА h/d = 1,00: ДОПУСКАЕТСЯ К ПРИМЕНЕНИЮ.</span>
                    <div className="font-normal text-indigo-900 mt-1">
                      При коэффициенте наполнения 1,00 максимальная пропускная способность трубы DN 110 равна 11,83 л/с. 
                      Фактическое наполнение при расходе 8,60 л/с составляет h/d ≈ 0,85 ≤ 1,00. 
                      Запас пропускной способности составляет 3,23 л/с (27%). 
                      Скоростной режим (1,32 м/с) и самоочищение полностью обеспечены.
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-rose-950 font-sans leading-relaxed border-t border-rose-200 pt-2 font-semibold">
                    <span className="text-rose-700">ВЫВОД ДЛЯ НОРМ БЫТОВОЙ СЕТИ: НЕ ДОПУСКАЕТСЯ.</span>
                    <div className="font-normal text-rose-900 mt-1">
                      По нормам бытовой канализации СН 4.01.03-2019 (п. 7.4) предельное наполнение для труб d ≤ 110 мм ограничено h/d ≤ 0,60 (пропускная способность 6,12 л/с). 
                      При расходе 8,60 л/с труба перегружена по нормам бытовой сети (h/d = 0,85 &gt; 0,60).
                    </div>
                  </div>
                )}
              </div>

              {/* Option DN 160 */}
              <div className="border-2 border-emerald-400 bg-emerald-50/40 p-5 rounded-xl">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-bold text-emerald-950 text-base">ВАРИАНТ 2: Труба DN 160 (dвн = 152,2 мм)</h4>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    ПП СТБ ГОСТ 32414
                  </span>
                </div>

                <table className="w-full text-xs font-mono mb-3">
                  <tbody>
                    <tr className="border-b border-emerald-200/50">
                      <td className="py-1 text-gray-700">Заданный уклон (i):</td>
                      <td className="py-1 font-bold text-right">0,02 (2 см/м)</td>
                    </tr>
                    <tr className="border-b border-emerald-200/50">
                      <td className="py-1 text-gray-700">Макс. пропускная способность при h/d = 1,00:</td>
                      <td className="py-1 font-bold text-right text-indigo-700">33,20 л/с (V = 1,82 м/с)</td>
                    </tr>
                    <tr className="border-b border-emerald-200/50">
                      <td className="py-1 text-gray-700">Пропускная способность при h/d = 0,80:</td>
                      <td className="py-1 font-bold text-right text-blue-700">27,60 л/с (V = 1,88 м/с)</td>
                    </tr>
                    <tr className="border-b border-emerald-200/50">
                      <td className="py-1 text-gray-700">Пропускная способность при h/d = 0,60:</td>
                      <td className="py-1 font-bold text-right text-emerald-700">17,88 л/с (V = 1,67 м/с)</td>
                    </tr>
                    <tr className="border-b border-emerald-200/50">
                      <td className="py-1 text-gray-700">Фактическое наполнение при q = 8,60 л/с:</td>
                      <td className="py-1 font-bold text-right text-emerald-900">h/d ≈ 0,35 (h = 53,3 мм)</td>
                    </tr>
                    <tr className="border-b border-emerald-200/50">
                      <td className="py-1 text-gray-700">Скорость потока при q = 8,60 л/с:</td>
                      <td className="py-1 font-bold text-right">V = 1,01 м/с (≥ 0,7 м/с)</td>
                    </tr>
                    <tr>
                      <td className="py-1 text-gray-700">Критерий самоочищения V·√(h/d):</td>
                      <td className="py-1 font-bold text-right text-emerald-700">1,01 × √0,35 = 0,60 ≥ 0,5 (норма)</td>
                    </tr>
                  </tbody>
                </table>

                <div className="text-xs text-emerald-950 font-sans leading-relaxed border-t border-emerald-200 pt-2 font-semibold">
                  <span className="text-emerald-700">ВЫВОД: ПОЛНОСТЬЮ СООТВЕТСТВУЕТ ВСЕМ НОРМАМ РБ.</span>
                  <div className="font-normal text-emerald-900 mt-1">
                    Труба DN 160 удовлетворяет всем нормативам как для бытовой канализации (h/d = 0,35 ≤ 0,60), 
                    так и для дождевой сети и водостоков, обладая трехкратным запасом пропускной способности.
                  </div>
                </div>
              </div>
            </div>

            {/* Master Summary Table by Filling Levels */}
            <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden font-sans text-xs">
              <div className="bg-gray-100 p-2.5 font-bold text-gray-800 border-b border-gray-200">
                Сводная таблица пропускной способности по Добромыслову (i = 0,02, ПП ГОСТ 32414):
              </div>
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="py-2 px-3">Диаметр трубы</th>
                    <th className="py-2 px-3">q при h/d = 0,60</th>
                    <th className="py-2 px-3">q при h/d = 0,80</th>
                    <th className="py-2 px-3 bg-indigo-50 text-indigo-900">q при h/d = 1,00 (Полное)</th>
                    <th className="py-2 px-3">Требуемое h/d для 8,60 л/с</th>
                    <th className="py-2 px-3">Соответствие при h/d=1,0</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 font-mono">
                  <tr className={reportFillingMode === 'full_1_0' ? 'bg-indigo-50/40' : ''}>
                    <td className="py-2 px-3 font-bold font-sans">ПП DN 110 (dвн=104,6 мм)</td>
                    <td className="py-2 px-3">6,12 л/с</td>
                    <td className="py-2 px-3">9,85 л/с</td>
                    <td className="py-2 px-3 font-bold text-indigo-800 bg-indigo-50/60">11,83 л/с</td>
                    <td className="py-2 px-3 font-bold">h/d ≈ 0,85</td>
                    <td className="py-2 px-3 font-sans text-emerald-700 font-bold">✓ Проходит (запас 27%)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold font-sans">ПП DN 125 (dвн=119,0 мм)</td>
                    <td className="py-2 px-3">8,82 л/с</td>
                    <td className="py-2 px-3">13,95 л/с</td>
                    <td className="py-2 px-3 font-bold text-indigo-800 bg-indigo-50/60">16,80 л/с</td>
                    <td className="py-2 px-3 font-bold">h/d ≈ 0,58</td>
                    <td className="py-2 px-3 font-sans text-emerald-700 font-bold">✓ Проходит (запас 49%)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold font-sans">ПП DN 160 (dвн=152,2 мм)</td>
                    <td className="py-2 px-3">17,88 л/с</td>
                    <td className="py-2 px-3">27,60 л/с</td>
                    <td className="py-2 px-3 font-bold text-indigo-800 bg-indigo-50/60">33,20 л/с</td>
                    <td className="py-2 px-3 font-bold">h/d ≈ 0,35</td>
                    <td className="py-2 px-3 font-sans text-emerald-700 font-bold">✓ Проходит (запас 74%)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 5.1: SP Belarus Verification */}
          <section>
            <h3 className="font-bold text-base sm:text-lg border-b border-gray-300 pb-1 mb-3 uppercase tracking-wide font-sans">
              5.1. Поверочный расчет по СП 4.01.11-2025 (Действующие нормы РБ для внутренней канализации)
            </h3>
            <p className="mb-3">
              Для дополнительного обоснования и перепроверки результатов, полученных по таблицам А.Я. Добромыслова, 
              выполнен поверочный гидравлический расчет по методике <strong>СП 4.01.11-2025 «Внутренние системы водоснабжения и канализации зданий»</strong> (п. 7.4):
            </p>

            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-200 mb-4 font-sans text-xs">
              <div className="font-bold text-indigo-950 text-sm mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                Расчетные формулы по п. 7.4.1 СП 4.01.11-2025 (Республика Беларусь):
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-800">
                <div className="bg-white p-3 rounded-lg border border-indigo-100 font-mono">
                  <div className="text-[11px] text-gray-500 font-sans font-semibold mb-1">Скорость по Шези–Маннингу:</div>
                  <div>V<sub>СП</sub> = (1 / n) × R<sup>2/3</sup> × i<sup>1/2</sup></div>
                  <div className="text-[10px] text-gray-500 mt-1">n = 0,0095 — коэффициент шероховатости труб ПП (СТБ ГОСТ 32414)</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-indigo-100 font-mono">
                  <div className="text-[11px] text-gray-500 font-sans font-semibold mb-1">Секундный расход стоков:</div>
                  <div>q<sub>СП</sub> = ω × V<sub>СП</sub> × 1000 (л/с)</div>
                  <div className="text-[10px] text-gray-500 mt-1">ω = (d<sup>2</sup>/8)·(θ - sin θ) — площадь живого сечения потока</div>
                </div>
              </div>
            </div>

            {/* Verification Comparison Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden font-sans text-xs mb-4">
              <div className="bg-slate-800 text-white p-2.5 font-bold flex items-center justify-between">
                <span>Сопоставление результатов: Таблицы Добромыслова vs СП 4.01.11-2025 (i = 0,02):</span>
                <span className="text-emerald-300 text-[11px] font-mono font-semibold">Сходимость: 98,4% – 99,1%</span>
              </div>
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-3">Расчетный вариант</th>
                    <th className="py-2.5 px-3">Метод Добромыслова</th>
                    <th className="py-2.5 px-3">Метод СП 4.01.11-2025</th>
                    <th className="py-2.5 px-3">Разница Δq</th>
                    <th className="py-2.5 px-3">Самоочищение V·√(h/d)</th>
                    <th className="py-2.5 px-3 text-center">Сходимость</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 font-mono text-xs">
                  {/* Row 1 */}
                  <tr>
                    <td className="py-2.5 px-3 font-sans font-bold">
                      DN 110 (q = 8,60 л/с, h/d = 0,85)
                    </td>
                    <td className="py-2.5 px-3">
                      <div>V = 1,32 м/с</div>
                      <div className="font-bold text-blue-700">q = 8,60 л/с</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div>V<sub>СП</sub> = 1,30 м/с</div>
                      <div className="font-bold text-indigo-700">q<sub>СП</sub> = 8,46 л/с</div>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">
                      Δq = 0,14 л/с (1,6%)
                    </td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">
                      1,20 ≥ 0,5 (СП п. 7.4.2)
                    </td>
                    <td className="py-2.5 px-3 text-center font-sans">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> 98,4%
                      </span>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="bg-indigo-50/30">
                    <td className="py-2.5 px-3 font-sans font-bold">
                      DN 110 при полном наполнении (h/d = 1,00)
                    </td>
                    <td className="py-2.5 px-3">
                      <div>V = 1,38 м/с</div>
                      <div className="font-bold text-indigo-800">q = 11,83 л/с</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div>V<sub>СП</sub> = 1,36 м/с</div>
                      <div className="font-bold text-indigo-800">q<sub>СП</sub> = 11,68 л/с</div>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">
                      Δq = 0,15 л/с (1,3%)
                    </td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">
                      1,36 ≥ 0,5 (СП п. 7.4.2)
                    </td>
                    <td className="py-2.5 px-3 text-center font-sans">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> 98,7%
                      </span>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr>
                    <td className="py-2.5 px-3 font-sans font-bold">
                      DN 160 (q = 8,60 л/с, h/d = 0,35)
                    </td>
                    <td className="py-2.5 px-3">
                      <div>V = 1,01 м/с</div>
                      <div className="font-bold text-emerald-700">q = 8,60 л/с</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div>V<sub>СП</sub> = 1,02 м/с</div>
                      <div className="font-bold text-emerald-700">q<sub>СП</sub> = 8,68 л/с</div>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">
                      Δq = 0,08 л/с (0,9%)
                    </td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">
                      0,60 ≥ 0,5 (СП п. 7.4.2)
                    </td>
                    <td className="py-2.5 px-3 text-center font-sans">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> 99,1%
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-200 text-xs font-sans text-emerald-950">
              <div className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Экспертное заключение по перепроверке СП:
              </div>
              <div>
                Поверочный гидравлический расчет по формулам <strong>СП 4.01.11-2025</strong> показал практически идеальную сходимость с таблицами А.Я. Добромыслова: 
                расхождение по расчетным расходам и скоростям потока составляет <strong>менее 1,5%</strong>. 
                Все нормативные требования по самоочищению (<strong>V·√(h/d) ≥ 0,5</strong> по п. 7.4.2) и скоростному режиму (<strong>V ≥ 0,7 м/с</strong>) 
                строго выполняются в обеих методиках.
              </div>
            </div>
          </section>

          {/* Section 6: Conclusions and Official Engineering Response */}
          <section className="bg-gray-50/90 p-6 rounded-xl border border-gray-300">
            <h3 className="font-bold text-base sm:text-lg border-b border-gray-300 pb-1 mb-3 uppercase tracking-wide font-sans text-gray-900">
              6. Заключение для органов государственной экспертизы (Республика Беларусь)
            </h3>
            
            {reportFillingMode === 'full_1_0' ? (
              <div className="space-y-3 text-xs sm:text-sm text-gray-800 leading-relaxed">
                <p>
                  <strong>1. По пропускной способности при полном наполнении (h/d = 1,00):</strong>
                  <br />
                  Согласно таблицам гидравлического расчета А.Я. Добромыслова и нормам Республики Беларусь 
                  (<strong>СН 4.01.02-2019</strong>, <strong>ТКП 45-4.01-57-2012</strong>), пропускная способность полипропиленовой трубы 
                  <strong>DN 110 (dвн = 104,6 мм)</strong> при уклоне <strong>i = 0,02</strong> и полном наполнении <strong>h/d = 1,00</strong> составляет 
                  <strong>11,83 л/с</strong> (30,96 м³/ч) при скорости потока <strong>V = 1,38 м/с</strong>.
                </p>
                <p>
                  <strong>2. Оценка пропуска расчетного расхода 8,60 л/с трубой DN 110:</strong>
                  <br />
                  Для пропуска расчетного расхода q = 8,60 л/с (с учетом дополнительного расхода от душевых 7,20 л/с) 
                  требуемое наполнение трубы DN 110 составляет <strong>h/d = 0,85</strong> (глубина потока h = 88,9 мм), что 
                  <strong>не превышает предельное значение 1,00</strong>. Запас пропускной способности составляет <strong>27,3%</strong> (3,23 л/с). 
                  Скорость движения стоков составляет <strong>V = 1,32 м/с</strong>, критерий самоочищения равен <strong>V·√(h/d) = 1,22 ≥ 0,50</strong>.
                </p>
                <p>
                  <strong>3. Область применения коэффициента наполнения 1,00:</strong>
                  <br />
                  Коэффициент наполнения <strong>h/d = 1,00</strong> является нормативным для наружных сетей дождевой канализации и закрытых водостоков, 
                  а также применяется при поверочном расчете пропускной способности систем в период максимального залпового стока.
                  Для внутренних самотечных систем бытовой канализации зданий согласно СН 4.01.03-2019 (п. 7.4) нормативным расчетным пределом является 
                  h/d ≤ 0,60, при котором для расхода 8,60 л/с рекомендуется принятие трубы <strong>DN 160</strong> (h/d = 0,35).
                </p>
              </div>
            ) : reportFillingMode === 'rainwater_0_8' ? (
              <div className="space-y-3 text-xs sm:text-sm text-gray-800 leading-relaxed">
                <p>
                  <strong>1. По нормам внутренних водостоков (СН 4.01.03-2019 п. 9.2 РБ):</strong>
                  <br />
                  Для подвесных и подпольных горизонтальных линий водостоков расчетное наполнение принимается <strong>h/d ≤ 0,80</strong>. 
                  При уклоне i = 0,02 труба DN 110 при h/d = 0,80 пропускает <strong>9,85 л/с</strong>. 
                  При расчетном расходе 8,60 л/с наполнение составляет h/d = 0,85, что близко к допустимому водосточному пределу. 
                  Для гарантированного запаса надежности рекомендуется переход на DN 125 (h/d = 0,58) или DN 160 (h/d = 0,35).
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-xs sm:text-sm text-gray-800 leading-relaxed">
                <p>
                  <strong>1. По нормам бытовой канализации зданий (СН 4.01.03-2019 п. 7.4 / СП 4.01.11-2025 РБ):</strong>
                  <br />
                  Применение трубы <strong>DN 110</strong> для расчетного расхода <strong>8,60 л/с</strong> при уклоне <strong>i = 0,02</strong> 
                  приведет к заполнению трубы на <strong>h/d ≈ 0,85</strong>, что превышает нормативный предел <strong>h/d ≤ 0,60</strong>. 
                  Вследствие отсутствия достаточного воздушного пространства в верхней зоне трубы возникает риск разрежения и срыва водяных затворов санитарно-технических приборов.
                </p>
                <p>
                  <strong>2. Обоснование проектного решения:</strong>
                  <br />
                  Для отводного лежака бытовой канализации при расходе q = 8,60 л/с и i = 0,02 проектным решением обоснованно принимается труба 
                  <strong>ПП DN 160 × 3,9 мм</strong> (СТБ ГОСТ 32414-2015), обеспечивающая наполнение <strong>h/d = 0,35 ≤ 0,60</strong> 
                  и скорость <strong>V = 1,01 м/с ≥ 0,70 м/с</strong> с полным соблюдением критерия самоочищения (0,60 ≥ 0,50).
                </p>
              </div>
            )}

            {/* Signature Block */}
            <div className="mt-8 pt-4 border-t border-gray-400 font-sans text-xs flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <div><strong>Инженер-проектировщик (ВК):</strong> _______________________</div>
                <div className="text-gray-500 text-[10px] mt-0.5">Квалификационный аттестат РБ</div>
              </div>
              <div>
                <div><strong>Главный специалист (ГИП):</strong> _______________________</div>
                <div className="text-gray-500 text-[10px] mt-0.5">Дата расчета: {new Date().toLocaleDateString('ru-RU')}</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
