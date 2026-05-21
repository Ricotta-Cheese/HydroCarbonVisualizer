"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import AppNavigation from "@/components/AppNavigation";
import {
  formatNumber,
  getHydrocarbonDetails,
  getHydrocarbonName,
  hydrocarbonTypes,
  typeKeys,
} from "@/lib/hydrocarbons";

const DESKTOP_STEP_SCROLL_RATIO = 0.675;
const DESKTOP_SCROLL_ACTIVATION_RATIO = 0.04;
const DESKTOP_BUTTON_SETTLE_RATIO = 0.14;

function ChemicalFormula({ carbon, hydrogen }) {
  return (
    <span className="formula">
      C<sub>{carbon}</sub>H<sub>{hydrogen}</sub>
    </span>
  );
}

function FormulaRule({ rule }) {
  const hydrogenRule = {
    "CnH2n+2": "2n+2",
    CnH2n: "2n",
    "CnH2n-2": "2n-2",
  }[rule];

  return (
    <span className="formula">
      C<sub>n</sub>H<sub>{hydrogenRule}</sub>
    </span>
  );
}

function EquationTerm({ active, delay = 0, children }) {
  return (
    <span
      className={`combustion-equation-term ${
        active ? "combustion-equation-term-active" : ""
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </span>
  );
}

function ReactionEquation({ details, activeStep }) {
  const terms = [
    {
      active: activeStep >= 0,
      content: (
        <ChemicalFormula carbon={details.carbon} hydrogen={details.hCount} />
      ),
    },
    {
      active: activeStep >= 1,
      content: (
        <>
          {formatNumber(details.oxygen)} O<sub>2</sub>
        </>
      ),
    },
    {
      active: activeStep >= 2,
      content: (
        <>
          {details.carbon} CO<sub>2</sub>
        </>
      ),
    },
    {
      active: activeStep >= 3,
      content: (
        <>
          {formatNumber(details.water)} H<sub>2</sub>O
        </>
      ),
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 text-lg font-semibold sm:gap-3 sm:text-2xl">
      <EquationTerm active={terms[0].active} delay={0}>
        {terms[0].content}
      </EquationTerm>
      <span className="text-slate-400">+</span>
      <EquationTerm active={terms[1].active} delay={70}>
        {terms[1].content}
      </EquationTerm>
      <span className="text-slate-400">→</span>
      <EquationTerm active={terms[2].active} delay={140}>
        {terms[2].content}
      </EquationTerm>
      <span className="text-slate-400">+</span>
      <EquationTerm active={terms[3].active} delay={210}>
        {terms[3].content}
      </EquationTerm>
    </div>
  );
}

function getHydrocarbonSmiles(typeKey, carbonCount) {
  if (carbonCount <= 1) {
    return "C";
  }

  const tail = "C".repeat(Math.max(carbonCount - 2, 0));

  if (typeKey === "alkene") {
    return `C=C${tail}`;
  }

  if (typeKey === "alkyne") {
    return `C#C${tail}`;
  }

  return "C".repeat(carbonCount);
}

function SmilesMolecule({ smiles, active = true, label, caption, delay = 0 }) {
  const svgRef = useRef(null);
  const [renderError, setRenderError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function renderMolecule() {
      if (!svgRef.current) {
        return;
      }

      try {
        await import("smiles-drawer/dist/smiles-drawer.min.js");
        const SmilesDrawer = window.SmilesDrawer;

        if (!SmilesDrawer) {
          throw new Error("SmilesDrawer 초기화 실패");
        }
        const drawer = new SmilesDrawer.SvgDrawer({
          width: 260,
          height: 140,
          bondThickness: 1.4,
          bondLength: 34,
          bondSpacing: 5,
          fontSizeLarge: 12,
          fontSizeSmall: 4,
          padding: 12,
          showCarbons: "all",
          explicitHydrogens: true,
          compactDrawing: false,
        });

        svgRef.current.innerHTML = "";
        SmilesDrawer.parse(
          smiles,
          (tree) => {
            if (isCancelled || !svgRef.current) {
              return;
            }

            drawer.draw(tree, svgRef.current, "light");
            setRenderError("");
          },
          (error) => {
            if (!isCancelled) {
              setRenderError(error.message ?? "SMILES 렌더링 실패");
            }
          }
        );
      } catch (error) {
        if (!isCancelled) {
          setRenderError(error.message ?? "SmilesDrawer 로드 실패");
        }
      }
    }

    renderMolecule();

    return () => {
      isCancelled = true;
    };
  }, [smiles]);

  return (
    <div
      className={`smiles-molecule-card ${
        active ? "smiles-molecule-card-active" : ""
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="smiles-molecule-header">
        <span>{label}</span>
        <strong>{caption}</strong>
      </div>
      <svg ref={svgRef} className="smiles-molecule-svg" role="img" />
      {renderError ? <p className="smiles-molecule-error">{renderError}</p> : null}
    </div>
  );
}

function MoleculeStage({ details, activeStep, tone, typeKey }) {
  const fuelSmiles = getHydrocarbonSmiles(typeKey, details.carbon);

  return (
    <div
      key={`${typeKey}-${details.carbon}-${details.hCount}`}
      className={`combustion-stage combustion-stage-${tone} combustion-stage-step-${activeStep}`}
    >
      <div className="reaction-flow-line" aria-hidden="true" />
      <div className="combustion-stage-grid">
        <div
          className={`reaction-zone fuel-zone ${
            activeStep >= 2 ? "reaction-zone-release" : ""
          }`}
        >
          <SmilesMolecule
            smiles={fuelSmiles}
            active
            label="Fuel molecule"
            caption={<ChemicalFormula carbon={details.carbon} hydrogen={details.hCount} />}
          />
        </div>

        <div
          className={`reaction-zone oxygen-zone ${
            activeStep >= 1 ? "reaction-zone-active" : ""
          }`}
        >
          <SmilesMolecule
            smiles="O=O"
            active={activeStep >= 1}
            label="Oxygen input"
            caption={
              <>
                {formatNumber(details.oxygen)} O<sub>2</sub>
              </>
            }
            delay={80}
          />
        </div>

        <div
          className={`reaction-zone product-zone ${
            activeStep >= 2 ? "reaction-zone-active" : ""
          }`}
        >
          <div className="smiles-product-grid">
            <SmilesMolecule
              smiles="O=C=O"
              active={activeStep >= 2}
              label="Carbon dioxide"
              caption={
                <>
                  {details.carbon} CO<sub>2</sub>
                </>
              }
              delay={120}
            />
            <SmilesMolecule
              smiles="[H]O[H]"
              active={activeStep >= 3}
              label="Water"
              caption={
                <>
                  {formatNumber(details.water)} H<sub>2</sub>O
                </>
              }
              delay={180}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const toneClasses = {
  teal: {
    active: "border-teal-500 bg-teal-50 text-teal-950 shadow-teal-100",
    badge: "bg-teal-600 text-white",
    soft: "bg-teal-50 text-teal-900",
  },
  amber: {
    active: "border-amber-500 bg-amber-50 text-amber-950 shadow-amber-100",
    badge: "bg-amber-500 text-slate-950",
    soft: "bg-amber-50 text-amber-950",
  },
  violet: {
    active: "border-violet-500 bg-violet-50 text-violet-950 shadow-violet-100",
    badge: "bg-violet-600 text-white",
    soft: "bg-violet-50 text-violet-950",
  },
};

export default function CombustionPage() {
  const scrollTrackRef = useRef(null);
  const [selectedTypeKey, setSelectedTypeKey] = useState("alkane");
  const [carbonCount, setCarbonCount] = useState(4);
  const [activeStep, setActiveStep] = useState(0);

  const selectedType = hydrocarbonTypes[selectedTypeKey];
  const details = useMemo(
    () => getHydrocarbonDetails(selectedType, carbonCount),
    [selectedType, carbonCount]
  );
  const moleculeName = getHydrocarbonName(selectedTypeKey, carbonCount);
  const carbonRangeProgress =
    ((carbonCount - selectedType.minCarbon) /
      Math.max(selectedType.maxCarbon - selectedType.minCarbon, 1)) *
    100;
  const steps = useMemo(
    () => [
      {
        label: "Fuel",
        title: "탄화수소 분자 선택",
        body: `${selectedType.className}은 ${selectedType.formulaRule} 규칙으로 수소 수를 계산합니다.`,
      },
      {
        label: "Oxygen",
        title: "필요한 산소량 계산",
        body: `완전 연소에는 ${formatNumber(details.oxygen)}개의 O2 계수가 필요합니다.`,
      },
      {
        label: "CO2",
        title: "탄소가 이산화 탄소로 이동",
        body: `탄소 ${details.carbon}개는 ${details.carbon}개의 CO2를 만듭니다.`,
      },
      {
        label: "H2O",
        title: "수소가 물로 이동",
        body: `수소 ${details.hCount}개는 ${formatNumber(details.water)}개의 H2O를 만듭니다.`,
      },
    ],
    [details, selectedType]
  );
  const tone = toneClasses[selectedType.accent];
  const progress = ((activeStep + 1) / steps.length) * 100;

  useEffect(() => {
    let frameId = null;

    function updateStepFromScroll() {
      frameId = null;

      if (window.innerWidth < 1024 || !scrollTrackRef.current) {
        return;
      }

      const trackTop = scrollTrackRef.current.offsetTop;
      const activationOffset =
        window.innerHeight * DESKTOP_SCROLL_ACTIVATION_RATIO;
      const stepDistance = window.innerHeight * DESKTOP_STEP_SCROLL_RATIO;
      const scrolledInsideTrack = Math.max(
        window.scrollY - trackTop + activationOffset,
        0
      );
      const nextStep = Math.min(
        steps.length - 1,
        Math.floor(scrolledInsideTrack / stepDistance)
      );

      setActiveStep((currentStep) =>
        currentStep === nextStep ? currentStep : nextStep
      );
    }

    function requestScrollUpdate() {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(updateStepFromScroll);
    }

    window.addEventListener("scroll", requestScrollUpdate, { passive: true });
    window.addEventListener("resize", requestScrollUpdate);
    requestScrollUpdate();

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("scroll", requestScrollUpdate);
      window.removeEventListener("resize", requestScrollUpdate);
    };
  }, [steps.length]);

  function scrollToStep(stepIndex) {
    const boundedStepIndex = Math.min(Math.max(stepIndex, 0), steps.length - 1);

    setActiveStep(boundedStepIndex);

    if (window.innerWidth < 1024 || !scrollTrackRef.current) {
      return;
    }

    const trackTop = scrollTrackRef.current.offsetTop;
    const activationOffset =
      window.innerHeight * DESKTOP_SCROLL_ACTIVATION_RATIO;
    const stepDistance = window.innerHeight * DESKTOP_STEP_SCROLL_RATIO;
    const settleOffset =
      boundedStepIndex === 0 ? 0 : stepDistance * DESKTOP_BUTTON_SETTLE_RATIO;
    const maxTargetTop =
      trackTop + scrollTrackRef.current.offsetHeight - window.innerHeight;
    const targetTop =
      trackTop +
      stepDistance * boundedStepIndex -
      activationOffset +
      settleOffset;

    window.scrollTo({
      top: Math.max(0, Math.min(targetTop, maxTargetTop)),
      behavior: "smooth",
    });
  }

  function handleTypeSelect(typeKey) {
    const nextType = hydrocarbonTypes[typeKey];
    setSelectedTypeKey(typeKey);
    setActiveStep(0);
    setCarbonCount((current) =>
      Math.min(Math.max(current, nextType.minCarbon), nextType.maxCarbon)
    );
  }

  function handleCarbonSelect(event) {
    updateCarbonCount(Number(event.target.value));
  }

  function updateCarbonCount(nextCarbonCount) {
    setCarbonCount(
      Math.min(
        Math.max(nextCarbonCount, selectedType.minCarbon),
        selectedType.maxCarbon
      )
    );
    setActiveStep(0);
  }

  function adjustCarbonCount(delta) {
    updateCarbonCount(carbonCount + delta);
  }

  function handleNextStep() {
    if (activeStep >= steps.length - 1) {
      return;
    }

    scrollToStep(activeStep + 1);
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_42%,#eef7f5_100%)] text-slate-950">
      <section className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <AppNavigation active="combustion" />

        <header className="border-b border-slate-200/80 pb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-700">
            Combustion View
          </p>
          <h1 className="mx-auto mt-4 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-normal text-slate-950 sm:text-6xl lg:text-7xl">
            Balanced Reaction Flow
          </h1>
          <p className="korean-keep mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600">
            선택한 concrete class의 공식이 바뀌면 같은 연소 메서드의 출력도
            즉시 달라집니다.
          </p>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            Scroll down to view
          </p>
        </header>

        <div
          ref={scrollTrackRef}
          className="combustion-scroll-track grid gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start"
        >
          <section className="combustion-sticky-panel">
            <div className="combustion-visual-card rounded-lg border border-slate-200 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span
                    className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${tone.badge}`}
                  >
                    {selectedType.className}
                  </span>
                  <h2 className="mt-4 text-5xl font-semibold tracking-normal text-slate-950 sm:text-6xl">
                    <ChemicalFormula
                      carbon={details.carbon}
                      hydrogen={details.hCount}
                    />
                  </h2>
                  <p className="korean-keep mt-3 max-w-2xl text-base leading-7 text-slate-600">
                    {selectedType.koreanName}의 완전 연소 계수를 단계별로
                    펼쳐 봅니다.
                  </p>
                </div>
                <div className="grid min-w-56 gap-2">
                  <div className={`rounded-lg px-4 py-3 ${tone.soft}`}>
                    <p className="text-xs font-bold uppercase tracking-[0.18em]">
                      Formula rule
                    </p>
                    <p className="mt-2 text-xl font-semibold">
                      <FormulaRule rule={selectedType.formulaRule} />
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Selected molecule
                    </p>
                    <p className="mt-2 text-base font-semibold">
                      <ChemicalFormula
                        carbon={details.carbon}
                        hydrogen={details.hCount}
                      />{" "}
                      - {moleculeName}
                    </p>
                  </div>
                </div>
              </div>

              <section
                className="combustion-summary-grid mt-5"
                aria-label="Combustion calculation summary"
              >
                {[
                  ["Molar mass", `${details.molarMass} g/mol`],
                  ["Oxygen", `${formatNumber(details.oxygen)} O2`],
                  ["Carbon dioxide", `${details.carbon} CO2`],
                  ["Water", `${formatNumber(details.water)} H2O`],
                ].map(([label, value]) => (
                  <div key={label} className="combustion-summary-card">
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </section>

              <div className="mt-6">
                <MoleculeStage
                  details={details}
                  activeStep={activeStep}
                  tone={selectedType.accent}
                  typeKey={selectedTypeKey}
                />
              </div>

              <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    get_combustion_reaction()
                  </p>
                  <span className="text-sm font-semibold text-slate-500">
                    Step {activeStep + 1} / {steps.length}
                  </span>
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-slate-950 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-5">
                  <ReactionEquation details={details} activeStep={activeStep} />
                </div>
              </div>
            </div>
          </section>

          <aside className="combustion-sticky-sidebar space-y-2">
            <section
              className={`combustion-control-card combustion-control-card-${selectedType.accent}`}
            >
              <div className="combustion-control-head">
                <div>
                  <p className="combustion-control-kicker">Controls</p>
                  <h2 className="mt-1 text-lg font-semibold tracking-normal text-slate-950">
                    Molecule Setup
                  </h2>
                </div>
                <span className="combustion-control-rule">
                  <FormulaRule rule={selectedType.formulaRule} />
                </span>
              </div>

              <div className="combustion-type-selector" role="tablist">
                {typeKeys.map((typeKey) => {
                  const type = hydrocarbonTypes[typeKey];
                  const isActive = typeKey === selectedTypeKey;

                  return (
                    <button
                      key={typeKey}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => handleTypeSelect(typeKey)}
                      className={`combustion-type-card combustion-type-card-${type.accent} ${
                        isActive ? "combustion-type-card-active" : ""
                      }`}
                    >
                      <span className="combustion-type-orb" />
                      <span className="block text-[0.68rem] font-semibold text-slate-500">
                        {type.koreanName}
                      </span>
                      <strong className="mt-0.5 block text-base font-semibold text-slate-950">
                        {type.className}
                      </strong>
                    </button>
                  );
                })}
              </div>

              <div className="combustion-carbon-panel">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-600">탄소 수</p>
                    <strong className="mt-0.5 block text-3xl font-semibold leading-none tracking-normal text-slate-950">
                      {carbonCount}
                    </strong>
                  </div>
                  <span className="combustion-carbon-formula">
                    <ChemicalFormula
                      carbon={details.carbon}
                      hydrogen={details.hCount}
                    />
                  </span>
                </div>

                <div className="combustion-carbon-stepper">
                  <button
                    type="button"
                    onClick={() => adjustCarbonCount(-1)}
                    disabled={carbonCount <= selectedType.minCarbon}
                    aria-label="Decrease carbon count"
                    className="combustion-carbon-button"
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min={selectedType.minCarbon}
                    max={selectedType.maxCarbon}
                    value={carbonCount}
                    onChange={handleCarbonSelect}
                    className="combustion-range"
                    style={{ "--range-progress": `${carbonRangeProgress}%` }}
                  />
                  <button
                    type="button"
                    onClick={() => adjustCarbonCount(1)}
                    disabled={carbonCount >= selectedType.maxCarbon}
                    aria-label="Increase carbon count"
                    className="combustion-carbon-button"
                  >
                    +
                  </button>
                </div>

                <span className="mt-2 flex justify-between text-xs font-semibold text-slate-400">
                  <span>{selectedType.minCarbon}</span>
                  <span>{selectedType.maxCarbon}</span>
                </span>
              </div>
            </section>

            <section className="rounded-lg border border-slate-800 bg-slate-950 p-3 text-white shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-300">
                    Reaction Steps
                  </p>
                  <h2 className="korean-keep mt-1.5 text-lg font-semibold">
                    {steps[activeStep].title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={activeStep >= steps.length - 1}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeStep >= steps.length - 1
                      ? "cursor-default bg-white/75 text-slate-500"
                      : "bg-white text-slate-950 hover:bg-teal-100"
                  }`}
                >
                  {activeStep >= steps.length - 1 ? "Done" : "Next"}
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {steps.map((step, index) => (
                  <button
                    key={step.label}
                    type="button"
                    onClick={() => scrollToStep(index)}
                    className={`group w-full rounded-lg border p-2.5 text-left transition duration-300 ${
                      index === activeStep
                        ? "border-teal-300 bg-white text-slate-950"
                        : "border-white/10 bg-white/[0.06] text-slate-300 hover:border-white/25"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`h-2.5 w-2.5 rounded-full transition ${
                          index <= activeStep ? "bg-teal-300" : "bg-white/25"
                        }`}
                      />
                      <span className="text-xs font-bold uppercase tracking-[0.16em]">
                        {step.label}
                      </span>
                    </span>
                    <strong className="korean-keep mt-1.5 block text-sm font-semibold">
                      {step.title}
                    </strong>
                    {index === activeStep ? (
                      <span className="korean-keep mt-2 block text-sm leading-6 opacity-80">
                        {step.body}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
