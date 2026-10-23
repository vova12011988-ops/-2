import {
  PipeDefinition,
  HydraulicResult,
  PipeMaterial,
  SewerSystemType,
  RainwaterCalculationParams,
  SpBelarusVerificationResult
} from '../types/hydraulic';

// Standard library of Polypropylene (ПП) pipes from DN 20 to DN 200 (СТБ ГОСТ 32414 / СТБ 1383-2003 / ГОСТ 32414)
export const PIPE_CATALOG: PipeDefinition[] = [
  // --- ПОЛИПРОПИЛЕН (ПП) ОТ 20 ДО 200 ММ ПО НОРМАМ РБ ---
  {
    id: 'pp-20',
    material: 'pp',
    materialName: 'Полипропилен ПП 2,0 (2,0 МПа)',
    series: 'ПП 2,0 (Таблица 11 Добромыслова)',
    name: 'ПП 2,0 DN/OD 20 × 3,4 мм',
    dn: 20,
    od: 20,
    wallThickness: 3.4,
    internalDiameterMm: 13.2,
    internalDiameterM: 0.0132,
    roughnessKe: 0.02,
    manningN: 0.009,
    maxFillingDomestic: 0.5,
    maxFillingRainwaterInternal: 0.8,
    maxFillingRainwaterExternal: 1.0,
    minSlopeNormative: 0.05,
    standardNormDoc: 'Таблица 11 Добромыслова / СТБ ГОСТ 32415'
  },
  {
    id: 'pp-25',
    material: 'pp',
    materialName: 'Полипропилен ПП 2,0 (2,0 МПа)',
    series: 'ПП 2,0 (Таблица 11 Добромыслова)',
    name: 'ПП 2,0 DN/OD 25 × 4,2 мм',
    dn: 25,
    od: 25,
    wallThickness: 4.2,
    internalDiameterMm: 16.6,
    internalDiameterM: 0.0166,
    roughnessKe: 0.02,
    manningN: 0.009,
    maxFillingDomestic: 0.5,
    maxFillingRainwaterInternal: 0.8,
    maxFillingRainwaterExternal: 1.0,
    minSlopeNormative: 0.04,
    standardNormDoc: 'Таблица 11 Добромыслова / СТБ ГОСТ 32415'
  },
  {
    id: 'pp-32',
    material: 'pp',
    materialName: 'Полипропилен ПП 2,0 (2,0 МПа)',
    series: 'ПП 2,0 (Таблица 11 Добромыслова)',
    name: 'ПП 2,0 DN/OD 32 × 5,4 мм',
    dn: 32,
    od: 32,
    wallThickness: 5.4,
    internalDiameterMm: 21.2,
    internalDiameterM: 0.0212,
    roughnessKe: 0.02,
    manningN: 0.009,
    maxFillingDomestic: 0.5,
    maxFillingRainwaterInternal: 0.8,
    maxFillingRainwaterExternal: 1.0,
    minSlopeNormative: 0.035,
    standardNormDoc: 'Таблица 11 Добромыслова / СТБ ГОСТ 32415'
  },
  {
    id: 'pp-40',
    material: 'pp',
    materialName: 'Полипропилен ПП 2,0 (2,0 МПа)',
    series: 'ПП 2,0 (Таблица 11 Добромыслова)',
    name: 'ПП 2,0 DN/OD 40 × 6,7 мм',
    dn: 40,
    od: 40,
    wallThickness: 6.7,
    internalDiameterMm: 26.6,
    internalDiameterM: 0.0266,
    roughnessKe: 0.02,
    manningN: 0.009,
    maxFillingDomestic: 0.5,
    maxFillingRainwaterInternal: 0.8,
    maxFillingRainwaterExternal: 1.0,
    minSlopeNormative: 0.03,
    standardNormDoc: 'Таблица 11 Добромыслова / СТБ ГОСТ 32415'
  },
  {
    id: 'pp-50',
    material: 'pp',
    materialName: 'Полипропилен ПП 2,0 (2,0 МПа)',
    series: 'ПП 2,0 (Таблица 11 Добромыслова)',
    name: 'ПП 2,0 DN/OD 50 × 8,3 мм',
    dn: 50,
    od: 50,
    wallThickness: 8.3,
    internalDiameterMm: 33.4,
    internalDiameterM: 0.0334,
    roughnessKe: 0.02,
    manningN: 0.009,
    maxFillingDomestic: 0.6,
    maxFillingRainwaterInternal: 0.8,
    maxFillingRainwaterExternal: 1.0,
    minSlopeNormative: 0.03,
    standardNormDoc: 'Таблица 11 Добромыслова / СТБ ГОСТ 32415'
  },
  {
    id: 'pp-63',
    material: 'pp',
    materialName: 'Полипропилен ПП 2,0 (2,0 МПа)',
    series: 'ПП 2,0 (Таблица 11 Добромыслова)',
    name: 'ПП 2,0 DN/OD 63 × 10,5 мм',
    dn: 63,
    od: 63,
    wallThickness: 10.5,
    internalDiameterMm: 42.0,
    internalDiameterM: 0.042,
    roughnessKe: 0.02,
    manningN: 0.009,
    maxFillingDomestic: 0.6,
    maxFillingRainwaterInternal: 0.8,
    maxFillingRainwaterExternal: 1.0,
    minSlopeNormative: 0.025,
    standardNormDoc: 'Таблица 11 Добромыслова / СТБ ГОСТ 32415'
  },
  {
    id: 'pp-75',
    material: 'pp',
    materialName: 'Полипропилен ПП 2,0 (2,0 МПа)',
    series: 'ПП 2,0 (Таблица 11 Добромыслова)',
    name: 'ПП 2,0 DN/OD 75 × 12,5 мм',
    dn: 75,
    od: 75,
    wallThickness: 12.5,
    internalDiameterMm: 50.0,
    internalDiameterM: 0.050,
    roughnessKe: 0.02,
    manningN: 0.0092,
    maxFillingDomestic: 0.6,
    maxFillingRainwaterInternal: 0.8,
    maxFillingRainwaterExternal: 1.0,
    minSlopeNormative: 0.025,
    standardNormDoc: 'Таблица 11 Добромыслова / СТБ ГОСТ 32415'
  },
  {
    id: 'pp-90',
    material: 'pp',
    materialName: 'Полипропилен ПП 2,0 (2,0 МПа)',
    series: 'ПП 2,0 (Таблица 11 Добромыслова)',
    name: 'ПП 2,0 DN/OD 90 × 15,0 мм',
    dn: 90,
    od: 90,
    wallThickness: 15.0,
    internalDiameterMm: 60.0,
    internalDiameterM: 0.060,
    roughnessKe: 0.02,
    manningN: 0.0095,
    maxFillingDomestic: 0.6,
    maxFillingRainwaterInternal: 0.8,
    maxFillingRainwaterExternal: 1.0,
    minSlopeNormative: 0.02,
    standardNormDoc: 'Таблица 11 Добромыслова / СТБ ГОСТ 32415'
  },
  {
    id: 'pp-110',
    material: 'pp',
    materialName: 'Полипропилен ПП 2,0 (2,0 МПа)',
    series: 'ПП 2,0 (Таблица 11 Добромыслова)',
    name: 'ПП 2,0 DN/OD 110 × 18,3 мм',
    dn: 110,
    od: 110,
    wallThickness: 18.3,
    internalDiameterMm: 73.4,
    internalDiameterM: 0.0734,
    roughnessKe: 0.02,
    manningN: 0.0095,
    maxFillingDomestic: 0.6, // h/d <= 0.6 for K1 (СН 4.01.03-2019 РБ)
    maxFillingRainwaterInternal: 0.8, // h/d <= 0.8 (СН 4.01.03-2019 п. 9.2 РБ)
    maxFillingRainwaterExternal: 1.0, // h/d = 1.0 (СН 4.01.02-2019 РБ)
    minSlopeNormative: 0.02,
    standardNormDoc: 'Таблица 11 Добромыслова / СТБ ГОСТ 32415 / СП 4.01.11-2025'
  },
  {
    id: 'pp-125',
    material: 'pp',
    materialName: 'Полипропилен ПП 2,0 (2,0 МПа)',
    series: 'ПП 2,0 (Таблица 11 Добромыслова)',
    name: 'ПП 2,0 DN/OD 125 × 20,8 мм',
    dn: 125,
    od: 125,
    wallThickness: 20.8,
    internalDiameterMm: 83.4,
    internalDiameterM: 0.0834,
    roughnessKe: 0.02,
    manningN: 0.0095,
    maxFillingDomestic: 0.6,
    maxFillingRainwaterInternal: 0.8,
    maxFillingRainwaterExternal: 1.0,
    minSlopeNormative: 0.015,
    standardNormDoc: 'Таблица 11 Добромыслова / СТБ ГОСТ 32415'
  },
  {
    id: 'pp-140',
    material: 'pp',
    materialName: 'Полипропилен ПП 2,0 (2,0 МПа)',
    series: 'ПП 2,0 (Таблица 11 Добромыслова)',
    name: 'ПП 2,0 DN/OD 140 × 23,3 мм',
    dn: 140,
    od: 140,
    wallThickness: 23.3,
    internalDiameterMm: 93.4,
    internalDiameterM: 0.0934,
    roughnessKe: 0.02,
    manningN: 0.0098,
    maxFillingDomestic: 0.7,
    maxFillingRainwaterInternal: 0.8,
    maxFillingRainwaterExternal: 1.0,
    minSlopeNormative: 0.015,
    standardNormDoc: 'Таблица 11 Добромыслова / СТБ ГОСТ 32415'
  },
  {
    id: 'pp-160',
    material: 'pp',
    materialName: 'Полипропилен ПП 2,0 (2,0 МПа)',
    series: 'ПП 2,0 (Таблица 11 Добромыслова)',
    name: 'ПП 2,0 DN/OD 160 × 26,6 мм',
    dn: 160,
    od: 160,
    wallThickness: 26.6,
    internalDiameterMm: 106.8,
    internalDiameterM: 0.1068,
    roughnessKe: 0.02,
    manningN: 0.010,
    maxFillingDomestic: 0.8,
    maxFillingRainwaterInternal: 0.8,
    maxFillingRainwaterExternal: 1.0,
    minSlopeNormative: 0.01,
    standardNormDoc: 'Таблица 11 Добромыслова / СТБ ГОСТ 32415 / СП 4.01.11-2025'
  },
  {
    id: 'pp-200',
    material: 'pp',
    materialName: 'Полипропилен ПП 2,0 (2,0 МПа)',
    series: 'ПП 2,0 (Таблица 11 Добромыслова)',
    name: 'ПП 2,0 DN/OD 200 × 33,2 мм',
    dn: 200,
    od: 200,
    wallThickness: 33.2,
    internalDiameterMm: 133.6,
    internalDiameterM: 0.1336,
    roughnessKe: 0.02,
    manningN: 0.010,
    maxFillingDomestic: 0.8,
    maxFillingRainwaterInternal: 0.8,
    maxFillingRainwaterExternal: 1.0,
    minSlopeNormative: 0.008,
    standardNormDoc: 'Таблица 11 Добромыслова / СТБ ГОСТ 32415 / СП 4.01.11-2025'
  },

  // --- СЕРИЯ: БЕЗНАПОРНАЯ ВНУТРЕННЯЯ КАНАЛИЗАЦИЯ (СТБ ГОСТ 32414, серия S20) ---
  {
    id: 'pp-drain-32',
    material: 'pp',
    materialName: 'Полипропилен безнапорный (СТБ ГОСТ 32414)',
    series: 'ПП безнапорные (СТБ ГОСТ 32414)',
    name: 'ПП безнапорная DN/OD 32 × 1,8 мм (S20)',
    dn: 32,
    od: 32,
    wallThickness: 1.8,
    internalDiameterMm: 28.4,
    internalDiameterM: 0.0284,
    roughnessKe: 0.02,
    manningN: 0.009,
    maxFillingDomestic: 0.5,
    maxFillingRainwaterInternal: 0.8,
    maxFillingRainwaterExternal: 1.0,
    minSlopeNormative: 0.03,
    standardNormDoc: 'СТБ ГОСТ 32414 / СН 4.01.03-2019'
  },
  {
    id: 'pp-drain-40',
    material: 'pp',
    materialName: 'Полипропилен безнапорный (СТБ ГОСТ 32414)',
    series: 'ПП безнапорные (СТБ ГОСТ 32414)',
    name: 'ПП безнапорная DN/OD 40 × 1,8 мм (S20)',
    dn: 40,
    od: 40,
    wallThickness: 1.8,
    internalDiameterMm: 36.4,
    internalDiameterM: 0.0364,
    roughnessKe: 0.02,
    manningN: 0.009,
    maxFillingDomestic: 0.5,
    maxFillingRainwaterInternal: 0.8,
    maxFillingRainwaterExternal: 1.0,
    minSlopeNormative: 0.03,
    standardNormDoc: 'СТБ ГОСТ 32414 / СН 4.01.03-2019'
  },
  {
    id: 'pp-drain-50',
    material: 'pp',
    materialName: 'Полипропилен безнапорный (СТБ ГОСТ 32414)',
    series: 'ПП безнапорные (СТБ ГОСТ 32414)',
    name: 'ПП безнапорная DN/OD 50 × 1,8 мм (S20)',
    dn: 50,
    od: 50,
    wallThickness: 1.8,
    internalDiameterMm: 46.4,
    internalDiameterM: 0.0464,
    roughnessKe: 0.02,
    manningN: 0.009,
    maxFillingDomestic: 0.6,
    maxFillingRainwaterInternal: 0.8,
    maxFillingRainwaterExternal: 1.0,
    minSlopeNormative: 0.03,
    standardNormDoc: 'СТБ ГОСТ 32414 / СН 4.01.03-2019'
  },
  {
    id: 'pp-drain-110',
    material: 'pp',
    materialName: 'Полипропилен безнапорный (СТБ ГОСТ 32414)',
    series: 'ПП безнапорные (СТБ ГОСТ 32414)',
    name: 'ПП безнапорная DN/OD 110 × 2,7 мм (S20)',
    dn: 110,
    od: 110,
    wallThickness: 2.7,
    internalDiameterMm: 104.6,
    internalDiameterM: 0.1046,
    roughnessKe: 0.02,
    manningN: 0.0095,
    maxFillingDomestic: 0.6,
    maxFillingRainwaterInternal: 0.8,
    maxFillingRainwaterExternal: 1.0,
    minSlopeNormative: 0.02,
    standardNormDoc: 'СТБ ГОСТ 32414 / СН 4.01.03-2019'
  },
  {
    id: 'pp-drain-160',
    material: 'pp',
    materialName: 'Полипропилен безнапорный (СТБ ГОСТ 32414)',
    series: 'ПП безнапорные (СТБ ГОСТ 32414)',
    name: 'ПП безнапорная DN/OD 160 × 3,9 мм (S20)',
    dn: 160,
    od: 160,
    wallThickness: 3.9,
    internalDiameterMm: 152.2,
    internalDiameterM: 0.1522,
    roughnessKe: 0.02,
    manningN: 0.010,
    maxFillingDomestic: 0.8,
    maxFillingRainwaterInternal: 0.8,
    maxFillingRainwaterExternal: 1.0,
    minSlopeNormative: 0.008,
    standardNormDoc: 'СТБ ГОСТ 32414 / СН 4.01.03-2019'
  },
  {
    id: 'pp-drain-200',
    material: 'pp',
    materialName: 'Полипропилен безнапорный (СТБ ГОСТ 32414)',
    series: 'ПП безнапорные (СТБ ГОСТ 32414)',
    name: 'ПП безнапорная DN/OD 200 × 4,9 мм (S20)',
    dn: 200,
    od: 200,
    wallThickness: 4.9,
    internalDiameterMm: 190.2,
    internalDiameterM: 0.1902,
    roughnessKe: 0.02,
    manningN: 0.010,
    maxFillingDomestic: 0.8,
    maxFillingRainwaterInternal: 0.8,
    maxFillingRainwaterExternal: 1.0,
    minSlopeNormative: 0.007,
    standardNormDoc: 'СТБ ГОСТ 32414 / СН 4.01.03-2019'
  },

  // --- ДОПОЛНИТЕЛЬНО: ПВХ И ЧУГУН ПО СТАНДАРТАМ РБ ---
  {
    id: 'pvc-110-sn4',
    material: 'pvc',
    materialName: 'ПВХ (наружная/усиленная)',
    name: 'ПВХ DN/OD 110 × 3.2 мм (SN4)',
    dn: 110,
    od: 110,
    wallThickness: 3.2,
    internalDiameterMm: 103.6,
    internalDiameterM: 0.1036,
    roughnessKe: 0.02,
    manningN: 0.0095,
    maxFillingDomestic: 0.6,
    maxFillingRainwaterInternal: 0.8,
    maxFillingRainwaterExternal: 1.0,
    minSlopeNormative: 0.02,
    standardNormDoc: 'СТБ 1383 / СН 4.01.03-2019'
  },
  {
    id: 'sml-100',
    material: 'cast_iron_sml',
    materialName: 'Чугун безраструбный (SML)',
    name: 'SML DN 100 (чугун безраструбный)',
    dn: 100,
    od: 110,
    wallThickness: 5.0,
    internalDiameterMm: 100.0,
    internalDiameterM: 0.100,
    roughnessKe: 0.15,
    manningN: 0.012,
    maxFillingDomestic: 0.6,
    maxFillingRainwaterInternal: 0.8,
    maxFillingRainwaterExternal: 1.0,
    minSlopeNormative: 0.02,
    standardNormDoc: 'ГОСТ 6942 / DIN EN 877'
  },
  {
    id: 'sml-150',
    material: 'cast_iron_sml',
    materialName: 'Чугун безраструбный (SML)',
    name: 'SML DN 150 (чугун безраструбный)',
    dn: 150,
    od: 160,
    wallThickness: 5.0,
    internalDiameterMm: 150.0,
    internalDiameterM: 0.150,
    roughnessKe: 0.15,
    manningN: 0.012,
    maxFillingDomestic: 0.7,
    maxFillingRainwaterInternal: 0.8,
    maxFillingRainwaterExternal: 1.0,
    minSlopeNormative: 0.008,
    standardNormDoc: 'ГОСТ 6942 / DIN EN 877'
  }
];

// Physical constants
const G = 9.80665; // m/s²
const WATER_KINEMATIC_VISCOSITY_10C = 1.306e-6; // m²/s at 10°C (стандартная температура стоков РБ)

/**
 * Returns normative maximum filling ratio based on system type according to Belarus norms:
 * - full_flow_1_0: полное наполнение h/d = 1.00 (100% сечения трубы)
 * - СН 4.01.03-2019 / СП 4.01.11-2025: бытовая К1 (h/d <= 0.6 при d <= 110, h/d <= 0.8 при d >= 160)
 * - СН 4.01.03-2019 п. 9.2: внутренние водостоки К2 (h/d <= 0.8 для всех диаметров)
 * - СН 4.01.02-2019 / СП 4.01.02-2023 / ТКП 45-4.01-57-2012: наружная дождевая К2н (h/d = 1.0)
 */
export function getMaxAllowedFilling(
  pipe: PipeDefinition,
  systemType: SewerSystemType,
  customFilling?: number
): number {
  if (customFilling !== undefined && customFilling > 0) {
    return Math.min(1.0, Math.max(0.1, customFilling));
  }
  switch (systemType) {
    case 'full_flow_1_0':
      return 1.0;
    case 'rainwater_external':
      return pipe.maxFillingRainwaterExternal; // 1.0
    case 'rainwater_internal':
      return pipe.maxFillingRainwaterInternal; // 0.8
    case 'domestic':
      return pipe.maxFillingDomestic; // 0.6 or 0.8
    case 'industrial':
      return pipe.dn <= 110 ? 0.7 : 0.8;
    case 'custom':
      return customFilling ?? 1.0;
    default:
      return pipe.maxFillingDomestic;
  }
}

/**
 * Geometric parameters for partially filled circular pipe
 */
export function calculateCrossSectionGeometry(d: number, hd: number) {
  const clampedHd = Math.max(0.005, Math.min(1.0, hd));
  const h = clampedHd * d;

  if (clampedHd >= 0.999) {
    const area = (Math.PI * d * d) / 4;
    const wettedPerimeter = Math.PI * d;
    return {
      h: d,
      theta: 2 * Math.PI,
      thetaDeg: 360,
      area,
      wettedPerimeter,
      hydraulicRadius: d / 4,
      waterSurfaceWidth: 0
    };
  }

  const cosHalfTheta = Math.max(-1, Math.min(1, 1 - 2 * clampedHd));
  const theta = 2 * Math.acos(cosHalfTheta); // radians

  const area = (Math.pow(d, 2) / 8) * (theta - Math.sin(theta));
  const wettedPerimeter = (d * theta) / 2;
  const hydraulicRadius = wettedPerimeter > 0 ? area / wettedPerimeter : 0;
  const waterSurfaceWidth = d * Math.sin(theta / 2);

  return {
    h,
    theta,
    thetaDeg: (theta * 180) / Math.PI,
    area,
    wettedPerimeter,
    hydraulicRadius,
    waterSurfaceWidth
  };
}

/**
 * Darcy friction factor lambda according to Colebrook-White / Dobromyslov
 */
export function calculateFrictionFactorDobromyslov(
  hydraulicRadius: number,
  roughnessKeMm: number,
  velocity: number,
  viscosity = WATER_KINEMATIC_VISCOSITY_10C
): number {
  const deq = 4 * hydraulicRadius;
  const keM = roughnessKeMm / 1000;
  const re = (velocity * deq) / viscosity;

  if (re < 2000) {
    return Math.max(0.01, 64 / Math.max(10, re));
  }

  let lambda = 0.02;
  const relRoughness = keM / (3.71 * deq);

  for (let iter = 0; iter < 10; iter++) {
    const term = relRoughness + 2.51 / (re * Math.sqrt(lambda));
    if (term <= 0) break;
    const invSqrt = -2 * Math.log10(term);
    const newLambda = 1 / (invSqrt * invSqrt);
    if (Math.abs(newLambda - lambda) < 1e-6) {
      lambda = newLambda;
      break;
    }
    lambda = 0.5 * (lambda + newLambda);
  }

  return Math.min(0.08, Math.max(0.012, lambda));
}

/**
 * Velocity and flow rate calculation using Dobromyslov's formula
 */
export function calculateHydraulicsDirect(
  pipe: PipeDefinition,
  slope: number,
  fillingRatio: number
): {
  velocity: number;
  flowRateLs: number;
  lambda: number;
  reynolds: number;
  geometry: ReturnType<typeof calculateCrossSectionGeometry>;
} {
  const geom = calculateCrossSectionGeometry(pipe.internalDiameterM, fillingRatio);
  const R = geom.hydraulicRadius;

  if (R <= 0 || slope <= 0) {
    return {
      velocity: 0,
      flowRateLs: 0,
      lambda: 0.02,
      reynolds: 0,
      geometry: geom
    };
  }

  let v = (1 / pipe.manningN) * Math.pow(R, 2 / 3) * Math.pow(slope, 1 / 2);
  v = Math.max(0.1, v);

  let lambda = 0.02;

  for (let step = 0; step < 8; step++) {
    lambda = calculateFrictionFactorDobromyslov(R, pipe.roughnessKe, v);
    const vNew = Math.sqrt((8 * G * R * slope) / lambda);
    if (Math.abs(vNew - v) < 1e-4) {
      v = vNew;
      break;
    }
    v = 0.5 * (v + vNew);
  }

  const flowRateM3s = geom.area * v;
  const flowRateLs = flowRateM3s * 1000;
  const reynolds = (v * (4 * R)) / WATER_KINEMATIC_VISCOSITY_10C;

  return {
    velocity: v,
    flowRateLs,
    lambda,
    reynolds,
    geometry: geom
  };
}

/**
 * Inverse solver for filling ratio given target flow rate
 */
export function findFillingRatioForFlow(
  pipe: PipeDefinition,
  slope: number,
  targetFlowRateLs: number
): number {
  if (targetFlowRateLs <= 0) return 0;

  const qAtPeak = calculateHydraulicsDirect(pipe, slope, 0.938).flowRateLs;
  const qAtFull = calculateHydraulicsDirect(pipe, slope, 1.0).flowRateLs;

  if (targetFlowRateLs >= qAtFull && targetFlowRateLs <= qAtPeak) {
    return 1.0;
  }

  if (targetFlowRateLs > qAtPeak) {
    return Math.min(1.2, 1.0 + (targetFlowRateLs - qAtPeak) / qAtPeak);
  }

  let low = 0.005;
  let high = 0.938;

  for (let i = 0; i < 40; i++) {
    const mid = (low + high) / 2;
    const res = calculateHydraulicsDirect(pipe, slope, mid);
    if (Math.abs(res.flowRateLs - targetFlowRateLs) < 0.002) {
      return mid;
    }
    if (res.flowRateLs < targetFlowRateLs) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return (low + high) / 2;
}

/**
 * Cross-check verification of non-pressurized sewer calculations according to current
 * SP standards of Republic of Belarus: СП 4.01.11-2025 (п. 7.4) and СН 4.01.03-2019
 */
export function calculateSpBelarusVerification(
  pipe: PipeDefinition,
  slope: number,
  fillingRatio: number,
  dobromyslovFlowLs: number,
  dobromyslovVelocity: number,
  systemType: SewerSystemType,
  customMaxFilling?: number
): SpBelarusVerificationResult {
  const geom = calculateCrossSectionGeometry(pipe.internalDiameterM, fillingRatio);
  const R = geom.hydraulicRadius;
  const isPlastic = pipe.material === 'pp' || pipe.material === 'pvc' || pipe.material === 'pe';
  const n = isPlastic ? 0.0095 : 0.012; // СП 4.01.11-2025 / СН 4.01.03-2019

  let velocitySp = 0;
  let flowRateSpLs = 0;

  if (R > 0 && slope > 0) {
    velocitySp = (1 / n) * Math.pow(R, 2 / 3) * Math.pow(slope, 1 / 2);
    flowRateSpLs = geom.area * velocitySp * 1000;
  }

  const effectiveHd = Math.min(1.0, fillingRatio);
  const selfCleansingCriterionSp = velocitySp * Math.sqrt(effectiveHd);
  const requiredSelfCleansingCriterion = isPlastic ? 0.5 : 0.6;
  const maxAllowedFilling = getMaxAllowedFilling(pipe, systemType, customMaxFilling);

  const isSelfCleansingOk = selfCleansingCriterionSp >= requiredSelfCleansingCriterion;
  const isVelocityMinOk = velocitySp >= 0.7;
  const maxAllowedVel = isPlastic ? 4.0 : 8.0;
  const isVelocityMaxOk = velocitySp <= maxAllowedVel;
  const isFillingOk = fillingRatio <= maxAllowedFilling + 0.005;

  const deltaFlowLs = dobromyslovFlowLs - flowRateSpLs;
  const denom = Math.max(0.1, (dobromyslovFlowLs + flowRateSpLs) / 2);
  const deltaFlowPercent = (Math.abs(deltaFlowLs) / denom) * 100;
  const deltaVelocity = dobromyslovVelocity - velocitySp;

  const complianceNotes: string[] = [];
  if (isFillingOk) {
    complianceNotes.push(
      `п. 7.4.2 СП 4.01.11: наполнение h/d = ${fillingRatio.toFixed(2)} не превышает предельное ${maxAllowedFilling.toFixed(2)}.`
    );
  } else {
    complianceNotes.push(
      `п. 7.4.2 СП 4.01.11: ПРЕВЫШЕНИЕ наполнения h/d = ${fillingRatio.toFixed(2)} > ${maxAllowedFilling.toFixed(2)}!`
    );
  }

  if (isSelfCleansingOk) {
    complianceNotes.push(
      `п. 7.4.2 СП 4.01.11: условие самоочищения V·√(h/d) = ${selfCleansingCriterionSp.toFixed(2)} ≥ ${requiredSelfCleansingCriterion} выполнено.`
    );
  } else {
    complianceNotes.push(
      `п. 7.4.3 СП 4.01.11: безрасчетный уклон i = ${slope} (норма i ≥ ${pipe.minSlopeNormative}).`
    );
  }

  if (isVelocityMinOk && isVelocityMaxOk) {
    complianceNotes.push(
      `п. 7.4.2 СП 4.01.11: скорость V_СП = ${velocitySp.toFixed(2)} м/с находится в диапазоне 0,7–4,0 м/с.`
    );
  }

  let verdict: 'fully_compatible' | 'acceptable' | 'divergence' = 'fully_compatible';
  if (deltaFlowPercent > 8.0) {
    verdict = 'divergence';
  } else if (deltaFlowPercent > 4.0) {
    verdict = 'acceptable';
  }

  return {
    normDoc: 'СП 4.01.11-2025 / СН 4.01.03-2019 (Республика Беларусь)',
    formulaName: 'Методика Шези–Маннинга и Дарси–Вейсбаха (СП 4.01.11-2025 п. 7.4)',
    manningN: n,
    velocitySp,
    flowRateSpLs,
    flowRateSpM3h: flowRateSpLs * 3.6,
    selfCleansingCriterionSp,
    requiredSelfCleansingCriterion,
    isSelfCleansingOk,
    isVelocityMinOk,
    isVelocityMaxOk,
    isFillingOk,
    deltaFlowLs,
    deltaFlowPercent,
    deltaVelocity,
    complianceNotes,
    verdict,
    clauseReferences: {
      hydraulicCalculation: 'п. 7.4.1 СП 4.01.11-2025',
      selfCleansing: 'п. 7.4.2 СП 4.01.11-2025',
      uncalculatedSlope: 'п. 7.4.3 СП 4.01.11-2025',
      maxSlope: 'п. 7.4.6 СП 4.01.11-2025'
    }
  };
}

/**
 * Comprehensive hydraulic check according to Dobromyslov and Republic of Belarus standards:
 * СН 4.01.03-2019, СП 4.01.11-2025, СН 4.01.02-2019
 */
export function calculatePipeHydraulics(
  pipe: PipeDefinition,
  slope: number,
  param: { type: 'flowRate'; value: number } | { type: 'fillingRatio'; value: number },
  systemType: SewerSystemType = 'domestic',
  customMaxFilling?: number
): HydraulicResult {
  let fillingRatio: number;
  let flowRateLs: number;

  if (param.type === 'flowRate') {
    flowRateLs = param.value;
    fillingRatio = findFillingRatioForFlow(pipe, slope, flowRateLs);
  } else {
    fillingRatio = Math.max(0.01, Math.min(1.0, param.value));
    const direct = calculateHydraulicsDirect(pipe, slope, fillingRatio);
    flowRateLs = direct.flowRateLs;
  }

  const effectiveHdForGeom = Math.min(1.0, fillingRatio);
  const direct = calculateHydraulicsDirect(pipe, slope, effectiveHdForGeom);
  const geom = direct.geometry;

  const maxAllowedFilling = getMaxAllowedFilling(pipe, systemType, customMaxFilling);
  const normDirect = calculateHydraulicsDirect(pipe, slope, Math.min(1.0, maxAllowedFilling));
  const maxCapacityAtNormativeFillingLs = normDirect.flowRateLs;
  const velocityAtNormativeFilling = normDirect.velocity;

  const isPlastic = pipe.material === 'pp' || pipe.material === 'pvc' || pipe.material === 'pe';
  const requiredSelfCleansingCriterion = isPlastic ? 0.5 : 0.6;
  const selfCleansingCriterion = direct.velocity * Math.sqrt(Math.max(0, effectiveHdForGeom));

  // Normative checks:
  const isFillingOk = fillingRatio <= maxAllowedFilling + 0.005;
  const minFillingOk = maxAllowedFilling >= 1.0 ? true : fillingRatio >= 0.25;
  const isVelocityMinOk = direct.velocity >= 0.7;
  const maxAllowedVel = isPlastic ? 4.0 : 8.0;
  const isVelocityMaxOk = direct.velocity <= maxAllowedVel;
  const isSelfCleansingOk = selfCleansingCriterion >= requiredSelfCleansingCriterion;
  const isSlopeOk = slope <= 0.15 && slope > 0;

  const isUncalculatedSection = !isSelfCleansingOk && systemType === 'domestic';
  const isMinNormativeSlopeSatisfied = slope >= pipe.minSlopeNormative - 0.0001;

  const statusMessages: string[] = [];
  let status: 'optimal' | 'acceptable' | 'warning' | 'error' = 'optimal';
  let recommendation = '';

  const systemName =
    systemType === 'full_flow_1_0' || maxAllowedFilling >= 1.0
      ? 'полного наполнения h/d = 1,00 (100% сечения)'
      : systemType === 'custom'
      ? `пользовательского лимита h/d = ${maxAllowedFilling.toFixed(2)}`
      : systemType === 'domestic'
      ? 'бытовой канализации К1 (СН 4.01.03-2019 / СП 4.01.11-2025)'
      : systemType === 'rainwater_internal'
      ? 'внутренних водостоков К2 (СН 4.01.03-2019 п. 9.2)'
      : systemType === 'rainwater_external'
      ? 'наружной дождевой сети К2н (СН 4.01.02-2019 / ТКП 45-4.01-57)'
      : 'производственной канализации К3';

  if (!isFillingOk) {
    status = 'error';
    statusMessages.push(
      `ПРЕВЫШЕНО МАКСИМАЛЬНОЕ НАПОЛНЕНИЕ: расчетное h/d = ${fillingRatio.toFixed(2)} > предельного ${maxAllowedFilling.toFixed(2)} (${systemName}).`
    );
    recommendation = `Труба ${pipe.name} перегружена по расходу (макс. пропускная способность при наполнении h/d=${maxAllowedFilling.toFixed(2)} составляет ${maxCapacityAtNormativeFillingLs.toFixed(2)} л/с). Требуется увеличить диаметр трубы или увеличить уклон.`;
  } else if (!isSlopeOk) {
    status = 'error';
    statusMessages.push(
      `Уклон i = ${slope} превышает максимально допустимый по нормам РБ i_max = 0,15.`
    );
    recommendation = `Уменьшите уклон до величины не более 0,15 (15 см/м).`;
  } else if (!isVelocityMaxOk) {
    status = 'error';
    statusMessages.push(
      `Скорость V = ${direct.velocity.toFixed(2)} м/с превышает допустимую для полипропилена (${maxAllowedVel} м/с). Опасность абразивного износа!`
    );
    recommendation = `Уменьшите уклон трубопровода для снижения скорости потока.`;
  } else if (isSelfCleansingOk && isVelocityMinOk) {
    status = 'optimal';
    statusMessages.push(
      `Все нормативные условия выполнены: наполнение в норме (h/d = ${fillingRatio.toFixed(2)} ≤ ${maxAllowedFilling.toFixed(2)}), условие самоочищения обеспечено (V·√(h/d) = ${selfCleansingCriterion.toFixed(2)} ≥ ${requiredSelfCleansingCriterion}), скорость V ≥ 0,7 м/с.`
    );
    recommendation = `Трубопровод подобран оптимально для ${systemName}. Сеть работает в надежном расчетном режиме.`;
  } else {
    if (systemType === 'rainwater_internal' || systemType === 'rainwater_external' || systemType === 'full_flow_1_0' || maxAllowedFilling >= 1.0) {
      status = 'optimal';
      statusMessages.push(
        `Режим ${maxAllowedFilling >= 1.0 ? 'полного наполнения (h/d = 1.00)' : 'водостока'}: расчетное наполнение h/d = ${fillingRatio.toFixed(2)} ≤ ${maxAllowedFilling.toFixed(2)}. Пропускная способность трубы обеспечена.`
      );
      recommendation = `Допускается к применению (расчетное наполнение h/d = ${fillingRatio.toFixed(2)} не превышает установленный лимит ${maxAllowedFilling.toFixed(2)}).`;
    } else if (isMinNormativeSlopeSatisfied) {
      status = 'acceptable';
      statusMessages.push(
        `Безрасчетный участок бытовой сети: расход мал для самоочищения, но уклон i = ${slope} соответствует нормативному безрасчетному уклону РБ (i ≥ ${pipe.minSlopeNormative}).`
      );
      recommendation = `Допускается к применению как безрасчетный участок по п. 7.4.3 СП 4.01.11-2025 / СН 4.01.03-2019.`;
    } else {
      status = 'warning';
      statusMessages.push(
        `ВНИМАНИЕ: кинематический критерий самоочищения не выполняется, а уклон i = ${slope} меньше нормативного уклона РБ i = ${pipe.minSlopeNormative}!`
      );
      recommendation = `Необходимо увеличить уклон минимум до нормативного i = ${pipe.minSlopeNormative} по нормам РБ (или уменьшить диаметр).`;
    }
  }

  return {
    pipe,
    systemType,
    slope,
    fillingRatio,
    depthMm: geom.h * 1000,
    flowAreaM2: geom.area,
    flowAreaCm2: geom.area * 10000,
    wettedPerimeterM: geom.wettedPerimeter,
    hydraulicRadiusM: geom.hydraulicRadius,
    hydraulicRadiusCm: geom.hydraulicRadius * 100,
    waterSurfaceWidthMm: geom.waterSurfaceWidth * 1000,
    centralAngleDeg: geom.thetaDeg,
    velocity: direct.velocity,
    flowRateLs,
    flowRateM3h: flowRateLs * 3.6,
    lambda: direct.lambda,
    reynolds: direct.reynolds,
    selfCleansingCriterion,
    requiredSelfCleansingCriterion,
    maxAllowedFilling,
    isFillingOk,
    minFillingOk,
    isVelocityMinOk,
    isVelocityMaxOk,
    isSelfCleansingOk,
    isSlopeOk,
    isUncalculatedSection,
    maxCapacityAtNormativeFillingLs,
    velocityAtNormativeFilling,
    status,
    statusMessages,
    recommendation,
    spVerification: calculateSpBelarusVerification(
      pipe,
      slope,
      effectiveHdForGeom,
      flowRateLs,
      direct.velocity,
      systemType,
      customMaxFilling
    )
  };
}

/**
 * Generates full Dobromyslov table
 */
export function generateDobromyslovTable(
  pipe: PipeDefinition,
  slope: number,
  systemType: SewerSystemType = 'domestic',
  customMaxFilling?: number
) {
  const fillingSteps = [
    0.05, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.45, 0.50,
    0.55, 0.60, 0.65, 0.70, 0.75, 0.80, 0.85, 0.90, 0.95, 1.00
  ];

  const maxFilling = getMaxAllowedFilling(pipe, systemType, customMaxFilling);

  return fillingSteps.map(hd => {
    const res = calculatePipeHydraulics(
      pipe,
      slope,
      { type: 'fillingRatio', value: hd },
      systemType,
      customMaxFilling
    );
    return {
      hd,
      depthMm: res.depthMm,
      flowAreaCm2: res.flowAreaCm2,
      hydraulicRadiusCm: res.hydraulicRadiusCm,
      velocity: res.velocity,
      flowRateLs: res.flowRateLs,
      selfCleansingCriterion: res.selfCleansingCriterion,
      isNormativeFilling: hd <= maxFilling + 0.005,
      isSelfCleansingOk: res.isSelfCleansingOk,
      isExactLimit: Math.abs(hd - maxFilling) < 0.005
    };
  });
}

/**
 * Compare all PP pipes from DN 20 to DN 200
 */
export function comparePipeOptions(
  flowRateLs: number,
  slope: number,
  systemType: SewerSystemType = 'domestic',
  materialFilter: PipeMaterial = 'pp',
  customMaxFilling?: number
) {
  const filtered = PIPE_CATALOG.filter(p => p.material === materialFilter);

  return filtered.map(pipe => {
    return calculatePipeHydraulics(
      pipe,
      slope,
      { type: 'flowRate', value: flowRateLs },
      systemType,
      customMaxFilling
    );
  });
}

/**
 * Flow rate calculation for rainwater roof drainage according to Republic of Belarus standards:
 * СН 4.01.03-2019 (п. 9.3) / СП 4.01.11-2025 (п. 9.3):
 * Q = (F * q20) / 10000 (л/с) для кровель с уклоном до 1.5%
 * Q = (F * q5) / 10000 (л/с) для кровель с уклоном более 1.5% (скатные кровли, q5 ≈ 1.30 * q20)
 */
export function calculateRainwaterRoofFlowRate(params: RainwaterCalculationParams) {
  const { roofAreaM2, q20Intensity, roofSlopeType } = params;
  
  const slopeMultiplier = roofSlopeType === 'sloped' ? 1.3 : 1.0;
  const designFlowLs = (roofAreaM2 * q20Intensity * slopeMultiplier) / 10000;

  return {
    roofAreaM2,
    q20Intensity,
    slopeMultiplier,
    designFlowLs,
    designFlowM3h: designFlowLs * 3.6
  };
}

/**
 * Calculation of domestic wastewater flow rate according to Republic of Belarus standards:
 * СН 4.01.03-2019 (Приложение А, Таблицы А.1, А.2) / СП 4.01.11-2025 (формулы 5.9, 7.2)
 */
export function calculateWastewaterFlowRate(params: {
  consumersU: number;
  fixturesN: number;
  qhrU: number;
  q0: number;
  q0hr: number;
  q0s: number;
  additionalFlowLs: number;
  pipeLengthM: number;
}) {
  const { consumersU, fixturesN, qhrU, q0, q0hr, q0s, additionalFlowLs, pipeLengthM } = params;

  // Вероятность P по формуле (5.9) СП 4.01.11-2025: P = (U * qhrU) / (3600 * q0 * N)
  const P = (consumersU * qhrU) / (3600 * q0 * Math.max(1, fixturesN));
  const NP = fixturesN * P;

  // Таблица А.2 СН 4.01.03-2019
  let alpha = 0;
  if (NP <= 0.1) {
    alpha = NP;
  } else if (NP <= 0.5) {
    alpha = 0.2 + 0.4 * (NP - 0.1);
  } else if (NP <= 1.0) {
    alpha = 0.36 + 0.34 * (NP - 0.5);
  } else if (NP <= 2.0) {
    alpha = 0.53 + 0.27 * (NP - 1.0);
  } else if (NP <= 5.0) {
    alpha = 0.80 + 0.23 * (NP - 2.0);
  } else {
    alpha = 1.49 + 0.15 * (NP - 5.0);
  }

  // Вероятность часовая Phr = (U * qhrU) / (q0hr * N)
  const Phr = (consumersU * qhrU) / (q0hr * Math.max(1, fixturesN));
  const NPhr = fixturesN * Phr;

  let alphaHr = 0;
  if (NPhr <= 0.1) {
    alphaHr = NPhr;
  } else if (NPhr <= 0.5) {
    alphaHr = 0.2 + 0.4 * (NPhr - 0.1);
  } else if (NPhr <= 1.0) {
    alphaHr = 0.36 + 0.34 * (NPhr - 0.5);
  } else if (NPhr <= 2.0) {
    alphaHr = 0.53 + 0.27 * (NPhr - 1.0);
  } else if (NPhr <= 5.0) {
    alphaHr = 1.0 + 0.26 * (NPhr - 2.0);
  } else {
    alphaHr = 1.78 + 0.18 * (NPhr - 5.0);
  }

  const qhrTot = 0.005 * q0hr * alphaHr;

  // Коэффициент Ks по Таблице 7.1 СП 4.01.11-2025
  let Ks = 0.75;
  if (pipeLengthM > 10) Ks = 0.85;
  else if (pipeLengthM > 20) Ks = 1.0;

  // Секундный расход сточных вод по формуле (7.2) СП 4.01.11-2025: (qhrTot / 3.6) + (Ks * q0s) + q_add
  const fixturesWastewaterFlowLs = (qhrTot / 3.6) + (Ks * q0s);
  const totalFlowRateLs = fixturesWastewaterFlowLs + additionalFlowLs;

  return {
    P,
    NP,
    alpha,
    Phr,
    NPhr,
    alphaHr,
    qhrTot,
    Ks,
    fixturesWastewaterFlowLs,
    additionalFlowLs,
    totalFlowRateLs
  };
}
