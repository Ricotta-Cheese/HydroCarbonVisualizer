"use client";

import { useMemo, useState } from "react";
import AppNavigation from "@/components/AppNavigation";
import {
  getClassFlow,
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
    <div className="class-flow" aria-label="Selected class inheritance flow">
      {flow.map((className, index) => (
        <span className="class-flow-step" key={`${className}-${index}`}>
          {index > 0 ? (
            <span className="class-flow-arrow" aria-hidden="true">
              →
            </span>
          ) : null}
          <code>{className}</code>
        </span>
      ))}
    </div>
  );
}

function ReagentBeaker({ result }) {
  const clipId = `beaker-liquid-${result.typeKey}-${result.reagent.replace(/\s/g, "-")}`;

  return (
    <div
      key={`${result.typeKey}-${result.reagent}`}
      className={`reagent-stage reagent-stage-${result.type.accent} reagent-phase-${result.phase}`}
      style={{
        "--reagent-initial": result.metadata.initialColor,
        "--reagent-final": result.finalColor,
        "--reagent-accent": result.metadata.accentColor,
      }}
    >
      <svg
        className="beaker-visual"
        viewBox="0 0 360 360"
        role="img"
        aria-label="Reagent color change visual"
      >
        <defs>
          <clipPath id={clipId}>
            <path d="M88 188 C126 199 234 199 272 188 L272 282 C272 304 254 318 232 318 L128 318 C106 318 88 304 88 282 Z" />
          </clipPath>
          <linearGradient id={`${clipId}-glass`} x1="64" y1="98" x2="296" y2="326">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.72" />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.28" />
            <stop offset="1" stopColor="#cbd5e1" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        <g className="beaker-svg-dropper" aria-hidden="true">
          <rect x="160" y="24" width="54" height="126" rx="27" />
          <path d="M163 144 L215 134 L219 156 L168 166 Z" />
          <rect x="187" y="158" width="16" height="38" rx="8" />
          <circle className="beaker-svg-drop" cx="197" cy="216" r="5.5" />
        </g>

        <g className="beaker-svg-vessel">
          <path
            className="beaker-svg-glass-fill"
            d="M70 112 L70 280 C70 309 94 332 124 332 L236 332 C266 332 290 309 290 280 L290 112"
          />
          <path
            className="beaker-svg-liquid"
            d="M88 188 C126 199 234 199 272 188 L272 282 C272 304 254 318 232 318 L128 318 C106 318 88 304 88 282 Z"
          />
          <ellipse className="beaker-svg-liquid-rim" cx="180" cy="188" rx="92" ry="10" />
          <g clipPath={`url(#${clipId})`}>
            <ellipse className="beaker-svg-liquid-shine" cx="180" cy="189" rx="88" ry="7" />
            <circle className="beaker-svg-precipitate beaker-svg-precipitate-1" cx="136" cy="300" r="6" />
            <circle className="beaker-svg-precipitate beaker-svg-precipitate-2" cx="181" cy="304" r="5.5" />
            <circle className="beaker-svg-precipitate beaker-svg-precipitate-3" cx="225" cy="298" r="6.5" />
          </g>
          <path
            className="beaker-svg-outline"
            d="M70 112 L70 280 C70 309 94 332 124 332 L236 332 C266 332 290 309 290 280 L290 112"
          />
          <path className="beaker-svg-rim-back" d="M88 112 H282" />
          <path className="beaker-svg-spout" d="M88 112 C75 108 68 102 70 95 C73 84 91 86 108 100" />
          <path className="beaker-svg-rim-front" d="M86 112 H284" />
          <path className="beaker-svg-base" d="M108 312 C134 322 226 322 252 312" />
          <path className="beaker-svg-highlight-left" d="M96 134 V274" />
          <path className="beaker-svg-highlight-right" d="M268 132 V260" />
          <g className="beaker-svg-measures">
            <path d="M238 166 H270" />
            <path d="M238 206 H270" />
            <path d="M238 246 H270" />
          </g>
        </g>
      </svg>
      <div className="reagent-stage-caption">
        <span>{result.initialLabel ?? result.metadata.initialLabel}</span>
        <strong>{result.finalLabel ?? result.metadata.finalLabel}</strong>
      </div>
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

function ReagentSelector({ selectedReagent, onSelect }) {
  return (
    <div className="reagent-selector" role="tablist" aria-label="Reagent selector">
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
            className={`reagent-tab ${isActive ? "reagent-tab-active" : ""}`}
            style={{ "--reagent-accent": metadata.accentColor }}
          >
            <span className="reagent-swatch" />
            <span>
              <strong>{reagent}</strong>
              <small>{metadata.englishName}</small>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function ReagentsPage() {
  const [selectedTypeKey, setSelectedTypeKey] = useState("alkene");
  const [selectedReagent, setSelectedReagent] = useState("브롬수");
  const result = useMemo(
    () => getReagentTestResult(selectedTypeKey, selectedReagent),
    [selectedTypeKey, selectedReagent]
  );
  const selectedType = hydrocarbonTypes[selectedTypeKey];
  const classFlow = getClassFlow(selectedTypeKey);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_44%,#f1f5f9_100%)] text-slate-950">
      <section className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <AppNavigation active="reagents" />

        <header className="border-b border-slate-200/80 pb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-700">
            Reagent Test
          </p>
          <h1 className="hero-title-one-line mx-auto mt-4">
            Polymorphism in a Beaker
          </h1>
          <p className="korean-keep mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600">
            같은 시약을 넣어도 선택된 concrete class의
            <code className="mx-1 rounded-full bg-slate-100 px-2 py-1 text-sm font-semibold text-slate-900">
              perform_test(reagent)
            </code>
            구현에 따라 관찰 결과가 달라집니다.
          </p>
        </header>

        <div className="grid gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_410px] lg:items-start">
          <section className="reagent-lab-surface">
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
                <h2 className="mt-4 text-4xl font-semibold tracking-normal text-slate-950 sm:text-5xl">
                  {selectedType.sampleName} + {selectedReagent}
                </h2>
                <p className="korean-keep mt-3 max-w-2xl text-base leading-7 text-slate-600">
                  {selectedType.role}. 이 화면은 원본 Python의 시약 반응
                  오버라이딩을 실험 흐름으로 재현합니다.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  Formula rule
                </p>
                <p className="mt-2 text-xl font-semibold">
                  <FormulaRule rule={selectedType.formulaRule} />
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)] xl:items-stretch">
              <div className="reagent-control-panel">
                <div>
                  <p className="reagent-panel-kicker">Hydrocarbon class</p>
                  <TypeSelector
                    selectedTypeKey={selectedTypeKey}
                    onSelect={setSelectedTypeKey}
                  />
                </div>

                <div className="mt-5">
                  <p className="reagent-panel-kicker">Reagent</p>
                  <ReagentSelector
                    selectedReagent={selectedReagent}
                    onSelect={setSelectedReagent}
                  />
                </div>
              </div>

              <ReagentBeaker result={result} />
            </div>
          </section>

          <aside className="reagent-result-panel">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-300">
                Method dispatch
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white">
                {result.status}
              </h2>
            </div>

            <div className="reagent-dark-card">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Current method call
              </p>
              <code className="mt-3 block rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-950">
                {result.methodCall}
              </code>
            </div>

            <div className="reagent-dark-card">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Execution result
              </p>
              <p className="korean-keep mt-3 text-2xl font-semibold leading-snug text-white">
                {result.result}
              </p>
              <p className="korean-keep mt-3 text-sm leading-6 text-slate-300">
                {result.observation}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="reagent-mini-metric">
                <span>Formula</span>
                <strong>
                  <ChemicalFormula
                    carbon={result.details.carbon}
                    hydrogen={result.details.hCount}
                  />
                </strong>
              </div>
              <div className="reagent-mini-metric">
                <span>Mass</span>
                <strong>{result.details.molarMass} g/mol</strong>
              </div>
            </div>

            <div className="reagent-dark-card">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Class flow
              </p>
              <ClassFlow flow={classFlow} />
              <p className="korean-keep mt-4 text-sm leading-6 text-teal-100">
                {result.oopConcept}
              </p>
            </div>

            <div className="reagent-dark-card">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Reagent analysis
              </p>
              <p className="korean-keep mt-3 text-sm leading-6 text-slate-300">
                {result.metadata.detects}
              </p>
              <p className="korean-keep mt-2 text-sm leading-6 text-slate-300">
                {result.metadata.observation}
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
