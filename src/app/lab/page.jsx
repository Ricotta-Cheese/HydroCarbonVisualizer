"use client";

import { useMemo, useState } from "react";
import AppNavigation from "@/components/AppNavigation";
import {
  formatNumber,
  getCarbonOptions,
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

function CombustionEquation({ details, type }) {
  return (
    <span className="equation">
      {type.reactionPrefix}{" "}
      <ChemicalFormula carbon={details.carbon} hydrogen={details.hCount} /> +{" "}
      {formatNumber(details.oxygen)} O<sub>2</sub> -&gt; {details.carbon} CO
      <sub>2</sub> + {formatNumber(details.water)} H<sub>2</sub>O
    </span>
  );
}

function getObservationSummary(reactionResult) {
  const initial = reactionResult.metadata.initialLabel;
  const final = reactionResult.finalLabel;

  return `${initial} → ${final}`;
}

function ControlSection({ children, step, title }) {
  return (
    <section className="lab-control-section">
      <div className="lab-control-heading">
        <span className="lab-step-index">{step}</span>
        <p className="lab-control-label">{title}</p>
      </div>
      {children}
    </section>
  );
}

function TypeSelector({ selectedTypeKey, onSelect }) {
  return (
    <div className="lab-type-selector" role="tablist" aria-label="탄화수소 종류">
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
            className={`lab-type-card lab-type-card-${type.accent} ${
              isActive ? "lab-type-card-active" : ""
            }`}
          >
            <span className="lab-type-rule">
              <FormulaRule rule={type.formulaRule} />
            </span>
            <span className="lab-type-name">{type.koreanName}</span>
            <strong>{type.className}</strong>
          </button>
        );
      })}
    </div>
  );
}

function CarbonControl({
  carbonCount,
  carbonOptions,
  carbonRangeProgress,
  onChange,
  selectedType,
}) {
  return (
    <>
      <div className="lab-carbon-readout">
        <div>
          <span>탄소 수</span>
          <strong>{carbonCount}</strong>
        </div>
        <em>
          <FormulaRule rule={selectedType.formulaRule} />
        </em>
      </div>

      <div className="combustion-carbon-stepper">
        <button
          type="button"
          onClick={() => onChange(carbonCount - 1)}
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
          onChange={(event) => onChange(Number(event.target.value))}
          className="combustion-range"
          style={{ "--range-progress": `${carbonRangeProgress}%` }}
          aria-label="Carbon count"
        />
        <button
          type="button"
          onClick={() => onChange(carbonCount + 1)}
          disabled={carbonCount >= selectedType.maxCarbon}
          aria-label="Increase carbon count"
          className="combustion-carbon-button"
        >
          +
        </button>
      </div>

      <div className="lab-carbon-pills" aria-label="빠른 탄소 수 선택">
        {carbonOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`lab-carbon-pill ${
              option === carbonCount ? "lab-carbon-pill-active" : ""
            }`}
            aria-pressed={option === carbonCount}
          >
            {option}
          </button>
        ))}
      </div>
    </>
  );
}

function ReagentButtons({ selectedReagent, onSelect }) {
  return (
    <div className="lab-reagent-grid" role="tablist" aria-label="시약">
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

function ReactionPreview({ details, reactionResult }) {
  const liquidKey = `${reactionResult.typeKey}-${reactionResult.reagent}-${details.carbon}`;

  return (
    <div
      className={`lab-preview reagent-phase-${reactionResult.phase}`}
      style={{
        "--reagent-initial": reactionResult.metadata.initialColor,
        "--reagent-final": reactionResult.finalColor,
        "--reagent-accent": reactionResult.metadata.accentColor,
      }}
    >
      <div className="lab-preview-chip">
        <span>분자</span>
        <strong>
          <ChemicalFormula carbon={details.carbon} hydrogen={details.hCount} />
        </strong>
      </div>

      <div
        className="lab-mini-beaker"
        aria-label={`${reactionResult.reagent} 관찰 결과: ${reactionResult.finalLabel}`}
      >
        <div className="lab-mini-liquid" key={liquidKey}>
          <span className="lab-liquid-layer lab-liquid-layer-initial" />
          <span className="lab-liquid-layer lab-liquid-layer-final" />
          <span className="lab-liquid-shine" />
          <span className="lab-precipitate-dot lab-precipitate-dot-1" />
          <span className="lab-precipitate-dot lab-precipitate-dot-2" />
          <span className="lab-precipitate-dot lab-precipitate-dot-3" />
        </div>
      </div>

      <div className="lab-preview-chip lab-preview-chip-result">
        <span>관찰</span>
        <strong>{reactionResult.finalLabel}</strong>
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
  const moleculeName = getHydrocarbonName(selectedTypeKey, carbonCount);
  const observationSummary = getObservationSummary(reactionResult);
  const carbonRangeProgress =
    ((carbonCount - selectedType.minCarbon) /
      Math.max(selectedType.maxCarbon - selectedType.minCarbon, 1)) *
    100;
  const outcomeLabel =
    reactionResult.tone === "reactive" ? "반응 관찰" : "변화 없음";

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
    <main className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_48%,#edf7f4_100%)] text-slate-950">
      <section className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <AppNavigation active="lab" />

        <header className="lab-hero">
          <div>
            <p className="lab-eyebrow">Reaction Lab</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
              반응 조합 실험실
            </h1>
            <p className="korean-keep mt-4 max-w-2xl text-base leading-7 text-slate-600">
              탄화수소 종류, 탄소 수, 시약을 조합해 분자 계산과 반응 결과를
              한 화면에서 비교합니다.
            </p>
          </div>

          <div className="lab-current-chip" aria-label="현재 선택">
            <span>현재 조합</span>
            <strong>
              {selectedType.className} ·{" "}
              <ChemicalFormula carbon={details.carbon} hydrogen={details.hCount} />
            </strong>
            <small>{selectedReagent}</small>
          </div>
        </header>

        <div className="grid gap-6 py-8 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start">
          <aside className="lab-control-stack" aria-label="실험 조건">
            <ControlSection step="1" title="탄화수소">
              <TypeSelector
                selectedTypeKey={selectedTypeKey}
                onSelect={handleTypeSelect}
              />
            </ControlSection>

            <ControlSection step="2" title="탄소 수">
              <CarbonControl
                carbonCount={carbonCount}
                carbonOptions={carbonOptions}
                carbonRangeProgress={carbonRangeProgress}
                onChange={updateCarbonCount}
                selectedType={selectedType}
              />
            </ControlSection>

            <ControlSection step="3" title="시약">
              <ReagentButtons
                selectedReagent={selectedReagent}
                onSelect={setSelectedReagent}
              />
            </ControlSection>
          </aside>

          <section className="lab-output-surface" aria-live="polite">
            <section
              className={`lab-primary-result lab-primary-result-${selectedType.accent} reagent-phase-${reactionResult.phase}`}
              style={{
                "--reagent-initial": reactionResult.metadata.initialColor,
                "--reagent-final": reactionResult.finalColor,
                "--reagent-accent": reactionResult.metadata.accentColor,
              }}
            >
              <div className="lab-primary-copy">
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`lab-type-badge lab-type-badge-${selectedType.accent}`}
                  >
                    {selectedType.className}
                  </span>
                  <span
                    className={`lab-outcome-badge lab-outcome-badge-${reactionResult.tone}`}
                  >
                    {outcomeLabel}
                  </span>
                </div>

                <h2 className="mt-5 text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
                  <ChemicalFormula
                    carbon={details.carbon}
                    hydrogen={details.hCount}
                  />
                </h2>
                <p className="korean-keep mt-2 text-base font-semibold text-slate-600">
                  {moleculeName} + {selectedReagent}
                </p>
                <p className="korean-keep mt-6 text-2xl font-semibold leading-snug text-slate-950">
                  {observationSummary}
                </p>
                <p className="lab-comment korean-keep">
                  {reactionResult.labComment}
                </p>
              </div>

              <ReactionPreview details={details} reactionResult={reactionResult} />
            </section>

            <section className="lab-compact-summary mt-4">
              <div className="lab-compact-summary-heading">
                <span>계산 요약</span>
                <strong>{moleculeName}</strong>
              </div>

              <div className="lab-compact-metrics">
                <div>
                  <span>분자량</span>
                  <strong>{details.molarMass} g/mol</strong>
                </div>
                <div>
                  <span>필요 산소</span>
                  <strong>
                    {formatNumber(details.oxygen)} O<sub>2</sub>
                  </strong>
                </div>
                <div>
                  <span>생성물</span>
                  <strong>
                    {details.carbon} CO<sub>2</sub> +{" "}
                    {formatNumber(details.water)} H<sub>2</sub>O
                  </strong>
                </div>
              </div>

              <details className="lab-equation-details">
                <summary>연소식 보기</summary>
                <p>
                  <CombustionEquation details={details} type={selectedType} />
                </p>
              </details>
            </section>
          </section>
        </div>
      </section>
    </main>
  );
}
