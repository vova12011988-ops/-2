export type PipeMaterial = 'pp' | 'pvc' | 'pe' | 'cast_iron_sml';

export type SewerSystemType =
  | 'domestic' // Бытовая (хоз.-фекальная К1): СН 4.01.03-2019 / СП 4.01.11-2025 (РБ): h/d <= 0.6 при d <= 110, h/d <= 0.8 при d >= 160
  | 'rainwater_internal' // Внутренние водостоки зданий (дождевая К2): СН 4.01.03-2019 п. 9.2 (РБ): h/d <= 0.8 для всех диаметров
  | 'rainwater_external' // Наружная дождевая сеть (К2н): СН 4.01.02-2019 / ТКП 45-4.01-57-2012 (РБ): h/d = 1.0 (полное сечение)
  | 'full_flow_1_0' // Полное расчетное наполнение h/d = 1.00 (100% сечения трубы)
  | 'custom' // Пользовательский коэффициент наполнения (ручной ввод от 0.1 до 1.0)
  | 'industrial'; // Производственная канализация (К3): h/d <= 0.7..0.8

export interface PipeDefinition {
  id: string;
  material: PipeMaterial;
  materialName: string;
  series?: string; // Серия: 'ПП 2,0 (2,0 МПа / PN 20)' или 'ПП безнапорные (СТБ ГОСТ 32414)'
  name: string;
  dn: number; // nominal diameter, mm
  od: number; // outer diameter, mm
  wallThickness: number; // mm
  internalDiameterMm: number; // mm
  internalDiameterM: number; // meters
  roughnessKe: number; // equivalent absolute roughness, mm
  manningN: number;
  maxFillingDomestic: number; // 0.6 for d <= 110, 0.8 for d >= 160 (СН 4.01.03-2019 РБ)
  maxFillingRainwaterInternal: number; // 0.8 for all diameters (СН 4.01.03-2019 п. 9.2 РБ)
  maxFillingRainwaterExternal: number; // 1.0 for all diameters (СН 4.01.02-2019 п. 5.4 / ТКП 45-4.01-57-2012 РБ)
  minSlopeNormative: number; // normative slope if flow is insufficient for self-cleansing
  standardNormDoc: string;
}

export interface SpBelarusVerificationResult {
  normDoc: string; // "СП 4.01.11-2025 / СН 4.01.03-2019 (Республика Беларусь)"
  formulaName: string; // "Методика Шези–Маннинга и Дарси–Вейсбаха (СП 4.01.11-2025 п. 7.4)"
  manningN: number; // 0.0095..0.010
  velocitySp: number; // V_СП, м/с
  flowRateSpLs: number; // q_СП, л/с
  flowRateSpM3h: number; // Q_СП, м³/ч
  selfCleansingCriterionSp: number; // V_СП * sqrt(h/d)
  requiredSelfCleansingCriterion: number; // 0.50
  isSelfCleansingOk: boolean;
  isVelocityMinOk: boolean; // V >= 0.7
  isVelocityMaxOk: boolean; // V <= 4.0
  isFillingOk: boolean; // h/d <= maxFilling
  deltaFlowLs: number; // Dobromyslov - SP
  deltaFlowPercent: number; // % divergence
  deltaVelocity: number; // Dobromyslov V - SP V
  complianceNotes: string[];
  verdict: 'fully_compatible' | 'acceptable' | 'divergence';
  clauseReferences: {
    hydraulicCalculation: string; // "п. 7.4.1 СП 4.01.11-2025"
    selfCleansing: string; // "п. 7.4.2 СП 4.01.11-2025"
    uncalculatedSlope: string; // "п. 7.4.3 СП 4.01.11-2025"
    maxSlope: string; // "п. 7.4.6 СП 4.01.11-2025"
  };
}

export interface HydraulicResult {
  pipe: PipeDefinition;
  systemType: SewerSystemType;
  slope: number; // i (m/m)
  fillingRatio: number; // h/d (0.01 - 1.0)
  depthMm: number; // h, mm
  flowAreaM2: number; // omega, m²
  flowAreaCm2: number; // omega, cm²
  wettedPerimeterM: number; // chi, m
  hydraulicRadiusM: number; // R, m
  hydraulicRadiusCm: number; // R, cm
  waterSurfaceWidthMm: number; // B, mm
  centralAngleDeg: number; // theta, degrees
  velocity: number; // V, m/s
  flowRateLs: number; // q, l/s
  flowRateM3h: number; // Q, m³/h
  lambda: number; // Darcy friction factor
  reynolds: number;
  selfCleansingCriterion: number; // V * sqrt(h/d)
  requiredSelfCleansingCriterion: number; // 0.5 for plastic, 0.6 for iron
  
  // Normative checks (Republic of Belarus: СН 4.01.03-2019, СП 4.01.11-2025, СН 4.01.02-2019, ТКП 45-4.01-57-2012)
  maxAllowedFilling: number;
  isFillingOk: boolean;
  minFillingOk: boolean; // h/d >= 0.25..0.3
  isVelocityMinOk: boolean; // V >= 0.7 m/s
  isVelocityMaxOk: boolean; // V <= 4.0 m/s for plastic
  isSelfCleansingOk: boolean; // V * sqrt(h/d) >= K
  isSlopeOk: boolean; // i <= 0.15
  isUncalculatedSection: boolean; // when flow is too small to ensure self-cleansing
  
  // Max capacity at normative filling
  maxCapacityAtNormativeFillingLs: number;
  velocityAtNormativeFilling: number;
  
  status: 'optimal' | 'acceptable' | 'warning' | 'error';
  statusMessages: string[];
  recommendation: string;

  // Cross-check verification according to current SP of Belarus (СП 4.01.11-2025 / СН 4.01.03-2019)
  spVerification?: SpBelarusVerificationResult;
}

export interface NetworkSection {
  id: string;
  name: string;
  systemType: SewerSystemType;
  customMaxFilling?: number; // optional custom filling limit up to 1.0
  pipeId: string;
  slope: number;
  flowRateLs: number;
  lengthM: number;
  note?: string;
  result?: HydraulicResult;
}

export interface RainwaterCalculationParams {
  roofAreaM2: number; // F, м²
  q20Intensity: number; // q20, л/(с · га) (для городов Беларуси)
  roofSlopeType: 'flat' | 'sloped'; // плоская (< 1.5%) или скатная (> 1.5%)
  kReductionFactor?: number;
}
