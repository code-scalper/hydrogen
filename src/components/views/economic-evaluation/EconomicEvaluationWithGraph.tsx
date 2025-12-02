import { Fragment, useCallback, useEffect, useMemo, useState } from "react";

import {
  CURRENCY_OPTIONS,
  DEFAULT_DAL_TO_WON,
  DEFAULT_GENERAL_SETTINGS,
  ECONOMIC_REPORT_FIELDS,
  EQUIPMENT_TAB_CONFIGS,
} from "@/constants/economicEvaluation";
import { collectScenarioInputValues } from "@/lib/simulation";
import type {
  ChargingInfoDefaults,
  CurrencyCode,
  EconomicCurrencySettings,
  EconomicGeneralSettings,
  EquipmentFieldKey,
  EquipmentKey,
  EquipmentTabConfig,
  EscalationDefaults,
  IndirectCostFactors,
  InstallationFactors,
  LaborInfoDefaults,
  OpexCostFactors,
  TimelinePoint,
} from "@/constants/economicEvaluation";
import {
  calculateAverageCost,
  convertDisplayToKrw,
  convertDisplayToUsd,
  convertKrwToDisplay,
  convertUsdToDisplay,
  sanitizeNumericInput,
  sortTimelinePoints,
} from "@/lib/economicEvaluation";
import useEconomicEvaluationStore from "@/store/useEconomicEvaluationStore";
import { useInteractionStore } from "@/store/useInteractionStore";
import { useProjectStore } from "@/store/useProjectStore";
import useSimulationOutputStore from "@/store/useSimulationOutputStore";
import useSimulationStore from "@/store/useSimulationStore";

import PlotlyWrapper from "@/components/ui/PlotlyWrapper";
import type { Annotations, Layout, PlotData, Template } from "plotly.js";

const currencyLabels: Record<keyof EconomicCurrencySettings, string> = {
  elec: "급전 설비",
  lqTk: "액화수소 탱크",
  lqPp: "액화수소 펌프",
  vap: "액화수소 기화기",
  cp: "압축기",
  lbk: "저압 뱅크",
  hbk: "고압 뱅크",
  disp: "수소충전기",
  yrPrice: "판매 단가",
  yrPurch: "구매 단가",
};

const PRICE_UNITS: Record<CurrencyCode, { label: string; scale: number }> = {
  KRW: { label: "원/kg", scale: 1 },
  USD: { label: "$ /kg", scale: 1 },
};

const CASHFLOW_SERIES = [
  { key: "CashFlow", name: "Cash Flow", color: "#3b82f6" },
  { key: "CumuCashFlow", name: "Cumulative", color: "#f97316" },
];

const PLOTLY_DARK_TEMPLATE = "plotly_dark" as unknown as Template;
const PLOT_BACKGROUND = "rgba(15,23,42,0.5)";

interface EconomicEvaluationWithGraphProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
}

type EquipmentField = "x" | "usd";

type TimelineKind = "sales" | "purchase";

const MODAL_TABS = [{ id: "basic", label: "기본 정보" }];

const additionalTabs = [
  { id: "installation", label: "설치비 계수" },
  { id: "indirect", label: "간접비 계수" },
  { id: "opex", label: "OPEX 계수" },
  { id: "labor", label: "인건비" },
  { id: "charging", label: "충전 정보" },
  { id: "sales", label: "판매 단가" },
  { id: "purchase", label: "구매 단가" },
  { id: "escalation", label: "인상·감가" },
  { id: "report", label: "요약 리포트" },
  { id: "cashflow", label: "현금흐름" },
  // { id: "coefficients", label: "회귀 계수" },
];

const OUTPUT_TAB_IDS = new Set(["report", "cashflow"] as const);

const formatNumber = (value: number | null | undefined, fractionDigits = 2) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "-";
  }
  return value.toLocaleString(undefined, {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: 0,
  });
};

const toFiniteNumber = (
  value: number | string | null | undefined
): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

interface TrendlineCoefficients {
  slope: number;
  intercept: number;
}

interface TrendlineAnnotationOptions {
  fontFamily?: string;
  fontSize?: number;
  bold?: boolean;
  color?: string;
  x?: number;
  y?: number;
}

interface EquipmentTrendline {
  coefficients: TrendlineCoefficients;
  annotation?: TrendlineAnnotationOptions;
}

interface TrendlineSourceConfig {
  column: string;
  annotation?: TrendlineAnnotationOptions;
}


const TRENDLINE_SLOPE_ROW_INDEX = 2; // Output_EE1.csv row 3 (1-based)
const TRENDLINE_INTERCEPT_ROW_INDEX = 3; // Output_EE1.csv row 4 (1-based)

const TRENDLINE_SOURCES: Partial<Record<EquipmentKey, TrendlineSourceConfig>> =
	{
    elec: { column: "Coeffs_Elec" },
    lqTk: {
      column: "Coeffs_Tk",
      annotation: {
        fontFamily: "Arial, sans-serif",
        fontSize: 12,
        bold: true,
        x: 0.95,
        y: 0.9,
      },
    },
    lqPp: {
      column: "Coeffs_Pp",
      annotation: {
        fontFamily: "Arial, sans-serif",
        fontSize: 12,
        bold: true,
        x: 0.95,
        y: 0.9,
      },
    },
    vap: {
      column: "Coeffs_Vap",
      annotation: {
        fontFamily: "Arial, sans-serif",
        fontSize: 12,
        bold: true,
        x: 0.95,
        y: 0.9,
      },
    },
    cp: {
      column: "Coeffs_Comps",
      annotation: {
        fontFamily: "Arial, sans-serif",
        fontSize: 12,
        bold: true,
        x: 0.95,
        y: 0.9,
      },
    },
    lbk: {
      column: "Coeffs_Bks1",
      annotation: {
        fontFamily: "Arial, sans-serif",
        fontSize: 12,
        bold: true,
        x: 0.95,
        y: 0.9,
      },
    },
    hbk: {
      column: "Coeffs_Bks2",
      annotation: {
        fontFamily: "Arial, sans-serif",
        fontSize: 12,
        bold: true,
        x: 0.95,
        y: 0.9,
      },
    },
    disp: {
      column: "Coeffs_Disps",
      annotation: {
        fontFamily: "Arial, sans-serif",
        fontSize: 12,
        bold: true,
        x: 0.95,
        y: 0.9,
      },
    },
  };

const TIMELINE_TRENDLINE_SOURCES: Partial<
  Record<TimelineKind, TrendlineSourceConfig>
> = {
  sales: {
    column: "Coeffs_Sale",
    annotation: {
      fontFamily: "Arial, sans-serif",
      fontSize: 12,
      bold: true,
      x: 0.9,
      y: 0.85,
    },
  },
  purchase: {
    column: "Coeffs_Purch",
    annotation: {
      fontFamily: "Arial, sans-serif",
      fontSize: 12,
      bold: true,
      x: 0.9,
      y: 0.85,
    },
  },
};

const EconomicEvaluationWithGraph = ({
  showModal,
  setShowModal,
}: EconomicEvaluationWithGraphProps) => {
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [loadingOutputs, setLoadingOutputs] = useState(false);
  const [updatingInputs, setUpdatingInputs] = useState(false);
  const [outputError, setOutputError] = useState<string | null>(null);

  const general = useEconomicEvaluationStore((state) => state.general);
  const setGeneral = useEconomicEvaluationStore((state) => state.setGeneral);
  const setCurrency = useEconomicEvaluationStore((state) => state.setCurrency);
  const setDalToWon = useEconomicEvaluationStore((state) => state.setDalToWon);
  const setEquipmentSample = useEconomicEvaluationStore(
    (state) => state.setEquipmentSample
  );
  const setEquipmentExtra = useEconomicEvaluationStore(
    (state) => state.setEquipmentExtra
  );
  const resetEquipment = useEconomicEvaluationStore(
    (state) => state.resetEquipment
  );
  const setInstallation = useEconomicEvaluationStore(
    (state) => state.setInstallation
  );
  const installation = useEconomicEvaluationStore(
    (state) => state.installation
  );
  const setIndirect = useEconomicEvaluationStore((state) => state.setIndirect);
  const indirect = useEconomicEvaluationStore((state) => state.indirect);
  const setOpex = useEconomicEvaluationStore((state) => state.setOpex);
  const opex = useEconomicEvaluationStore((state) => state.opex);
  const setLabor = useEconomicEvaluationStore((state) => state.setLabor);
  const labor = useEconomicEvaluationStore((state) => state.labor);
  const setCharging = useEconomicEvaluationStore((state) => state.setCharging);
  const charging = useEconomicEvaluationStore((state) => state.charging);
  const salesPrice = useEconomicEvaluationStore((state) => state.salesPrice);
  const setSalesPoint = useEconomicEvaluationStore(
    (state) => state.setSalesPoint
  );
  const purchasePrice = useEconomicEvaluationStore(
    (state) => state.purchasePrice
  );
  const setPurchasePoint = useEconomicEvaluationStore(
    (state) => state.setPurchasePoint
  );
  const escalation = useEconomicEvaluationStore((state) => state.escalation);
  const setEscalation = useEconomicEvaluationStore(
    (state) => state.setEscalation
  );
  const outputs = useEconomicEvaluationStore((state) => state.outputs);
  const setOutputs = useEconomicEvaluationStore((state) => state.setOutputs);
  const resetAll = useEconomicEvaluationStore((state) => state.resetAll);
  const hasInvalidInputs = useInteractionStore(
    (state) => Object.keys(state.invalidInputKeys).length > 0
  );
  const skipRunExe = useInteractionStore((state) => state.skipRunExe);
  const selectedScenario = useProjectStore((state) => state.selectedScenario);

	const equipmentTrendlines = useMemo<
		Partial<Record<EquipmentKey, EquipmentTrendline>>
	>(() => {
		const coeffs = outputs.coefficients ?? [];
		if (coeffs.length <= TRENDLINE_INTERCEPT_ROW_INDEX) {
			return {};
		}
		const slopeRow = coeffs[TRENDLINE_SLOPE_ROW_INDEX];
		const interceptRow = coeffs[TRENDLINE_INTERCEPT_ROW_INDEX];
		if (!slopeRow || !interceptRow) {
			return {};
		}
		const map: Partial<Record<EquipmentKey, EquipmentTrendline>> = {};
		for (const [key, source] of Object.entries(TRENDLINE_SOURCES) as Array<
			[EquipmentKey, TrendlineSourceConfig]
		>) {
			const slope = toFiniteNumber(slopeRow?.[source.column]);
			const intercept = toFiniteNumber(interceptRow?.[source.column]);
			if (slope === null || intercept === null) {
				continue;
			}
      map[key] = {
        coefficients: { slope, intercept },
        annotation: source.annotation,
      };
    }
    return map;
  }, [outputs.coefficients]);

	const timelineTrendlines = useMemo<
		Partial<Record<TimelineKind, EquipmentTrendline>>
	>(() => {
		const coeffs = outputs.coefficients ?? [];
		if (coeffs.length <= TRENDLINE_INTERCEPT_ROW_INDEX) {
			return {};
		}
		const slopeRow = coeffs[TRENDLINE_SLOPE_ROW_INDEX];
		const interceptRow = coeffs[TRENDLINE_INTERCEPT_ROW_INDEX];
		if (!slopeRow || !interceptRow) {
			return {};
		}
		const map: Partial<Record<TimelineKind, EquipmentTrendline>> = {};
		for (const [key, source] of Object.entries(
			TIMELINE_TRENDLINE_SOURCES
		) as Array<[TimelineKind, TrendlineSourceConfig]>) {
			const slope = toFiniteNumber(slopeRow?.[source.column]);
			const intercept = toFiniteNumber(interceptRow?.[source.column]);
			if (slope === null || intercept === null) {
				continue;
			}
      map[key] = {
        coefficients: { slope, intercept },
        annotation: source.annotation,
      };
    }
    return map;
  }, [outputs.coefficients]);

  const handleClose = () => {
    setShowModal(false);
    setActiveTab("basic");
  };

  const refreshOutputs = useCallback(async () => {
    if (
      typeof window === "undefined" ||
      !window.electronAPI?.readEconomicEvaluation
    ) {
      setOutputError("Electron API를 사용할 수 없습니다.");
      return;
    }
    try {
      setLoadingOutputs(true);
      setOutputError(null);
      const response = await window.electronAPI.readEconomicEvaluation({});
      setOutputs({
        report: response.report ?? {},
        cashflow: response.cashflow ?? [],
        coefficients: response.coefficients ?? [],
        date: response.date ?? null,
      });
    } catch (error) {
      console.error("Failed to read economic evaluation", error);
      setOutputError(
        error instanceof Error
          ? error.message
          : "경제성 평가 데이터를 불러오는 중 오류가 발생했습니다."
      );
    } finally {
      setLoadingOutputs(false);
    }
  }, [setOutputs]);

  useEffect(() => {
    if (!showModal) return;
    setActiveTab((prev) => prev ?? "basic");
    void refreshOutputs();
  }, [showModal, refreshOutputs]);

  const handleInputUpdate = useCallback(async () => {
    if (updatingInputs) {
      return;
    }

    if (hasInvalidInputs) {
      window.alert("시뮬레이터 입력값을 먼저 확인하세요.");
      return;
    }

    if (typeof window === "undefined" || !window.electronAPI?.runExe) {
      window.alert("실행 기능을 사용할 수 없습니다.");
      return;
    }

    const payload = collectScenarioInputValues(selectedScenario);
    if (!payload) {
      window.alert("실행할 시나리오가 선택되지 않았습니다.");
      return;
    }

	setUpdatingInputs(true);
	try {
		useSimulationStore.getState().stop();
		const result = await window.electronAPI.runExe({
			...payload,
			skipExe: skipRunExe,
		});
		if (Array.isArray(result?.frames)) {
			useSimulationStore.getState().setFrames(result.frames);
			useSimulationOutputStore.getState().setOutput(result.frames, {
				sourceDate: result.outputDate ?? null,
			});
		}
		await refreshOutputs();
	} catch (error) {
      console.error("Failed to update economic inputs", error);
      window.alert("입력 데이터를 업데이트하지 못했습니다. 다시 시도해주세요.");
    } finally {
      setUpdatingInputs(false);
    }
  }, [
    hasInvalidInputs,
    selectedScenario,
    skipRunExe,
	refreshOutputs,
	updatingInputs,
]);

  const equipmentStates = useEconomicEvaluationStore(
    (state) => state.equipment
  );

  const equipmentTabs = useMemo(
    () =>
      EQUIPMENT_TAB_CONFIGS.map((config) => ({
        id: `equipment-${config.key}`,
        label: config.title,
        config,
      })),
    []
  );

  const inputTabs = useMemo(
    () => additionalTabs.filter((tab: any) => !OUTPUT_TAB_IDS.has(tab.id)),
    []
  );
  const outputTabs = useMemo(
    () => additionalTabs.filter((tab: any) => OUTPUT_TAB_IDS.has(tab.id)),
    []
  );

  const navSections = useMemo(
    () => [
      { key: "basic", label: "기본 입력", tabs: MODAL_TABS },
      { key: "equipment", label: "설비 비용 입력", tabs: equipmentTabs },
      { key: "inputs", label: "단가 입력", tabs: inputTabs },
      { key: "outputs", label: "결과 출력", tabs: outputTabs },
    ],
    [equipmentTabs, inputTabs, outputTabs]
  );

  const defaultCurrency = DEFAULT_GENERAL_SETTINGS.currencies;
  const { enabled, graphEnabled, dalToWon } = general;

  const handleGeneralToggle =
    (key: "enabled" | "graphEnabled") => (value: boolean) => {
      setGeneral({ [key]: value } as Partial<typeof general>);
    };

  const handleCurrencyChange = (
    key: keyof EconomicCurrencySettings,
    value: CurrencyCode
  ) => {
    setCurrency(key, value);
  };

  const handleDalToWonChange = (raw: string) => {
    const parsed = sanitizeNumericInput(raw);
    if (parsed === null || parsed <= 0) {
      setDalToWon(DEFAULT_DAL_TO_WON);
      return;
    }
    setDalToWon(parsed);
  };

  const renderTabButton = (tabId: string, label: string) => {
    const isActive = activeTab === tabId;
    return (
      <button
        type="button"
        key={tabId}
        onClick={() => setActiveTab(tabId)}
        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
          isActive
            ? "bg-slate-700 text-white"
            : "bg-transparent text-slate-300 hover:bg-slate-700/40"
        }`}
      >
        <span>{label}</span>
        {isActive && <span className="text-xs text-emerald-400">선택</span>}
      </button>
    );
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/70 backdrop-blur">
      <div className="flex h-[90vh] w-[96vw] max-w-[1280px] flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-50">경제성 평가</h2>
            <p className="text-xs text-slate-400">
              시나리오 입력 및 결과 리포트를 확인합니다.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => resetAll()}
              className="rounded-md border border-slate-600 px-3 py-1 text-xs text-slate-300 transition hover:bg-slate-700"
            >
              기본값으로 초기화
            </button>
            <button
              type="button"
              onClick={() => void handleInputUpdate()}
              disabled={loadingOutputs || updatingInputs}
              className={`rounded-md border border-emerald-500 px-3 py-1 text-xs transition ${
                loadingOutputs || updatingInputs
                  ? "cursor-not-allowed bg-emerald-500/10 text-emerald-200"
                  : "text-emerald-200 hover:bg-emerald-500/10"
              }`}
            >
              {updatingInputs
                ? "재계산 중..."
                : loadingOutputs
                ? "불러오는 중..."
                : "입력 데이터 업데이트"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md border border-slate-600 px-3 py-1 text-xs text-slate-300 transition hover:bg-slate-700"
            >
              닫기
            </button>
          </div>
        </header>

        <div className="flex flex-1 gap-4 overflow-hidden px-5 py-4">
          <nav className="flex w-56 flex-col gap-4 overflow-y-auto border-r border-slate-800 pr-3">
            {navSections.map((section) => (
              <div key={section.key}>
                <p className="px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  {section.label}
                </p>
                <div className="mt-1 flex flex-col gap-1">
                  {section.tabs.map((tab) =>
                    renderTabButton(tab.id, tab.label)
                  )}
                </div>
              </div>
            ))}
          </nav>
          <section className="relative flex-1 overflow-y-auto">
            {activeTab === "basic" && (
              <BasicSettingsTab
                general={general}
                defaultCurrency={defaultCurrency}
                onToggle={handleGeneralToggle}
                onCurrencyChange={handleCurrencyChange}
                onDalToWonChange={handleDalToWonChange}
              />
            )}

            {equipmentTabs.map(({ id, config }) => (
              <Fragment key={id}>
                {activeTab === id && (
                  <EquipmentTab
                    config={config}
                    equipmentState={equipmentStates[config.key]}
                    currencies={general.currencies}
                    enabled={enabled}
                    dalToWon={dalToWon}
                    graphEnabled={graphEnabled}
                    trendline={equipmentTrendlines[config.key]}
                    onSampleChange={(index, field, value) => {
                      const partial =
                        field === "x" ? { x: value } : { usd: value };
                      setEquipmentSample(
                        config.key as EquipmentKey,
                        index,
                        partial
                      );
                    }}
                    onExtraChange={(field, value) =>
                      setEquipmentExtra(
                        config.key as EquipmentKey,
                        field,
                        value
                      )
                    }
                    onReset={() => resetEquipment(config.key as EquipmentKey)}
                  />
                )}
              </Fragment>
            ))}

            {activeTab === "installation" && (
              <InstallationTab
                values={installation}
                enabled={enabled}
                onChange={setInstallation}
              />
            )}

            {activeTab === "indirect" && (
              <IndirectCostTab
                values={indirect}
                enabled={enabled}
                onChange={setIndirect}
              />
            )}

            {activeTab === "opex" && (
              <OpexCostTab values={opex} enabled={enabled} onChange={setOpex} />
            )}

            {activeTab === "labor" && (
              <LaborTab
                values={labor}
                enabled={enabled}
                onChange={setLabor}
                operatingDays={equipmentStates.elec?.extra?.FuDayPerYr ?? 0}
              />
            )}

            {activeTab === "charging" && (
              <ChargingTab
                values={charging}
                enabled={enabled}
                onChange={setCharging}
              />
            )}

            {activeTab === "sales" && (
              <TimelineTab
                kind="sales"
                title="수소 판매 단가"
                rows={salesPrice}
                onChange={setSalesPoint}
                currency={general.currencies.yrPrice}
                dalToWon={dalToWon}
                enabled={enabled}
                graphEnabled={graphEnabled}
                trendline={timelineTrendlines.sales}
              />
            )}

            {activeTab === "purchase" && (
              <TimelineTab
                kind="purchase"
                title="수소 구매 단가"
                rows={purchasePrice}
                onChange={setPurchasePoint}
                currency={general.currencies.yrPurch}
                dalToWon={dalToWon}
                enabled={enabled}
                graphEnabled={graphEnabled}
                trendline={timelineTrendlines.purchase}
              />
            )}

            {activeTab === "escalation" && (
              <EscalationTab
                values={escalation}
                enabled={enabled}
                onChange={setEscalation}
              />
            )}

            {activeTab === "report" && (
              <ReportTab
                report={outputs.report}
                date={outputs.date}
                error={outputError}
              />
            )}

            {activeTab === "cashflow" && (
              <CashflowTab
                rows={outputs.cashflow}
                error={outputError}
                graphEnabled={graphEnabled}
              />
            )}

            {activeTab === "coefficients" && (
              <CoefficientTab rows={outputs.coefficients} error={outputError} />
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

interface BasicSettingsTabProps {
  general: EconomicGeneralSettings;
  defaultCurrency: EconomicCurrencySettings;
  onToggle: (key: "enabled" | "graphEnabled") => (value: boolean) => void;
  onCurrencyChange: (
    key: keyof EconomicCurrencySettings,
    value: CurrencyCode
  ) => void;
  onDalToWonChange: (value: string) => void;
}

const BasicSettingsTab = ({
  general,
  defaultCurrency,
  onToggle,
  onCurrencyChange,
  onDalToWonChange,
}: BasicSettingsTabProps) => {
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h3 className="text-sm font-semibold text-slate-100">기본 설정</h3>
        <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
          <ToggleField
            label="경제성 평가 활성화"
            description="비활성화 시 모든 입력이 잠깁니다."
            checked={general.enabled}
            onChange={onToggle("enabled")}
          />
          <ToggleField
            label="그래프 표시"
            description="비활성화 시 그래프가 숨겨집니다."
            checked={general.graphEnabled}
            onChange={onToggle("graphEnabled")}
          />
          <NumberField
            label="환율 (달러→원)"
            value={general.dalToWon}
            min={100}
            step={1}
            onChange={onDalToWonChange}
            suffix="원/$"
          />
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h3 className="text-sm font-semibold text-slate-100">통화 설정</h3>
        <p className="mt-1 text-xs text-slate-400">
          각 입력 탭에서 사용할 통화를 선택합니다. 기본값은 시나리오 템플릿
          기준입니다.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {(
            Object.keys(general.currencies) as Array<
              keyof EconomicCurrencySettings
            >
          ).map((key) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium text-slate-100">
                  {currencyLabels[key]}
                </p>
                <p className="text-[11px] text-slate-500">
                  기본 통화:{" "}
                  {currencyLabels[key] === undefined
                    ? "-"
                    : currencyLabels[key]}
                </p>
              </div>
              <select
                className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                value={general.currencies[key]}
                onChange={(event) =>
                  onCurrencyChange(key, event.target.value as CurrencyCode)
                }
              >
                {CURRENCY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.symbol} ({option.label})
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

interface EquipmentTabProps {
  config: EquipmentTabConfig;
  equipmentState?: {
    samples: Array<{ id: string; x: number | null; usd: number | null }>;
    extra: Partial<Record<string, number>>;
  };
  currencies: EconomicCurrencySettings;
  enabled: boolean;
  dalToWon: number;
  graphEnabled: boolean;
  trendline?: EquipmentTrendline | null;
  onSampleChange: (
    index: number,
    field: EquipmentField,
    value: number | null
  ) => void;
  onExtraChange: (field: EquipmentFieldKey, value: number) => void;
  onReset: () => void;
}

const EquipmentTab = ({
  config,
  equipmentState,
  currencies,
  enabled,
  dalToWon,
  graphEnabled,
  trendline,
  onSampleChange,
  onExtraChange,
  onReset,
}: EquipmentTabProps) => {
  const samples = equipmentState?.samples ?? [];
  const extra = equipmentState?.extra ?? {};
  const currency = currencies[config.currencyKey];

  const displaySamples = useMemo(() => {
    return samples.map((sample) => {
      return {
        id: sample.id,
        x: sample.x,
        cost: convertUsdToDisplay(
          sample.usd ?? null,
          config,
          currency,
          dalToWon
        ),
        usd: sample.usd ?? null,
      };
    });
  }, [samples, config, currency, dalToWon]);

  const averageCost = useMemo(() => {
    const result = calculateAverageCost(samples, dalToWon);
    return result.averageWonPerUnit;
  }, [samples, dalToWon]);

  const chartData = useMemo(() => {
    const x: number[] = [];
    const y: number[] = [];
    const hover: string[] = [];
    displaySamples.forEach((item, index) => {
      if (item.x === null || item.cost === null) return;
      x.push(item.x);
      y.push(item.cost);
      hover.push(`#${index + 1}`);
    });
    return { x, y, hover };
  }, [displaySamples]);

  const trendlinePlot = useMemo(() => {
    if (!trendline || chartData.x.length === 0) {
      return null;
    }
    const { slope, intercept } = trendline.coefficients;
    if (!Number.isFinite(slope) || !Number.isFinite(intercept)) {
      return null;
    }
    const sortedX = [...chartData.x].sort((a, b) => a - b);
    const xStart = sortedX[0];
    const xEnd = sortedX[sortedX.length - 1];
    if (!Number.isFinite(xStart) || !Number.isFinite(xEnd)) {
      return null;
    }
    const usdScale = config.usdUnit.scale || 1;
    const krwScale = config.krwUnit.scale || 1;
    const displayFactor =
      currency === "USD"
        ? 1 / usdScale
        : dalToWon > 0
        ? dalToWon / krwScale
        : null;
    if (displayFactor === null || !Number.isFinite(displayFactor)) {
      return null;
    }
    const projectY = (value: number) =>
      (slope * value + intercept) * displayFactor;
    const yStart = projectY(xStart);
    const yEnd = projectY(xEnd);
    if (!Number.isFinite(yStart) || !Number.isFinite(yEnd)) {
      return null;
    }
    const displaySlope = slope * displayFactor;
    const displayIntercept = intercept * displayFactor;
    const formatCoeff = (value: number) =>
      value.toLocaleString(undefined, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      });
    const interceptSign = displayIntercept >= 0 ? "+" : "-";
    const baseText = `y = ${formatCoeff(
      displaySlope
    )}x ${interceptSign} ${formatCoeff(Math.abs(displayIntercept))}`;
    const annotationOptions = trendline.annotation ?? {};
    const annotationText = annotationOptions.bold
      ? `<b>${baseText}</b>`
      : baseText;
    const trace: Partial<PlotData> = {
      type: "scatter",
      mode: "lines",
      x: [xStart, xEnd],
      y: [yStart, yEnd],
      line: { color: "#ef4444", width: 2 },
      name: "Trend Line",
      hoverinfo: "skip",
    };
    const annotation: Partial<Annotations> = {
      text: annotationText,
      x: annotationOptions.x ?? 0.98,
      y: annotationOptions.y ?? 1.05,
      xref: "paper",
      yref: "paper",
      xanchor: "right",
      yanchor: "bottom",
      font: {
        size: annotationOptions.fontSize ?? 11,
        color: annotationOptions.color ?? "#f87171",
        family: annotationOptions.fontFamily ?? "'Inter', 'sans-serif'",
      },
      bgcolor: "rgba(15,23,42,0.75)",
      bordercolor: "transparent",
      showarrow: false,
    };
    return { trace, annotation };
  }, [
    chartData,
    currency,
    dalToWon,
    trendline,
    config.usdUnit.scale,
    config.krwUnit.scale,
  ]);

  const yUnit = currency === "USD" ? config.usdUnit.unit : config.krwUnit.unit;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              {config.title}
            </h3>
            <p className="text-xs text-slate-400">
              입력 단위: {config.xLabel} ({config.xUnit}) / 비용 단위: {yUnit}
            </p>
          </div>
          <button
            type="button"
            onClick={onReset}
            disabled={!enabled}
            className="rounded-md border border-slate-600 px-2 py-1 text-xs text-slate-300 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            기본값 복원
          </button>
        </div>

        <div className="mt-4 overflow-auto rounded-lg border border-slate-800">
          <table className="w-full min-w-[520px] table-fixed text-xs">
            <thead className="bg-slate-800 text-slate-200">
              <tr>
                <th className="w-12 px-2 py-2 text-left">#</th>
                <th className="w-32 px-2 py-2 text-left">{config.xLabel}</th>
                <th className="px-2 py-2 text-left">비용 ({yUnit})</th>
              </tr>
            </thead>
            <tbody>
              {displaySamples.map((row, index) => (
                <tr key={row.id} className="border-t border-slate-800">
                  <td className="px-2 py-1 text-slate-500">{index + 1}</td>
                  <td className="px-2 py-1">
                    <input
                      type="number"
                      value={row.x ?? ""}
                      disabled={!enabled}
                      onChange={(event) => {
                        const value = sanitizeNumericInput(event.target.value);
                        onSampleChange(index, "x", value);
                      }}
                      className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none disabled:cursor-not-allowed"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <input
                      type="number"
                      value={row.cost ?? ""}
                      disabled={!enabled}
                      onChange={(event) => {
                        const parsed = sanitizeNumericInput(event.target.value);
                        if (parsed === null) {
                          onSampleChange(index, "usd", null);
                          return;
                        }
                        const usdValue = convertDisplayToUsd(
                          parsed,
                          config,
                          currency,
                          dalToWon
                        );
                        onSampleChange(index, "usd", usdValue);
                      }}
                      className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none disabled:cursor-not-allowed"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {config.extraFields && config.extraFields.length > 0 && (
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {config.extraFields.map((field) => (
              <NumberField
                key={field.key}
                label={field.label}
                value={extra[field.key] ?? field.defaultValue}
                onChange={(value) => {
                  const parsed = sanitizeNumericInput(value);
                  if (parsed !== null) {
                    onExtraChange(field.key, parsed);
                  }
                }}
                suffix={field.unit}
                disabled={!enabled}
              />
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h3 className="text-sm font-semibold text-slate-100">분석</h3>
        <p className="text-xs text-slate-400">
          단위당 평균 비용: {formatNumber(averageCost, 1)} 원/{config.xUnit}
        </p>
        <div className="mt-3 min-h-[280px]">
          {!graphEnabled ? (
            <p className="rounded-md border border-slate-800 bg-slate-900/80 px-3 py-6 text-center text-xs text-slate-500">
              그래프 표시가 비활성화되어 있습니다.
            </p>
          ) : chartData.x.length === 0 ? (
            <p className="rounded-md border border-slate-800 bg-slate-900/80 px-3 py-6 text-center text-xs text-slate-500">
              그래프를 표시할 데이터가 없습니다.
            </p>
          ) : (
            <PlotlyWrapper>
              {({ Plot, plotEvents }) => {
                const layout: Partial<Layout> = {
                  template: PLOTLY_DARK_TEMPLATE,
                  height: 280,
                  margin: { t: 24, r: 24, b: 48, l: 48 },
                  xaxis: {
                    title: { text: `${config.xLabel} (${config.xUnit})` },
                  },
                  yaxis: { title: { text: `${config.yLabel} (${yUnit})` } },
                  paper_bgcolor: PLOT_BACKGROUND,
                  plot_bgcolor: PLOT_BACKGROUND,
                  showlegend: false,
                };
                const data: Partial<PlotData>[] = [
                  {
                    type: "scatter",
                    mode: "markers",
                    x: chartData.x,
                    y: chartData.y,
                    text: chartData.hover,
                    marker: {
                      color: "#38bdf8",
                      size: 8,
                    },
                    name: "비용",
                  },
                ];
                if (trendlinePlot) {
                  data.push(trendlinePlot.trace);
                  if (trendlinePlot.annotation) {
                    layout.annotations = [
                      ...(layout.annotations ?? []),
                      trendlinePlot.annotation,
                    ];
                  }
                }
                return (
                  <Plot
                    data={data}
                    layout={layout}
                    style={{ width: "100%", height: "100%" }}
                    {...plotEvents}
                  />
                );
              }}
            </PlotlyWrapper>
          )}
        </div>
      </section>
    </div>
  );
};

interface InstallationTabProps {
  values: InstallationFactors;
  enabled: boolean;
  onChange: (values: Partial<InstallationFactors>) => void;
}

const InstallationTab = ({
  values,
  enabled,
  onChange,
}: InstallationTabProps) => {
  const fields: Array<{ key: keyof InstallationFactors; label: string }> = [
    { key: "F_Inst_Comp", label: "압축기 설치 계수" },
    { key: "F_Inst_Bank", label: "뱅크 설치 계수" },
    { key: "F_Inst_Disp", label: "충전기 설치 계수" },
    { key: "F_Inst_LqTk", label: "액화수소 탱크 설치 계수" },
    { key: "F_Inst_LqPp", label: "액화수소 펌프 설치 계수" },
    { key: "F_Inst_LqVap", label: "액화수소 기화기 설치 계수" },
    { key: "F_Inst_Elec", label: "급전 설비 설치 계수" },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {fields.map((field) => (
        <NumberField
          key={field.key}
          label={field.label}
          value={values[field.key]}
          onChange={(value) => {
            const parsed = sanitizeNumericInput(value);
            if (parsed !== null) {
              onChange({ [field.key]: parsed });
            }
          }}
          disabled={!enabled}
        />
      ))}
    </div>
  );
};

interface IndirectCostTabProps {
  values: IndirectCostFactors;
  enabled: boolean;
  onChange: (values: Partial<IndirectCostFactors>) => void;
}

const IndirectCostTab = ({
  values,
  enabled,
  onChange,
}: IndirectCostTabProps) => {
  const fields: Array<{ key: keyof IndirectCostFactors; label: string }> = [
    { key: "F_Indi_SitePrep", label: "부지 정지/기반 공사" },
    { key: "F_Indi_DesignEng", label: "설계·엔지니어링" },
    { key: "F_Indi_Contingency", label: "예비비" },
    { key: "F_Indi_Permit", label: "인허가 비용" },
    { key: "F_Indi_Licens", label: "라이선스·인증" },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {fields.map((field) => (
        <NumberField
          key={field.key}
          label={field.label}
          value={values[field.key]}
          onChange={(value) => {
            const parsed = sanitizeNumericInput(value);
            if (parsed !== null) {
              onChange({ [field.key]: parsed });
            }
          }}
          disabled={!enabled}
        />
      ))}
    </div>
  );
};

interface OpexCostTabProps {
  values: OpexCostFactors;
  enabled: boolean;
  onChange: (values: Partial<OpexCostFactors>) => void;
}

const OpexCostTab = ({ values, enabled, onChange }: OpexCostTabProps) => {
  const fields: Array<{ key: keyof OpexCostFactors; label: string }> = [
    { key: "F_Opex_Insurance", label: "보험료 계수" },
    { key: "F_Opex_PropertyTax", label: "재산세 계수" },
    { key: "F_Opex_LicenPermit", label: "인허가 갱신비 계수" },
    { key: "F_Opex_OpexComp", label: "압축기 운영비 계수" },
    { key: "F_Opex_OpexBk", label: "뱅크 운영비 계수" },
    { key: "F_Opex_OpexDisp", label: "충전기 운영비 계수" },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {fields.map((field) => (
        <NumberField
          key={field.key}
          label={field.label}
          value={values[field.key]}
          onChange={(value) => {
            const parsed = sanitizeNumericInput(value);
            if (parsed !== null) {
              onChange({ [field.key]: parsed });
            }
          }}
          disabled={!enabled}
        />
      ))}
    </div>
  );
};

interface LaborTabProps {
  values: LaborInfoDefaults;
  operatingDays: number;
  enabled: boolean;
  onChange: (values: Partial<LaborInfoDefaults>) => void;
}

const LaborTab = ({
  values,
  operatingDays,
  enabled,
  onChange,
}: LaborTabProps) => {
  const fields: Array<{
    key: keyof LaborInfoDefaults;
    label: string;
    suffix?: string;
  }> = [
    { key: "MinPer1Fu", label: "1회 충전 소요시간", suffix: "분" },
    { key: "WorkHrPerDay", label: "1일 근무시간", suffix: "시간" },
    { key: "WagePerHr", label: "시간당 급여", suffix: "원" },
    { key: "R_OverhGnA", label: "일반관리비율", suffix: "비율" },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <NumberField
            key={field.key}
            label={field.label}
            value={values[field.key]}
            onChange={(value) => {
              const parsed = sanitizeNumericInput(value);
              if (parsed !== null) {
                onChange({ [field.key]: parsed });
              }
            }}
            suffix={field.suffix}
            disabled={!enabled}
          />
        ))}
      </div>
      <p className="text-xs text-slate-400">
        참고: 현재 연간 운전일수는{" "}
        <span className="text-slate-200">{operatingDays || 0}</span>일입니다.
      </p>
    </div>
  );
};

interface ChargingTabProps {
  values: ChargingInfoDefaults;
  enabled: boolean;
  onChange: (values: Partial<ChargingInfoDefaults>) => void;
}

const ChargingTab = ({ values, enabled, onChange }: ChargingTabProps) => {
  const fields: Array<{
    key: keyof ChargingInfoDefaults;
    label: string;
    suffix?: string;
  }> = [
    { key: "N_FuHDV_0", label: "HDV 일일 충전 대수", suffix: "대" },
    { key: "N_FuLDV_0", label: "LDV 일일 충전 대수", suffix: "대" },
    { key: "M_1FuHDV", label: "HDV 1회 충전량", suffix: "kg" },
    { key: "M_2FuLDV", label: "LDV 1회 충전량", suffix: "kg" },
    { key: "R_GrowHDV", label: "HDV 증가율", suffix: "비율" },
    { key: "R_GrowLDV", label: "LDV 증가율", suffix: "비율" },
    { key: "R_H2Loss", label: "수소 손실률", suffix: "비율" },
    { key: "t_BrkLDV", label: "LDV 준비시간", suffix: "sec" },
    { key: "t_BrkHDV", label: "HDV 준비시간", suffix: "sec" },
    { key: "t_FuLDV", label: "LDV 충전시간", suffix: "sec" },
    { key: "t_FuHDV", label: "HDV 충전시간", suffix: "sec" },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {fields.map((field) => (
        <NumberField
          key={field.key}
          label={field.label}
          value={values[field.key]}
          onChange={(value) => {
            const parsed = sanitizeNumericInput(value);
            if (parsed !== null) {
              onChange({ [field.key]: parsed });
            }
          }}
          suffix={field.suffix}
          disabled={!enabled}
        />
      ))}
    </div>
  );
};

interface TimelineTabProps {
  kind: TimelineKind;
  title: string;
  rows: TimelinePoint[];
  onChange: (index: number, value: Partial<TimelinePoint>) => void;
  currency: CurrencyCode;
  dalToWon: number;
  enabled: boolean;
  graphEnabled: boolean;
  trendline?: EquipmentTrendline | null;
}

const TimelineTab = ({
  kind,
  title,
  rows,
  onChange,
  currency,
  dalToWon,
  enabled,
  graphEnabled,
  trendline,
}: TimelineTabProps) => {
  const scale = PRICE_UNITS[currency];
  const displayRows = useMemo(() => {
    return rows.map((row) => ({
      id: row.id,
      year: row.year,
      value:
        row.value !== undefined && row.value !== null
          ? convertKrwToDisplay(row.value, currency, dalToWon, scale.scale, 1)
          : null,
    }));
  }, [rows, currency, dalToWon, scale.scale]);

  const sorted = useMemo(() => sortTimelinePoints(rows), [rows]);
  const chartData = useMemo(() => {
    const years: number[] = [];
    const values: number[] = [];
    for (const row of sorted) {
      if (!row.year || !Number.isFinite(row.value)) continue;
      years.push(row.year);
      const display = convertKrwToDisplay(
        row.value,
        currency,
        dalToWon,
        scale.scale,
        1
      );
      values.push(display ?? 0);
    }
    return { years, values };
  }, [sorted, currency, dalToWon, scale.scale]);

  const trendlinePlot = useMemo(() => {
    if (!trendline || chartData.years.length === 0) {
      return null;
    }
    const { slope, intercept } = trendline.coefficients;
    if (!Number.isFinite(slope) || !Number.isFinite(intercept)) {
      return null;
    }
    const sortedYears = [...chartData.years].sort((a, b) => a - b);
    const start = sortedYears[0];
    const end = sortedYears[sortedYears.length - 1];
    if (!Number.isFinite(start) || !Number.isFinite(end)) {
      return null;
    }
    const convertAmount = (value: number | null) =>
      convertKrwToDisplay(value, currency, dalToWon, scale.scale, 1);
    const yStart = convertAmount(slope * start + intercept);
    const yEnd = convertAmount(slope * end + intercept);
    if (yStart === null || yEnd === null) {
      return null;
    }
    const displaySlope = convertAmount(slope);
    const displayIntercept = convertAmount(intercept);
    if (displaySlope === null || displayIntercept === null) {
      return null;
    }
    const annotationOptions = trendline.annotation ?? {};
    const formatCoeff = (value: number) =>
      value.toLocaleString(undefined, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      });
    const interceptSign = displayIntercept >= 0 ? "+" : "-";
    const baseText = `y = ${formatCoeff(
      displaySlope
    )}x ${interceptSign} ${formatCoeff(Math.abs(displayIntercept))}`;
    const annotationText = annotationOptions.bold
      ? `<b>${baseText}</b>`
      : baseText;
    const trace: Partial<PlotData> = {
      type: "scatter",
      mode: "lines",
      x: [start, end],
      y: [yStart, yEnd],
      line: { color: "#ef4444", width: 2 },
      hoverinfo: "skip",
      name: "Trend Line",
    };
    const annotation: Partial<Annotations> = {
      text: annotationText,
      x: annotationOptions.x ?? 0.95,
      y: annotationOptions.y ?? 0.9,
      xref: "paper",
      yref: "paper",
      xanchor: "right",
      yanchor: "bottom",
      font: {
        size: annotationOptions.fontSize ?? 12,
        color: annotationOptions.color ?? "#f87171",
        family: annotationOptions.fontFamily ?? "'Inter', 'sans-serif'",
      },
      bgcolor: "rgba(15,23,42,0.75)",
      bordercolor: "transparent",
      showarrow: false,
    };
    return { trace, annotation };
  }, [chartData.years, trendline, currency, dalToWon, scale.scale]);

  return (
    <div className="space-y-5">
      <div className="overflow-auto rounded-xl border border-slate-800">
        <table className="w-full min-w-[480px] table-fixed text-xs">
          <thead className="bg-slate-800 text-slate-200">
            <tr>
              <th className="w-16 px-3 py-2 text-left">#</th>
              <th className="w-28 px-3 py-2 text-left">연도</th>
              <th className="px-3 py-2 text-left">단가 ({scale.label})</th>
            </tr>
          </thead>
          <tbody>
            {displayRows.map((row, index) => (
              <tr key={row.id} className="border-t border-slate-800">
                <td className="px-3 py-1 text-slate-500">{index + 1}</td>
                <td className="px-3 py-1">
                  <input
                    type="number"
                    value={row.year || ""}
                    disabled={!enabled}
                    onChange={(event) => {
                      const parsed = sanitizeNumericInput(event.target.value);
                      onChange(index, { year: parsed ?? 0 });
                    }}
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none disabled:cursor-not-allowed"
                  />
                </td>
                <td className="px-3 py-1">
                  <input
                    type="number"
                    value={row.value ?? ""}
                    disabled={!enabled}
                    onChange={(event) => {
                      const parsed = sanitizeNumericInput(event.target.value);
                      const krw = convertDisplayToKrw(
                        parsed,
                        currency,
                        dalToWon,
                        scale.scale,
                        1
                      );
                      onChange(index, { value: krw ?? 0 });
                    }}
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none disabled:cursor-not-allowed"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h3 className="text-sm font-semibold text-slate-100">{title} 추이</h3>
        <div className="mt-3 min-h-[260px]">
          {!graphEnabled ? (
            <p className="rounded-md border border-slate-800 bg-slate-900/80 px-3 py-6 text-center text-xs text-slate-500">
              그래프 표시가 비활성화되어 있습니다.
            </p>
          ) : chartData.years.length === 0 ? (
            <p className="rounded-md border border-slate-800 bg-slate-900/80 px-3 py-6 text-center text-xs text-slate-500">
              그래프를 표시할 데이터가 없습니다.
            </p>
          ) : (
            <PlotlyWrapper>
              {({ Plot, plotEvents }) => {
                const layout: Partial<Layout> = {
                  template: PLOTLY_DARK_TEMPLATE,
                  height: 260,
                  margin: { t: 24, r: 24, b: 48, l: 48 },
                  xaxis: { title: { text: "Year" } },
                  yaxis: { title: { text: scale.label } },
                  paper_bgcolor: PLOT_BACKGROUND,
                  plot_bgcolor: PLOT_BACKGROUND,
                };
                const data: Partial<PlotData>[] = [
                  {
                    type: "scatter",
                    mode: "lines+markers",
                    x: chartData.years,
                    y: chartData.values,
                    marker: { color: "#38bdf8" },
                    line: { color: "#60a5fa" },
                    name: "단가",
                  },
                ];
                if (trendlinePlot) {
                  data.push(trendlinePlot.trace);
                  layout.annotations = [
                    ...(layout.annotations ?? []),
                    trendlinePlot.annotation,
                  ];
                }
                return (
                  <Plot
                    data={data}
                    layout={layout}
                    style={{ width: "100%", height: "100%" }}
                    {...plotEvents}
                  />
                );
              }}
            </PlotlyWrapper>
          )}
        </div>
      </div>
    </div>
  );
};

interface EscalationTabProps {
  values: EscalationDefaults;
  enabled: boolean;
  onChange: (values: Partial<EscalationDefaults>) => void;
}

const EscalationTab = ({ values, enabled, onChange }: EscalationTabProps) => {
  const fields: Array<{
    key: keyof EscalationDefaults;
    label: string;
    suffix?: string;
  }> = [
    { key: "R_Inflation", label: "물가상승률", suffix: "%" },
    { key: "R_WageIncrease", label: "인건비 상승률", suffix: "%" },
    { key: "R_ElecBillIncrease", label: "전력요금 상승률", suffix: "%" },
    { key: "R_Depreciation", label: "감가상각률", suffix: "%" },
    { key: "R_SalvageVal", label: "잔존가치율", suffix: "%" },
    { key: "R_Discount", label: "할인율", suffix: "%" },
    { key: "Yr_Life", label: "설비 내용연수", suffix: "년" },
    { key: "Yr_Base", label: "기준연도", suffix: "년" },
    { key: "Yr_DoStart", label: "운전 시작 연도", suffix: "년" },
    { key: "Yr_EE", label: "평가 기간", suffix: "년" },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {fields.map((field) => (
        <NumberField
          key={field.key}
          label={field.label}
          value={values[field.key]}
          onChange={(value) => {
            const parsed = sanitizeNumericInput(value);
            if (parsed !== null) {
              onChange({ [field.key]: parsed });
            }
          }}
          suffix={field.suffix}
          disabled={!enabled}
        />
      ))}
    </div>
  );
};

interface ReportTabProps {
  report: Record<string, number | string | null>;
  date: string | null;
  error: string | null;
}

const ReportTab = ({ report, date, error }: ReportTabProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">
          최근 출력 기준일:{" "}
          <span className="text-slate-200">{date ?? "-"}</span>
        </p>
        {error && <p className="text-xs text-rose-400">{error}</p>}
      </div>
      <div className="max-h-[420px] overflow-auto rounded-xl border border-slate-800">
        <table className="w-full table-fixed text-xs">
          <thead className="bg-slate-800 text-slate-200">
            <tr>
              <th className="w-1/2 px-3 py-2 text-left">항목</th>
              <th className="px-3 py-2 text-left">값</th>
              <th className="w-24 px-3 py-2 text-left">단위</th>
            </tr>
          </thead>
          <tbody>
            {ECONOMIC_REPORT_FIELDS.map((field) => (
              <tr key={field.key} className="border-t border-slate-800">
                <td className="px-3 py-2 text-slate-200">{field.label}</td>
                <td className="px-3 py-2 text-slate-100">
                  {formatNumber(
                    typeof report[field.key] === "number"
                      ? (report[field.key] as number)
                      : sanitizeNumericInput(
                          report[field.key] as string | number | null
                        ),
                    0
                  )}
                </td>
                <td className="px-3 py-2 text-slate-500">
                  {field.unit ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface CashflowTabProps {
  rows: Array<Record<string, number | string | null>>;
  error: string | null;
  graphEnabled: boolean;
}

const CashflowTab = ({ rows, error, graphEnabled }: CashflowTabProps) => {
  const years: number[] = [];
  const series: Record<string, number[]> = {};

  for (const item of CASHFLOW_SERIES) {
    series[item.key] = [];
  }

  for (const row of rows) {
    const yearValue = sanitizeNumericInput(row.Year as string | number | null);
    if (yearValue === null) continue;
    years.push(yearValue);
    for (const item of CASHFLOW_SERIES) {
      const value = sanitizeNumericInput(
        row[item.key] as string | number | null
      );
      series[item.key].push(value ?? 0);
    }
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-xs text-rose-400">{error}</p>}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h3 className="text-sm font-semibold text-slate-100">
          연도별 현금흐름
        </h3>
        <div className="mt-3 min-h-[280px]">
          {!graphEnabled ? (
            <p className="rounded-md border border-slate-800 bg-slate-900/80 px-3 py-6 text-center text-xs text-slate-500">
              그래프 표시가 비활성화되어 있습니다.
            </p>
          ) : years.length === 0 ? (
            <p className="rounded-md border border-slate-800 bg-slate-900/80 px-3 py-6 text-center text-xs text-slate-500">
              그래프를 표시할 데이터가 없습니다.
            </p>
          ) : (
            <PlotlyWrapper>
              {({ Plot, plotEvents }) => {
                const layout: Partial<Layout> = {
                  template: PLOTLY_DARK_TEMPLATE,
                  height: 280,
                  margin: { t: 24, r: 24, b: 48, l: 48 },
                  xaxis: { title: { text: "Year" } },
                  yaxis: { title: { text: "원" } },
                  paper_bgcolor: PLOT_BACKGROUND,
                  plot_bgcolor: PLOT_BACKGROUND,
                };
                return (
                  <Plot
                    data={CASHFLOW_SERIES.map((item) => ({
                      type: "scatter",
                      mode: "lines+markers",
                      x: years,
                      y: series[item.key],
                      name: item.name,
                      line: { color: item.color },
                      marker: { color: item.color },
                    }))}
                    layout={layout}
                    style={{ width: "100%", height: "100%" }}
                    {...plotEvents}
                  />
                );
              }}
            </PlotlyWrapper>
          )}
        </div>
      </div>

      <div className="max-h-[320px] overflow-auto rounded-xl border border-slate-800">
        <table className="w-full min-w-[480px] table-fixed text-xs">
          <thead className="bg-slate-800 text-slate-200">
            <tr>
              <th className="w-20 px-3 py-2 text-left">Year</th>
              {CASHFLOW_SERIES.map((item) => (
                <th key={item.key} className="px-3 py-2 text-left">
                  {item.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={String(row.Year ?? index)}
                className="border-t border-slate-800"
              >
                <td className="px-3 py-2 text-slate-200">{row.Year ?? "-"}</td>
                {CASHFLOW_SERIES.map((item) => (
                  <td key={item.key} className="px-3 py-2 text-slate-100">
                    {formatNumber(
                      sanitizeNumericInput(
                        row[item.key] as string | number | null
                      )
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface CoefficientTabProps {
  rows: Array<Record<string, number | string | null>>;
  error: string | null;
}

const CoefficientTab = ({ rows, error }: CoefficientTabProps) => {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-400">
        {error ?? "회귀 계수 데이터를 찾을 수 없습니다."}
      </div>
    );
  }

  const headers = Object.keys(rows[0]);

  return (
    <div className="space-y-4">
      {error && <p className="text-xs text-rose-400">{error}</p>}
      <div className="max-h-[440px] overflow-auto rounded-xl border border-slate-800">
        <table className="w-full min-w-[520px] table-fixed text-xs">
          <thead className="bg-slate-800 text-slate-200">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-3 py-2 text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const compositeKey = headers
                .map((header) => `${row[header] ?? ""}`)
                .join("|")
                .trim();
              const key =
                compositeKey.length > 0 ? compositeKey : `row-${index}`;
              return (
                <tr key={key} className="border-t border-slate-800">
                  {headers.map((header) => (
                    <td key={header} className="px-3 py-2 text-slate-100">
                      {formatNumber(
                        sanitizeNumericInput(
                          row[header] as string | number | null
                        )
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface NumberFieldProps {
  label: string;
  value: number | null | undefined;
  onChange: (value: string) => void;
  disabled?: boolean;
  suffix?: string;
  min?: number;
  step?: number;
}

const NumberField = ({
  label,
  value,
  onChange,
  disabled,
  suffix,
  min,
  step,
}: NumberFieldProps) => {
  return (
    <label className="flex flex-col rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-200">
      <span className="text-slate-300">{label}</span>
      <div className="mt-2 flex items-center gap-2">
        <input
          type="number"
          value={value ?? ""}
          min={min}
          step={step}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none disabled:cursor-not-allowed"
        />
        {suffix && <span className="text-slate-500">{suffix}</span>}
      </div>
    </label>
  );
};

interface ToggleFieldProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

const ToggleField = ({
  label,
  description,
  checked,
  onChange,
}: ToggleFieldProps) => {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-200">
      <div className="pr-4">
        <p className="font-medium text-slate-100">{label}</p>
        {description && (
          <p className="text-[11px] text-slate-500">{description}</p>
        )}
      </div>
      <label className="relative inline-flex h-5 w-10 cursor-pointer items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span className="absolute inset-0 rounded-full bg-slate-700 transition peer-checked:bg-emerald-500" />
        <span className="absolute left-1 h-3.5 w-3.5 rounded-full bg-white transition peer-checked:translate-x-5" />
      </label>
    </div>
  );
};

export { EconomicEvaluationWithGraph };
