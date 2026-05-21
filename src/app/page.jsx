"use client";

import { useMemo, useState } from "react";

const reagents = ["브롬수", "과망가니즈산 칼륨", "암모니아성 질산은"];

const hydrocarbonTypes = {
  alkane: {
    className: "Alkane",
    koreanName: "알케인",
    sampleName: "뷰테인",
    cCount: 4,
    formulaRule: "CnH2n+2",
    accent: "teal",
    role: "단일 결합으로 이루어진 포화 탄화수소",
    reactionPrefix: "[알케인 연소]",
    hydrogenCount: (carbon) => 2 * carbon + 2,
    reagentResult: (reagent) => {
      if (reagent === "브롬수" || reagent === "과망가니즈산 칼륨") {
        return "반응하지 않음";
      }
      if (reagent === "암모니아성 질산은") {
        return "아무런 변화가 없음";
      }
      return "반응 데이터 없음";
    },
  },
  alkene: {
    className: "Alkene",
    koreanName: "알켄",
    sampleName: "뷰텐",
    cCount: 4,
    formulaRule: "CnH2n",
    accent: "amber",
    role: "이중 결합을 가진 불포화 탄화수소",
    reactionPrefix: "[알켄 연소]",
    hydrogenCount: (carbon) => 2 * carbon,
    reagentResult: (reagent) => {
      if (reagent === "브롬수") {
        return "적갈색 브롬수가 무색으로 탈색됨";
      }
      if (reagent === "과망가니즈산 칼륨") {
        return "보라색 용액이 사라지고 갈색 침전이 생김";
      }
      return "반응하지 않음";
    },
  },
  alkyne: {
    className: "Alkyne",
    koreanName: "알카인",
    sampleName: "뷰타인",
    cCount: 4,
    formulaRule: "CnH2n-2",
    accent: "violet",
    role: "삼중 결합을 가진 불포화 탄화수소",
    reactionPrefix: "[알카인 연소]",
    hydrogenCount: (carbon) => 2 * carbon - 2,
    reagentResult: (reagent) => {
      if (reagent === "암모니아성 질산은") {
        return "흰색 침전물 생성됨";
      }
      if (reagent === "브롬수" || reagent === "과망가니즈산 칼륨") {
        return "빠르게 반응하여 색이 변화함";
      }
      return "반응함";
    },
  },
};

const typeKeys = Object.keys(hydrocarbonTypes);

function formatNumber(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function getHydrocarbonDetails(type) {
  const hCount = type.hydrogenCount(type.cCount);
  const formula = `C${type.cCount}H${hCount}`;
  const molarMass = type.cCount * 12 + hCount;
  const oxygen = type.cCount + hCount / 4;
  const water = hCount / 2;

  return {
    formula,
    molarMass,
    combustionReaction: `${type.reactionPrefix} ${formula} + ${formatNumber(
      oxygen
    )} O₂ → ${type.cCount} CO₂ + ${formatNumber(water)} H₂O`,
    reagentResults: reagents.map((reagent) => ({
      reagent,
      result: type.reagentResult(reagent),
    })),
  };
}

function ClassNode({ children, description, active, onClick, tone = "neutral" }) {
  const toneClasses = {
    neutral: "border-slate-200 bg-white text-slate-950",
    teal: "border-teal-300 bg-teal-50 text-teal-950 shadow-teal-100",
    amber: "border-amber-300 bg-amber-50 text-amber-950 shadow-amber-100",
    violet: "border-violet-300 bg-violet-50 text-violet-950 shadow-violet-100",
  };

  const content = (
    <>
      <span className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
        {description}
      </span>
      <strong className="mt-2 block text-2xl font-semibold tracking-normal">
        {children}
      </strong>
    </>
  );

  if (!onClick) {
    return (
      <div className="class-node border-slate-200 bg-white text-slate-950">
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`class-node cursor-pointer transition duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-slate-200 ${
        active ? toneClasses[tone] : "border-slate-200 bg-white text-slate-950"
      }`}
      aria-pressed={active}
    >
      {content}
      <span className="mt-5 inline-flex rounded-full border border-current px-3 py-1 text-xs font-semibold">
        Click to override
      </span>
    </button>
  );
}

export default function Home() {
  const [selectedKey, setSelectedKey] = useState("alkane");
  const selectedType = hydrocarbonTypes[selectedKey];
  const selectedDetails = useMemo(
    () => getHydrocarbonDetails(selectedType),
    [selectedType]
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#eefcf9,transparent_34%),linear-gradient(180deg,#ffffff_0%,#f7f8fb_100%)] text-slate-950">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-8 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-4 border-b border-slate-200/80 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-700">
              OOP Assignment 2
            </p>
            <h1 className="mt-4 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-normal text-slate-950 sm:text-6xl lg:text-7xl">
              Hydrocarbon Class Map
            </h1>
          </div>
          <p className="korean-keep max-w-md text-base leading-7 text-slate-600">
            Python OOP 구조를 웹에서 클릭 가능한 상속 지도로 옮기고,
            동일한 메서드 호출이 클래스마다 다르게 동작하는 모습을 보여줍니다.
          </p>
        </header>

        <div className="grid flex-1 gap-6 py-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
          <section className="rounded-[2rem] border border-slate-200 bg-white/80 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-7">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Inheritance Structure
                </p>
                <h2 className="korean-keep mt-2 text-2xl font-semibold text-slate-950">
                  ADT에서 Concrete Class까지
                </h2>
              </div>
              <span className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                Polymorphism Ready
              </span>
            </div>

            <div className="class-map">
              <ClassNode description="abstract data type">
                HydrocarbonADT
              </ClassNode>
              <div className="map-line" aria-hidden="true" />
              <ClassNode description="base class">Hydrocarbon</ClassNode>
              <div className="map-line map-line-short" aria-hidden="true" />
              <div className="grid gap-4 md:grid-cols-3">
                {typeKeys.map((key) => {
                  const type = hydrocarbonTypes[key];
                  return (
                    <ClassNode
                      key={key}
                      description={type.formulaRule}
                      tone={type.accent}
                      active={selectedKey === key}
                      onClick={() => setSelectedKey(key)}
                    >
                      {type.className}
                    </ClassNode>
                  );
                })}
              </div>
            </div>
          </section>

          <aside className="result-panel rounded-[2rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] sm:p-7">
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-300">
                  Selected Class
                </p>
                <h2 className="mt-3 text-4xl font-semibold tracking-normal">
                  {selectedType.className}
                </h2>
                <p className="korean-keep mt-3 text-base leading-7 text-slate-300">
                  {selectedType.koreanName}은 {selectedType.role}입니다.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="metric-card">
                  <span>sample</span>
                  <strong>{selectedType.sampleName}</strong>
                </div>
                <div className="metric-card">
                  <span>formula</span>
                  <strong>{selectedDetails.formula}</strong>
                </div>
                <div className="metric-card">
                  <span>mass</span>
                  <strong>{selectedDetails.molarMass}g/mol</strong>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                    method call
                  </p>
                  <code className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-950">
                    get_combustion_reaction()
                  </code>
                </div>
                <p className="mt-5 rounded-2xl bg-black/25 p-4 font-mono text-sm leading-7 text-teal-100 lg:text-base">
                  {selectedDetails.combustionReaction}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                    overridden behavior
                  </p>
                  <code className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-950">
                    perform_test(reagent)
                  </code>
                </div>
                <div className="mt-5 space-y-3">
                  {selectedDetails.reagentResults.map(({ reagent, result }) => (
                    <div
                      key={reagent}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4"
                    >
                      <p className="text-sm font-semibold text-slate-400">
                        {selectedType.sampleName} + {reagent}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-white">
                        {result}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
