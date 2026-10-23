import React from 'react';
import { HydraulicResult } from '../types/hydraulic';

interface PipeCrossSectionProps {
  result: HydraulicResult;
  size?: number; // SVG pixel width/height
}

export const PipeCrossSection: React.FC<PipeCrossSectionProps> = ({ result, size = 320 }) => {
  const { pipe, fillingRatio, depthMm, waterSurfaceWidthMm, status, maxAllowedFilling } = result;

  const radius = size * 0.38; // inner radius in SVG units
  const cx = size / 2;
  const cy = size / 2;

  // Visual wall thickness
  const wallScale = (pipe.wallThickness / pipe.internalDiameterMm) * radius * 3.5;
  const outerRadius = radius + Math.max(5, Math.min(14, wallScale));

  // Clamped filling for drawing
  const clampedHd = Math.max(0.001, Math.min(1.0, fillingRatio));
  const isOverfilled = fillingRatio > maxAllowedFilling;
  const isCompleteOverflow = fillingRatio >= 1.0;

  // Water depth in SVG units from bottom
  const waterDepthSvg = clampedHd * (2 * radius);
  const waterY = cy + radius - waterDepthSvg;

  // Water surface chord endpoints
  // At height y from center: dy = waterY - cy
  const dy = waterY - cy;
  // If |dy| <= radius, we calculate dx
  let dx = 0;
  if (Math.abs(dy) <= radius) {
    dx = Math.sqrt(Math.max(0, radius * radius - dy * dy));
  }

  // Normative limit line Y
  const normDepthSvg = maxAllowedFilling * (2 * radius);
  const normY = cy + radius - normDepthSvg;
  let normDx = 0;
  const normDy = normY - cy;
  if (Math.abs(normDy) <= radius) {
    normDx = Math.sqrt(Math.max(0, radius * radius - normDy * normDy));
  }

  // Path for water body:
  // Starts at left water surface (cx - dx, waterY),
  // circular arc to right water surface (cx + dx, waterY) through bottom (cx, cy + radius)
  // then straight line back to (cx - dx, waterY)
  let waterPath = '';
  if (isCompleteOverflow) {
    waterPath = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 1 0 ${cx + radius} ${cy} A ${radius} ${radius} 0 1 0 ${cx - radius} ${cy} Z`;
  } else if (clampedHd < 0.5) {
    // Arc is less than 180 deg
    waterPath = `M ${cx - dx} ${waterY} A ${radius} ${radius} 0 0 0 ${cx + dx} ${waterY} Z`;
  } else {
    // Arc is greater than 180 deg
    waterPath = `M ${cx - dx} ${waterY} A ${radius} ${radius} 0 1 0 ${cx + dx} ${waterY} Z`;
  }

  // Colors based on status
  let waterFill = 'url(#waterGradSafe)';
  let waterStroke = '#0284c7';
  if (isOverfilled) {
    waterFill = 'url(#waterGradDanger)';
    waterStroke = '#e11d48';
  } else if (status === 'warning' || status === 'acceptable') {
    waterFill = 'url(#waterGradCaution)';
    waterStroke = '#d97706';
  }

  return (
    <div className="flex flex-col items-center select-none">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        <defs>
          {/* Safe Water Gradient */}
          <linearGradient id="waterGradSafe" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.95" />
          </linearGradient>

          {/* Danger / Overfill Water Gradient */}
          <linearGradient id="waterGradDanger" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fb7185" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#e11d48" stopOpacity="0.95" />
          </linearGradient>

          {/* Caution / Low flow Gradient */}
          <linearGradient id="waterGradCaution" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.95" />
          </linearGradient>

          {/* Pipe Material Gradient */}
          <linearGradient id="pipeWallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="50%" stopColor="#475569" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          {/* Air cavity pattern */}
          <pattern id="airPattern" width="10" height="10" patternUnits="userSpaceOnUse">
            <line x1="0" y1="10" x2="10" y2="0" stroke="#cbd5e1" strokeWidth="0.8" opacity="0.6" />
          </pattern>
        </defs>

        {/* Outer Pipe Wall */}
        <circle
          cx={cx}
          cy={cy}
          r={outerRadius}
          fill="url(#pipeWallGrad)"
          stroke="#1e293b"
          strokeWidth="1.5"
        />

        {/* Pipe Inner Cavity Background (Air / Empty Space) */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="#f8fafc"
          stroke="#475569"
          strokeWidth="2"
        />

        {/* Air Space Pattern (Ventilation zone) */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="url(#airPattern)"
        />

        {/* Water Stream */}
        <path
          d={waterPath}
          fill={waterFill}
          stroke={waterStroke}
          strokeWidth="1.5"
        />

        {/* Water Surface Line */}
        {!isCompleteOverflow && dx > 0 && (
          <line
            x1={cx - dx}
            y1={waterY}
            x2={cx + dx}
            y2={waterY}
            stroke={waterStroke}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        )}

        {/* Normative Max Filling Line (e.g. h/d = 0.6) */}
        {normDx > 0 && (
          <g>
            <line
              x1={cx - normDx - 6}
              y1={normY}
              x2={cx + normDx + 6}
              y2={normY}
              stroke="#ef4444"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            <text
              x={cx + radius + 10}
              y={normY + 4}
              fontSize="10"
              fontWeight="bold"
              fill="#ef4444"
              textAnchor="start"
              className="font-mono"
            >
              h/d={maxAllowedFilling} max
            </text>
          </g>
        )}

        {/* Center Crosshair Dotted */}
        <line
          x1={cx - radius}
          y1={cy}
          x2={cx + radius}
          y2={cy}
          stroke="#94a3b8"
          strokeWidth="0.8"
          strokeDasharray="2 2"
          opacity="0.4"
        />
        <line
          x1={cx}
          y1={cy - radius}
          x2={cx}
          y2={cy + radius}
          stroke="#94a3b8"
          strokeWidth="0.8"
          strokeDasharray="2 2"
          opacity="0.4"
        />

        {/* Depth Dimension Line (on left) */}
        <g>
          <line
            x1={cx - radius - 14}
            y1={cy + radius}
            x2={cx - radius - 14}
            y2={waterY}
            stroke="#0284c7"
            strokeWidth="1.2"
          />
          {/* Ticks */}
          <line
            x1={cx - radius - 18}
            y1={cy + radius}
            x2={cx - radius - 10}
            y2={cy + radius}
            stroke="#0284c7"
            strokeWidth="1.2"
          />
          <line
            x1={cx - radius - 18}
            y1={waterY}
            x2={cx - radius - 10}
            y2={waterY}
            stroke="#0284c7"
            strokeWidth="1.2"
          />
          <text
            x={cx - radius - 22}
            y={(cy + radius + waterY) / 2 + 3}
            fontSize="10"
            fontWeight="bold"
            fill="#0369a1"
            textAnchor="end"
            className="font-mono"
          >
            h={depthMm.toFixed(1)} мм
          </text>
        </g>

        {/* Inner Diameter Dimension Label (at bottom) */}
        <text
          x={cx}
          y={cy + radius + 18}
          fontSize="11"
          fontWeight="600"
          fill="#334155"
          textAnchor="middle"
        >
          dвн = {pipe.internalDiameterMm} мм (DN {pipe.dn})
        </text>

        {/* Ventilation Gap Label (Top) */}
        {!isOverfilled && maxAllowedFilling < 1.0 && (
          <text
            x={cx}
            y={cy - radius + 18}
            fontSize="9"
            fill="#64748b"
            textAnchor="middle"
            className="font-medium"
          >
            Воздушный зазор (безнапорный режим)
          </text>
        )}
        {!isOverfilled && maxAllowedFilling >= 1.0 && (
          <text
            x={cx}
            y={cy - radius + 18}
            fontSize="9"
            fill={clampedHd >= 0.99 ? '#4338ca' : '#0284c7'}
            fontWeight={clampedHd >= 0.99 ? 'bold' : 'normal'}
            textAnchor="middle"
            className="font-medium"
          >
            {clampedHd >= 0.99 ? '⚡ Полное сечение (h/d = 1.00 / 100%)' : 'Допустимо наполнение до h/d = 1.0'}
          </text>
        )}
        {isOverfilled && (
          <g>
            <rect
              x={cx - 85}
              y={cy - radius + 8}
              width="170"
              height="20"
              rx="4"
              fill="#fee2e2"
              stroke="#ef4444"
              strokeWidth="1"
            />
            <text
              x={cx}
              y={cy - radius + 22}
              fontSize="10"
              fontWeight="bold"
              fill="#b91c1c"
              textAnchor="middle"
            >
              ПРЕВЫШЕН ЛИМИТ h/d={maxAllowedFilling}!
            </text>
          </g>
        )}
      </svg>

      {/* Cross section metric badges */}
      <div className="grid grid-cols-3 gap-2 w-full mt-3 text-center text-xs">
        <div className={`p-2 rounded-lg border ${
          isOverfilled
            ? 'bg-red-50 border-red-200 text-red-700'
            : 'bg-blue-50 border-blue-200 text-blue-700'
        }`}>
          <div className="text-[10px] uppercase font-semibold text-gray-500">Наполнение h/d</div>
          <div className="text-sm font-bold font-mono">
            {fillingRatio.toFixed(3)}
            <span className="text-[10px] ml-1 font-normal">
              ({(fillingRatio * 100).toFixed(1)}%)
            </span>
          </div>
          <div className="text-[10px] mt-0.5">
            предел: ≤ {maxAllowedFilling}
          </div>
        </div>

        <div className="p-2 rounded-lg border bg-slate-50 border-slate-200 text-slate-700">
          <div className="text-[10px] uppercase font-semibold text-gray-500">Ширина зеркала B</div>
          <div className="text-sm font-bold font-mono">
            {waterSurfaceWidthMm.toFixed(1)} мм
          </div>
          <div className="text-[10px] mt-0.5">
            R = {result.hydraulicRadiusCm.toFixed(2)} см
          </div>
        </div>

        <div className={`p-2 rounded-lg border ${
          result.isSelfCleansingOk
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
            : 'bg-amber-50 border-amber-200 text-amber-700'
        }`}>
          <div className="text-[10px] uppercase font-semibold text-gray-500">Критерий V·√(h/d)</div>
          <div className="text-sm font-bold font-mono">
            {result.selfCleansingCriterion.toFixed(2)}
          </div>
          <div className="text-[10px] mt-0.5">
            норма: ≥ {result.requiredSelfCleansingCriterion}
          </div>
        </div>
      </div>
    </div>
  );
};
