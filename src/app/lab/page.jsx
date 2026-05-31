"use client";

import { useEffect, useMemo, useState } from "react";
import AppNavigation from "@/components/AppNavigation";
import {
  formatNumber,
  getCarbonOptions,
  getHydrocarbonDetails,
  getReagentTestResult,
  hydrocarbonTypes,
  reagentMetadata,
  reagents,
  typeKeys,
} from "@/lib/hydrocarbons";

const bondOrders = {
  alkane: 1,
  alkene: 2,
  alkyne: 3,
};
const TRACE_STEP_DURATION_MS = 2000;
const reagentShortLabels = {
  브롬수: "Br2",
  "과망가니즈산 칼륨": "KMnO4",
  "암모니아성 질산은": "AgNO3",
};

function getFormulaText(details) {
  return `C${details.carbon}H${details.hCount}`;
}

function getCombustionEquationText(details) {
  return `${getFormulaText(details)} + ${formatNumber(details.oxygen)}O2 -> ${
    details.carbon
  }CO2 + ${formatNumber(details.water)}H2O`;
}

function getMethodTrace({
  action,
  carbonCount,
  details,
  mode,
  reactionResult,
  selectedReagent,
  selectedType,
}) {
  const className = selectedType.className;
  const formula = getFormulaText(details);
  const combustionEquation = getCombustionEquationText(details);
  const actionKind = action.kind;

  if (actionKind === "combust" || mode === "combust") {
    return {
      title: "Combust 실행",
      steps: [
        {
          method: `${className}.get_combustion_reaction()`,
          result: "오버라이딩된 클래스 이름으로 연소 메서드 호출",
        },
        {
          method: `${className}.formula`,
          result: `${formula} 반환`,
        },
        {
          method: "balance_equation()",
          result: `${formatNumber(details.oxygen)} O2, ${details.carbon} CO2, ${formatNumber(
            details.water
          )} H2O 계산`,
        },
        {
          method: "return",
          result: combustionEquation,
        },
      ],
    };
  }

  if (actionKind === "reagent") {
    return {
      title: "시약 반응 테스트",
      steps: [
        {
          method: `${className}.perform_test("${selectedReagent}")`,
          result: "하위 클래스에서 재정의한 메서드로 dispatch",
        },
        {
          method: `${className}.formula`,
          result: `${formula} 시료 확인`,
        },
        {
          method: "observe()",
          result: reactionResult.labComment,
        },
        {
          method: "return",
          result: reactionResult.result,
        },
      ],
    };
  }

  if (actionKind === "carbon") {
    return {
      title: "탄소 수 변경",
      steps: [
        {
          method: `${className}.__init__(${carbonCount})`,
          result: "super().__init__()로 공통 필드 재설정",
        },
        {
          method: `${className}.formula`,
          result: `${formula} 계산`,
        },
        {
          method: `${className}.molar_mass`,
          result: `${details.molarMass} g/mol 반환`,
        },
      ],
    };
  }

  if (actionKind === "type") {
    return {
      title: "Concrete Class 선택",
      steps: [
        {
          method: "HydrocarbonADT",
          result: "formula, molar_mass, perform_test 필수 구현 항목 확인",
        },
        {
          method: "Hydrocarbon.__init__()",
          result: "_name, _c_count, _h_count 캡슐화 필드 준비",
        },
        {
          method: `${className}.__init__(${carbonCount})`,
          result: `${selectedType.koreanName} 규칙으로 ${formula} 생성`,
        },
      ],
    };
  }

  return {
    title: "초기 객체 생성",
    steps: [
      {
        method: "HydrocarbonADT",
        result: "추상 프로퍼티와 추상 메서드 선언",
      },
      {
        method: `${className}.__init__(${carbonCount})`,
        result: `Hydrocarbon을 상속해 ${formula} 인스턴스 생성`,
      },
      {
        method: `${className}.perform_test("${selectedReagent}")`,
        result: reactionResult.labComment,
      },
    ],
  };
}

function VisuallyHidden({ children }) {
  return <span className="sr-only">{children}</span>;
}

function TypeGlyph({ typeKey }) {
  const bondOrder = bondOrders[typeKey];
  const bondLineYPositions = {
    1: [12],
    2: [9, 15],
    3: [7, 12, 17],
  }[bondOrder];
  const bondRanges = [
    [24, 38],
    [58, 72],
  ];
  const atomCenters = [14, 48, 82];

  return (
    <svg
      className={`lab-type-glyph lab-bond-order-${bondOrder}`}
      viewBox="0 0 96 24"
      aria-hidden="true"
      focusable="false"
    >
      {bondRanges.flatMap(([x1, x2], bondIndex) =>
        bondLineYPositions.map((yPosition) => (
          <line
            className="lab-glyph-bond-line"
            key={`${bondIndex}-${yPosition}`}
            x1={x1}
            y1={yPosition}
            x2={x2}
            y2={yPosition}
          />
        ))
      )}
      {atomCenters.map((centerX) => (
        <g className="lab-glyph-atom-node" key={centerX}>
          <circle className="lab-glyph-atom-fill" cx={centerX} cy="12" r="8.2" />
          <circle
            className="lab-glyph-atom-highlight"
            cx={centerX - 3.3}
            cy="8.5"
            r="2.45"
          />
        </g>
      ))}
    </svg>
  );
}

function CarbonDots({ count }) {
  return (
    <span className="lab-carbon-dots" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <span key={index} />
      ))}
    </span>
  );
}

function MoleculeChain({ count, typeKey }) {
  const bondOrder = bondOrders[typeKey];
  const chainLength = count >= 7 ? "long" : count >= 5 ? "medium" : "short";

  return (
    <span
      className={`lab-molecule-chain lab-molecule-chain-${typeKey} lab-molecule-chain-${chainLength}`}
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <span className="lab-molecule-unit" key={index}>
          {index > 0 ? (
            <span className={`lab-chain-bond lab-chain-bond-${bondOrder}`}>
              {Array.from({ length: bondOrder }, (_, lineIndex) => (
                <span key={lineIndex} />
              ))}
            </span>
          ) : null}
          <span className="lab-carbon-core">
            <span className="lab-h-orbit lab-h-orbit-top" />
            <span className="lab-h-orbit lab-h-orbit-bottom" />
          </span>
        </span>
      ))}
    </span>
  );
}

function ReagentGlyph({ reagent }) {
  const metadata = reagentMetadata[reagent];
  const isBromine = reagent === "브롬수";
  const isPermanganate = reagent === "과망가니즈산 칼륨";

  return (
    <span
      className={`lab-reagent-glyph ${
        isPermanganate ? "lab-reagent-glyph-precipitate" : ""
      }`}
      aria-hidden="true"
      style={{
        "--reagent-accent": metadata.accentColor,
        "--reagent-base": metadata.initialColor,
      }}
    >
      <svg viewBox="0 0 80 92" role="presentation">
        <path
          d="M40 4C27 21 16 36 16 53c0 19 11 33 24 33s24-14 24-33C64 36 53 21 40 4Z"
          className="lab-reagent-drop"
        />
        <path
          d="M31 23c-7 9-11 18-11 28 0 14 8 25 20 27"
          className="lab-reagent-shine"
        />
        {isBromine ? (
          <circle cx="51" cy="56" r="8" className="lab-reagent-bubble" />
        ) : null}
        {isPermanganate ? (
          <>
            <circle cx="30" cy="62" r="4.5" className="lab-reagent-grain" />
            <circle cx="42" cy="68" r="3.5" className="lab-reagent-grain" />
            <circle cx="52" cy="60" r="4" className="lab-reagent-grain" />
          </>
        ) : null}
        {!isBromine && !isPermanganate ? (
          <>
            <circle cx="30" cy="62" r="4" className="lab-reagent-silver-dot" />
            <circle cx="42" cy="69" r="4" className="lab-reagent-silver-dot" />
            <circle cx="53" cy="61" r="4" className="lab-reagent-silver-dot" />
          </>
        ) : null}
      </svg>
    </span>
  );
}

function CombustIcon() {
  return (
    <svg viewBox="0 0 80 92" role="presentation">
      <path
        d="M42 5c6 14-2 22 10 34 7 7 12 15 12 26 0 14-11 24-25 24S14 79 14 65c0-12 8-21 15-30 6-8 7-17 13-30Z"
        className="lab-combust-flame-outer"
      />
      <path
        d="M40 43c4 8-1 12 5 18 3 3 5 7 5 12 0 8-5 13-11 13s-11-5-11-13c0-8 7-14 12-30Z"
        className="lab-combust-flame-inner"
      />
    </svg>
  );
}

function ProductMolecule({ type }) {
  const isCarbonDioxide = type === "co2";

  return (
    <span className="lab-product-molecule" aria-hidden="true">
      {isCarbonDioxide ? (
        <>
          <span className="lab-product-atom lab-product-oxygen">O</span>
          <span className="lab-product-bond" />
          <span className="lab-product-atom lab-product-carbon">C</span>
          <span className="lab-product-bond" />
          <span className="lab-product-atom lab-product-oxygen">O</span>
        </>
      ) : (
        <>
          <span className="lab-product-atom lab-product-hydrogen">H</span>
          <span className="lab-product-bond" />
          <span className="lab-product-atom lab-product-oxygen">O</span>
          <span className="lab-product-bond" />
          <span className="lab-product-atom lab-product-hydrogen">H</span>
        </>
      )}
    </span>
  );
}

function CombustionVisual({ details, selectedTypeKey }) {
  const equation = getCombustionEquationText(details);
  const fuelSparks = Array.from({ length: Math.min(details.carbon, 8) });
  const oxygenPairs = Array.from({ length: 5 });
  const productParticles = Array.from({ length: 8 });

  return (
    <div className="lab-combust-visual" role="img" aria-label={`연소 과정: ${equation}`}>
      <div className="lab-combust-fuel">
        <MoleculeChain count={details.carbon} typeKey={selectedTypeKey} />
        <span className="lab-combust-fuel-heat" aria-hidden="true">
          {fuelSparks.map((_, index) => (
            <span
              className="lab-combust-fuel-spark"
              key={index}
              style={{
                "--fuel-spark-delay": `${index * 130}ms`,
                "--fuel-spark-x": `${12 + index * 11}%`,
              }}
            />
          ))}
        </span>
      </div>

      <div className="lab-combust-fire" aria-hidden="true">
        <span className="lab-combust-ring lab-combust-ring-one" />
        <span className="lab-combust-ring lab-combust-ring-two" />
        <span className="lab-oxygen-stream">
          {oxygenPairs.map((_, index) => (
            <span
              className="lab-oxygen-pair"
              key={index}
              style={{
                "--oxygen-delay": `${index * 330}ms`,
                "--oxygen-y": `${(index % 2 === 0 ? -1 : 1) * (1.2 + index * 0.16)}rem`,
              }}
            >
              <span />
              <span />
            </span>
          ))}
        </span>
        <CombustIcon />
        <span className="lab-oxygen-dot lab-oxygen-dot-one" />
        <span className="lab-oxygen-dot lab-oxygen-dot-two" />
        <span className="lab-oxygen-dot lab-oxygen-dot-three" />
      </div>

      <div className="lab-combust-product-stream" aria-hidden="true">
        {productParticles.map((_, index) => {
          const isWater = index % 3 === 1;

          return (
            <span
              className={`lab-product-particle ${
                isWater ? "lab-product-particle-h2o" : "lab-product-particle-co2"
              }`}
              key={index}
              style={{
                "--product-delay": `${520 + index * 190}ms`,
                "--product-y": `${(index % 4) * 1.12 - 1.7}rem`,
              }}
            >
              <span />
              <span />
              <span />
            </span>
          );
        })}
      </div>

      <div className="lab-combust-products">
        <div className="lab-product-card lab-product-card-co2">
          <ProductMolecule type="co2" />
          <strong>
            {details.carbon} CO<sub>2</sub>
          </strong>
        </div>
        <div className="lab-product-card lab-product-card-h2o">
          <ProductMolecule type="h2o" />
          <strong>
            {formatNumber(details.water)} H<sub>2</sub>O
          </strong>
        </div>
      </div>
    </div>
  );
}

function BeakerVisual({ details, reactionResult }) {
  const liquidKey = `${reactionResult.typeKey}-${reactionResult.reagent}-${details.carbon}`;

  return (
    <div
      className={`lab-apple-beaker reagent-phase-${reactionResult.phase}`}
      aria-label={`${reactionResult.reagent} 반응 결과: ${reactionResult.finalLabel}`}
      role="img"
    >
      <span className="lab-beaker-lip" />
      <span className="lab-beaker-glass">
        <span className="lab-beaker-liquid" key={liquidKey}>
          <span className="lab-beaker-liquid-initial" />
          <span className="lab-beaker-liquid-final" />
          <span className="lab-beaker-shine" />
          <span className="lab-beaker-ripple lab-beaker-ripple-one" />
          <span className="lab-beaker-ripple lab-beaker-ripple-two" />
          <span className="lab-beaker-precipitate lab-beaker-precipitate-one" />
          <span className="lab-beaker-precipitate lab-beaker-precipitate-two" />
          <span className="lab-beaker-precipitate lab-beaker-precipitate-three" />
          <span className="lab-beaker-precipitate lab-beaker-precipitate-four" />
        </span>
      </span>
    </div>
  );
}

function ReactionSignal({ tone }) {
  return (
    <span
      className={`lab-reaction-signal lab-reaction-signal-${tone}`}
      aria-hidden="true"
    >
      <span />
      <span />
      <span />
    </span>
  );
}

function MethodToast({ isVisible, step, stepIndex, trace }) {
  if (!step) {
    return null;
  }

  return (
    <section
      className={`lab-method-toast ${isVisible ? "lab-method-toast-visible" : ""}`}
      aria-live="polite"
      style={{ "--trace-step-count": trace.steps.length }}
    >
      <div className="lab-method-toast-meta">
        <span>Method Trace</span>
        <strong>{trace.title}</strong>
      </div>

      <div className="lab-method-toast-body">
        <span className="lab-method-toast-index">{stepIndex + 1}</span>
        <div>
          <code>{step.method}</code>
          <p>{step.result}</p>
        </div>
      </div>

      <div className="lab-method-toast-progress" aria-hidden="true">
        {trace.steps.map((traceStep, index) => (
          <span
            className={
              index <= stepIndex ? "lab-method-toast-progress-active" : ""
            }
            key={`${traceStep.method}-${index}`}
          />
        ))}
      </div>
    </section>
  );
}

export default function LabPage() {
  const [selectedTypeKey, setSelectedTypeKey] = useState("alkane");
  const [carbonCount, setCarbonCount] = useState(4);
  const [selectedReagent, setSelectedReagent] = useState("과망가니즈산 칼륨");
  const [mode, setMode] = useState("reagent");
  const [lastAction, setLastAction] = useState({ kind: "init" });
  const [traceRunId, setTraceRunId] = useState(0);
  const [visibleStepIndex, setVisibleStepIndex] = useState(0);
  const [isTraceVisible, setIsTraceVisible] = useState(true);

  const selectedType = hydrocarbonTypes[selectedTypeKey];
  const carbonOptions = getCarbonOptions(selectedType);
  const details = useMemo(
    () => getHydrocarbonDetails(selectedType, carbonCount),
    [selectedType, carbonCount]
  );
  const reactionResult = useMemo(
    () => getReagentTestResult(selectedTypeKey, selectedReagent, carbonCount),
    [selectedTypeKey, selectedReagent, carbonCount]
  );
  const methodTrace = useMemo(
    () =>
      getMethodTrace({
        action: lastAction,
        carbonCount,
        details,
        mode,
        reactionResult,
        selectedReagent,
        selectedType,
      }),
    [
      carbonCount,
      details,
      lastAction,
      mode,
      reactionResult,
      selectedReagent,
      selectedType,
    ]
  );
  const traceStepCount = methodTrace.steps.length;
  const activeStepIndex = traceStepCount
    ? Math.min(visibleStepIndex, traceStepCount - 1)
    : 0;
  const activeTraceStep = methodTrace.steps[activeStepIndex];

  useEffect(() => {
    if (!traceStepCount) {
      return undefined;
    }

    const stepTimers = Array.from({ length: traceStepCount - 1 }, (_, index) =>
      window.setTimeout(
        () => setVisibleStepIndex(index + 1),
        (index + 1) * TRACE_STEP_DURATION_MS
      )
    );
    const hideTimer = window.setTimeout(
      () => setIsTraceVisible(false),
      traceStepCount * TRACE_STEP_DURATION_MS
    );

    return () => {
      stepTimers.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(hideTimer);
    };
  }, [traceRunId, traceStepCount]);

  function queueTrace(action) {
    setLastAction(action);
    setIsTraceVisible(true);
    setVisibleStepIndex(0);
    setTraceRunId((current) => current + 1);
  }

  function handleTypeSelect(typeKey) {
    const nextType = hydrocarbonTypes[typeKey];
    setSelectedTypeKey(typeKey);
    setCarbonCount((current) =>
      Math.min(Math.max(current, nextType.minCarbon), nextType.maxCarbon)
    );
    queueTrace({ kind: "type" });
  }

  function updateCarbonCount(nextCarbonCount) {
    setCarbonCount(
      Math.min(
        Math.max(nextCarbonCount, selectedType.minCarbon),
        selectedType.maxCarbon
      )
    );
    queueTrace({ kind: "carbon" });
  }

  function handleReagentSelect(reagent) {
    setSelectedReagent(reagent);
    setMode("reagent");
    queueTrace({ kind: "reagent" });
  }

  function handleCombust() {
    setMode("combust");
    queueTrace({ kind: "combust" });
  }

  return (
    <main className={`lab-minimal-page lab-minimal-${selectedType.accent}`}>
      <section className="lab-minimal-shell">
        <AppNavigation active="lab" />

        <section className="lab-visual-workbench" aria-label="반응 조합 실험실">
          <aside className="lab-icon-dock" aria-label="실험 조건">
            <section
              className="lab-control-container lab-control-container-types"
              aria-label="탄화수소 종류"
            >
              <p className="lab-control-title">탄화수소</p>
              <div className="lab-icon-group" role="radiogroup" aria-label="탄화수소 종류">
                {typeKeys.map((typeKey) => {
                  const type = hydrocarbonTypes[typeKey];
                  const isActive = selectedTypeKey === typeKey;

                  return (
                    <button
                      className={`lab-icon-button lab-icon-button-${type.accent} ${
                        isActive ? "lab-icon-button-active" : ""
                      }`}
                      key={typeKey}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      aria-label={`${type.koreanName} 선택`}
                      title={type.koreanName}
                      onClick={() => handleTypeSelect(typeKey)}
                    >
                      <TypeGlyph typeKey={typeKey} />
                      <span className="lab-option-label">{type.className}</span>
                      <span className="lab-option-sub">{type.formulaRule}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section
              className="lab-control-container lab-control-container-carbon"
              aria-label="탄소 수"
            >
              <p className="lab-control-title">탄소 수</p>
              <div className="lab-carbon-strip">
                <button
                  className="lab-carbon-step"
                  type="button"
                  aria-label="탄소 수 줄이기"
                  onClick={() => updateCarbonCount(carbonCount - 1)}
                  disabled={carbonCount <= selectedType.minCarbon}
                >
                  <span aria-hidden="true" />
                </button>

                <div className="lab-carbon-options" role="radiogroup" aria-label="탄소 수 선택">
                  {carbonOptions.map((option) => (
                    <button
                      className={`lab-carbon-token ${
                        option === carbonCount ? "lab-carbon-token-active" : ""
                      }`}
                      key={option}
                      type="button"
                      aria-label={`탄소 ${option}개`}
                      aria-checked={option === carbonCount}
                      role="radio"
                      title={`C${option}`}
                      onClick={() => updateCarbonCount(option)}
                    >
                      <span className="lab-carbon-number">C{option}</span>
                      <CarbonDots count={option} />
                    </button>
                  ))}
                </div>

                <button
                  className="lab-carbon-step lab-carbon-step-plus"
                  type="button"
                  aria-label="탄소 수 늘리기"
                  onClick={() => updateCarbonCount(carbonCount + 1)}
                  disabled={carbonCount >= selectedType.maxCarbon}
                >
                  <span aria-hidden="true" />
                </button>
              </div>
            </section>

            <section
              className="lab-control-container lab-control-container-reagents"
              aria-label="시약"
            >
              <p className="lab-control-title">시약</p>
              <div className="lab-icon-group" role="radiogroup" aria-label="시약">
                {reagents.map((reagent) => {
                  const isActive = selectedReagent === reagent;
                  const metadata = reagentMetadata[reagent];

                  return (
                    <button
                      className={`lab-icon-button lab-reagent-icon-button ${
                        isActive ? "lab-icon-button-active" : ""
                      }`}
                      key={reagent}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      aria-label={`${reagent} 선택`}
                      title={reagent}
                      onClick={() => handleReagentSelect(reagent)}
                      style={{ "--dock-accent": metadata.accentColor }}
                    >
                      <ReagentGlyph reagent={reagent} />
                      <span className="lab-option-label">{reagent}</span>
                      <span className="lab-option-sub">
                        {reagentShortLabels[reagent]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section
              className="lab-control-container lab-control-container-action"
              aria-label="반응 실행"
            >
              <p className="lab-control-title">반응</p>
              <div className="lab-action-strip">
                <button
                  className={`lab-combust-trigger ${
                    mode === "combust" ? "lab-combust-trigger-active" : ""
                  }`}
                  type="button"
                  aria-pressed={mode === "combust"}
                  aria-label="Combust 과정 실행"
                  title="Combust"
                  onClick={handleCombust}
                >
                  <CombustIcon />
                  <span className="lab-option-label">Combust</span>
                  <span className="lab-option-sub">O2 -&gt; CO2</span>
                </button>
              </div>
            </section>
          </aside>

          <div className="lab-output-column">
            <section
              className={`lab-cinematic-stage ${
                mode === "combust" ? "lab-cinematic-stage-combust" : ""
              } reagent-phase-${reactionResult.phase}`}
              aria-live="polite"
              style={{
                "--lab-accent":
                  mode === "combust" ? "#f97316" : reactionResult.metadata.accentColor,
                "--reagent-initial": reactionResult.metadata.initialColor,
                "--reagent-final": reactionResult.finalColor,
                "--reagent-accent": reactionResult.metadata.accentColor,
              }}
            >
              <VisuallyHidden>
                {mode === "combust"
                  ? `연소 과정: ${getCombustionEquationText(details)}`
                  : `${selectedType.koreanName}, 탄소 ${carbonCount}개, ${selectedReagent}: ${reactionResult.finalLabel}`}
              </VisuallyHidden>

              <div className="lab-stage-glow" aria-hidden="true" />
              <MethodToast
                isVisible={isTraceVisible}
                step={activeTraceStep}
                stepIndex={activeStepIndex}
                trace={methodTrace}
              />

              {mode === "combust" ? (
                <CombustionVisual details={details} selectedTypeKey={selectedTypeKey} />
              ) : (
                <>
                  <div className="lab-stage-molecule" aria-hidden="true">
                    <MoleculeChain count={details.carbon} typeKey={selectedTypeKey} />
                  </div>

                  <div className="lab-stage-reagent" aria-hidden="true">
                    <ReagentGlyph reagent={selectedReagent} />
                    <span className="lab-pour-trail" />
                  </div>

                  <div className="lab-stage-beaker">
                    <ReactionSignal tone={reactionResult.tone} />
                    <BeakerVisual details={details} reactionResult={reactionResult} />
                  </div>
                </>
              )}
            </section>
          </div>
        </section>
      </section>
    </main>
  );
}
