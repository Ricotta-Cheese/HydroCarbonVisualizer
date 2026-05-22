"use client";

import { useMemo, useState } from "react";
import AppNavigation from "@/components/AppNavigation";
import {
  formatNumber,
  getCarbonOptions,
  getClassFlow,
  getCombustionReaction,
  getHydrocarbonDetails,
  getHydrocarbonName,
  getReagentTestResult,
  hydrocarbonTypes,
  reagentMetadata,
  reagents,
  typeKeys,
} from "@/lib/hydrocarbons";

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

function ClassFlow({ flow }) {
  return (
    <div className="class-flow class-flow-light">
      {flow.map((className, index) => (
        <span className="class-flow-step" key={className}>
          <code>{className}</code>
          {index < flow.length - 1 ? (
            <span className="class-flow-arrow" aria-hidden="true">
              →
            </span>
          ) : null}
        </span>
      ))}
    </div>
  );
}

function TypeSelector({ selectedTypeKey, onSelect }) {
  return (
    <div className="combustion-type-selector" role="tablist">
      {typeKeys.map((typeKey) => {
        const type = hydrocarbonTypes[typeKey];
        const isActive = selectedTypeKey === typeKey;

        return (
          <button
            key={typeKey}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(typeKey)}
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
  );
}

function ReagentButtons({ selectedReagent, onSelect }) {
  return (
    <div className="lab-reagent-grid" role="tablist" aria-label="Lab reagent">
      {reagents.map((reagent) => {
        const metadata = reagentMetadata[reagent];
        const isActive = selectedReagent === reagent;

        return (
          <button
            key={reagent}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(reagent)}
            className={`lab-reagent-button ${
              isActive ? "lab-reagent-button-active" : ""
            }`}
            style={{ "--reagent-accent": metadata.accentColor }}
          >
            <span className="lab-reagent-dot" />
            <span>{reagent}</span>
          </button>
        );
      })}
    </div>
  );
}

function LabSummaryMetric({ label, children }) {
  return (
    <div className="lab-summary-metric">
      <span>{label}</span>
      <strong>{children}</strong>
    </div>
  );
}

function ReactionPreview({ details, reactionResult, selectedType }) {
  return (
    <div
      className={`lab-preview lab-preview-${selectedType.accent} reagent-phase-${reactionResult.phase}`}
      style={{
        "--reagent-initial": reactionResult.metadata.initialColor,
        "--reagent-final": reactionResult.finalColor,
        "--reagent-accent": reactionResult.metadata.accentColor,
      }}
    >
      <div className="lab-molecule-chip lab-molecule-chip-fuel">
        <span>Hydrocarbon</span>
        <strong>
          <ChemicalFormula carbon={details.carbon} hydrogen={details.hCount} />
        </strong>
      </div>
      <div className="lab-preview-arrow" aria-hidden="true">
        →
      </div>
      <div className="lab-mini-beaker" aria-label="Selected reagent result">
        <div className="lab-mini-liquid">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="lab-preview-arrow" aria-hidden="true">
        →
      </div>
      <div className="lab-molecule-chip lab-molecule-chip-result">
        <span>Observed</span>
        <strong>{reactionResult.status}</strong>
      </div>
    </div>
  );
}

export default function LabPage() {
  const [selectedTypeKey, setSelectedTypeKey] = useState("alkane");
  const [carbonCount, setCarbonCount] = useState(4);
  const [selectedReagent, setSelectedReagent] = useState("과망가니즈산 칼륨");

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
  const combustionReaction = getCombustionReaction(selectedType, carbonCount);
  const classFlow = getClassFlow(selectedTypeKey);
  const moleculeName = getHydrocarbonName(selectedTypeKey, carbonCount);
  const carbonRangeProgress =
    ((carbonCount - selectedType.minCarbon) /
      Math.max(selectedType.maxCarbon - selectedType.minCarbon, 1)) *
    100;

  function handleTypeSelect(typeKey) {
    const nextType = hydrocarbonTypes[typeKey];
    setSelectedTypeKey(typeKey);
    setCarbonCount((current) =>
      Math.min(Math.max(current, nextType.minCarbon), nextType.maxCarbon)
    );
  }

  function updateCarbonCount(nextCarbonCount) {
    setCarbonCount(
      Math.min(
        Math.max(nextCarbonCount, selectedType.minCarbon),
        selectedType.maxCarbon
      )
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_40%,#eef2ff_100%)] text-slate-950">
      <section className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <AppNavigation active="lab" />

        <header className="border-b border-slate-200/80 pb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-violet-700">
            Reaction Lab
          </p>
          <h1 className="hero-title-one-line mx-auto mt-4">
            One Object, Two Behaviors
          </h1>
          <p className="korean-keep mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600">
            탄화수소 객체 하나를 선택하면 공통 계산은 부모 클래스에서,
            연소식과 시약 반응은 하위 클래스의 오버라이딩으로 완성됩니다.
          </p>
        </header>

        <div className="grid gap-6 py-8 lg:grid-cols-[390px_minmax(0,1fr)] lg:items-start">
          <aside className="lab-control-stack">
            <section className="lab-control-section">
              <p className="reagent-panel-kicker">Class type</p>
              <TypeSelector
                selectedTypeKey={selectedTypeKey}
                onSelect={handleTypeSelect}
              />
            </section>

            <section className="lab-control-section">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="reagent-panel-kicker">Carbon count</p>
                  <strong className="mt-2 block text-4xl font-semibold leading-none tracking-normal">
                    {carbonCount}
                  </strong>
                </div>
                <span className="combustion-control-rule">
                  <FormulaRule rule={selectedType.formulaRule} />
                </span>
              </div>

              <div className="combustion-carbon-stepper mt-5">
                <button
                  type="button"
                  onClick={() => updateCarbonCount(carbonCount - 1)}
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
                  onChange={(event) => updateCarbonCount(Number(event.target.value))}
                  className="combustion-range"
                  style={{ "--range-progress": `${carbonRangeProgress}%` }}
                />
                <button
                  type="button"
                  onClick={() => updateCarbonCount(carbonCount + 1)}
                  disabled={carbonCount >= selectedType.maxCarbon}
                  aria-label="Increase carbon count"
                  className="combustion-carbon-button"
                >
                  +
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {carbonOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => updateCarbonCount(option)}
                    className={`lab-carbon-pill ${
                      option === carbonCount ? "lab-carbon-pill-active" : ""
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </section>

            <section className="lab-control-section">
              <p className="reagent-panel-kicker">Reagent</p>
              <ReagentButtons
                selectedReagent={selectedReagent}
                onSelect={setSelectedReagent}
              />
            </section>
          </aside>

          <section className="lab-output-surface">
            <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 md:flex-row md:items-start md:justify-between">
              <div>
                <span
                  className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                    selectedType.accent === "amber"
                      ? "bg-amber-100 text-amber-950"
                      : selectedType.accent === "violet"
                        ? "bg-violet-100 text-violet-950"
                        : "bg-teal-100 text-teal-950"
                  }`}
                >
                  {selectedType.className}
                </span>
                <h2 className="mt-4 text-5xl font-semibold tracking-normal text-slate-950 sm:text-6xl">
                  <ChemicalFormula
                    carbon={details.carbon}
                    hydrogen={details.hCount}
                  />
                </h2>
                <p className="korean-keep mt-3 text-base leading-7 text-slate-600">
                  {moleculeName}은 {selectedType.role}입니다.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  Selected reagent
                </p>
                <p className="korean-keep mt-2 text-base font-semibold">
                  {selectedReagent}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <ReactionPreview
                details={details}
                reactionResult={reactionResult}
                selectedType={selectedType}
              />
            </div>

            <section className="lab-summary-grid mt-6">
              <LabSummaryMetric label="Molecule">
                {moleculeName}
              </LabSummaryMetric>
              <LabSummaryMetric label="Molar mass">
                {details.molarMass} g/mol
              </LabSummaryMetric>
              <LabSummaryMetric label="Oxygen">
                {formatNumber(details.oxygen)} O<sub>2</sub>
              </LabSummaryMetric>
              <LabSummaryMetric label="Products">
                {details.carbon} CO<sub>2</sub> + {formatNumber(details.water)} H
                <sub>2</sub>O
              </LabSummaryMetric>
            </section>

            <div className="mt-6 grid gap-4 xl:grid-cols-2">
              <section className="lab-result-card lab-result-card-dark">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-300">
                  get_combustion_reaction()
                </p>
                <p className="mt-4 font-mono text-sm leading-7 text-white sm:text-base">
                  {combustionReaction}
                </p>
              </section>

              <section className="lab-result-card">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  perform_test(reagent)
                </p>
                <code className="mt-4 block rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white">
                  {reactionResult.methodCall}
                </code>
                <p className="korean-keep mt-4 text-2xl font-semibold leading-snug text-slate-950">
                  {reactionResult.result}
                </p>
                <p className="korean-keep mt-3 text-sm leading-6 text-slate-600">
                  {reactionResult.observation}
                </p>
              </section>
            </div>

            <section className="lab-result-card mt-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    Selected class flow
                  </p>
                  <ClassFlow flow={classFlow} />
                </div>
                <p className="korean-keep max-w-xl text-sm leading-6 text-slate-600">
                  부모 클래스의 공통 계산을 상속하고, 하위 클래스가 반응
                  메서드를 재정의해 다형성을 보여줍니다.
                </p>
              </div>
            </section>
          </section>
        </div>
      </section>
    </main>
  );
}
