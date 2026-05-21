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

const structuralClasses = {
  adt: {
    className: "HydrocarbonADT",
    role: "탄화수소 객체가 반드시 가져야 할 공통 규격을 정의하는 추상 클래스",
    accent: "slate",
    metrics: [
      { label: "type", value: "ABC" },
      { label: "fields", value: "없음" },
      { label: "contract", value: "5 rules" },
    ],
    fields: [
      {
        name: "없음",
        description: "저장 데이터 없이 하위 클래스가 지켜야 할 인터페이스만 선언합니다.",
      },
    ],
    methods: [
      { name: "formula", description: "분자식을 반환해야 하는 추상 프로퍼티" },
      { name: "molar_mass", description: "분자량을 반환해야 하는 추상 프로퍼티" },
      { name: "display_info()", description: "분자 정보를 출력하는 추상 메서드" },
      {
        name: "get_combustion_reaction()",
        description: "연소 반응식을 반환하는 추상 메서드",
      },
      {
        name: "perform_test(reagent)",
        description: "시약 반응 결과를 처리하는 추상 메서드",
      },
    ],
    designNote:
      "ADT는 직접 실행되는 클래스가 아니라, Base Class와 하위 클래스가 반드시 구현해야 하는 약속을 만드는 설계 계층입니다.",
  },
  base: {
    className: "Hydrocarbon",
    role: "추상 규격을 실제 계산 로직과 private field로 구현하는 Base Class",
    accent: "slate",
    metrics: [
      { label: "extends", value: "ADT" },
      { label: "fields", value: "3" },
      { label: "logic", value: "shared" },
    ],
    fields: [
      { name: "__name", description: "탄화수소 이름을 보호하는 private field" },
      { name: "__c_count", description: "탄소 수를 보호하는 private field" },
      { name: "__h_count", description: "수소 수를 보호하는 private field" },
    ],
    methods: [
      { name: "formula", description: "C/H 원자 수를 이용해 분자식을 계산" },
      { name: "molar_mass", description: "탄소 12, 수소 1 기준으로 분자량 계산" },
      { name: "display_info()", description: "이름, 화학식, 분자량 출력" },
      {
        name: "get_combustion_reaction()",
        description: "공통 연소 반응식 계산",
      },
      {
        name: "perform_test(reagent)",
        description: "기본값으로 반응 없음 출력",
      },
    ],
    designNote:
      "Base Class는 공통 데이터와 계산을 한곳에 모으고, Alkane/Alkene/Alkyne이 필요한 부분만 재정의하도록 받쳐줍니다.",
  },
};

const typeKeys = Object.keys(hydrocarbonTypes);

function formatNumber(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
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

function ChemicalFormula({ carbon, hydrogen }) {
  return (
    <span className="formula">
      C<sub>{carbon}</sub>H<sub>{hydrogen}</sub>
    </span>
  );
}

function CombustionEquation({ type, details }) {
  return (
    <span className="equation">
      {type.reactionPrefix}{" "}
      <ChemicalFormula carbon={type.cCount} hydrogen={details.hCount} /> +{" "}
      {formatNumber(details.oxygen)} O<sub>2</sub> → {type.cCount} CO
      <sub>2</sub> + {formatNumber(details.water)} H<sub>2</sub>O
    </span>
  );
}

function getHydrocarbonDetails(type) {
  const hCount = type.hydrogenCount(type.cCount);
  const molarMass = type.cCount * 12 + hCount;
  const oxygen = type.cCount + hCount / 4;
  const water = hCount / 2;

  return {
    hCount,
    oxygen,
    water,
    molarMass,
    reagentResults: reagents.map((reagent) => ({
      reagent,
      result: type.reagentResult(reagent),
    })),
  };
}

function getConcreteDescription(type) {
  const details = getHydrocarbonDetails(type);

  return {
    className: type.className,
    role: `${type.koreanName}은 ${type.role}입니다.`,
    accent: type.accent,
    metrics: [
      { label: "sample", value: type.sampleName },
      {
        label: "formula",
        value: <ChemicalFormula carbon={type.cCount} hydrogen={details.hCount} />,
      },
      { label: "mass", value: `${details.molarMass}g/mol` },
    ],
    fields: [
      { name: "__name", description: "Hydrocarbon에서 상속받은 이름 field" },
      { name: "__c_count", description: "Hydrocarbon에서 상속받은 탄소 수 field" },
      { name: "__h_count", description: "Hydrocarbon에서 상속받은 수소 수 field" },
    ],
    methods: [
      {
        name: "__init__()",
        description: (
          <>
            <FormulaRule rule={type.formulaRule} /> 규칙에 맞춰 수소 수 설정
          </>
        ),
      },
      {
        name: "get_combustion_reaction()",
        description: "부모의 공통 연소식을 재사용한 뒤 클래스 이름을 붙여 오버라이드",
      },
      {
        name: "perform_test(reagent)",
        description: "시약별 반응 결과를 클래스 특성에 맞게 오버라이드",
      },
    ],
    designNote:
      "같은 메서드를 호출해도 선택된 concrete class에 따라 서로 다른 출력이 만들어지는 지점입니다.",
    methodCall: {
      name: "get_combustion_reaction()",
      result: <CombustionEquation type={type} details={details} />,
    },
    reagentResults: details.reagentResults.map(({ reagent, result }) => ({
      reagent,
      result,
      sampleName: type.sampleName,
    })),
  };
}

function getDescriptionData(selectedKey) {
  if (structuralClasses[selectedKey]) {
    return structuralClasses[selectedKey];
  }

  return getConcreteDescription(hydrocarbonTypes[selectedKey]);
}

function ClassNode({
  children,
  description,
  fields = [],
  methods = [],
  active,
  onClick,
  tone = "neutral",
  actionLabel = "Click to inspect",
}) {
  const toneClasses = {
    neutral: "border-slate-200 bg-white text-slate-950",
    slate: "border-slate-400 bg-slate-100 text-slate-950 shadow-slate-100",
    teal: "border-teal-300 bg-teal-50 text-teal-950 shadow-teal-100",
    amber: "border-amber-300 bg-amber-50 text-amber-950 shadow-amber-100",
    violet: "border-violet-300 bg-violet-50 text-violet-950 shadow-violet-100",
  };

  const content = (
    <>
      <div className="uml-section uml-heading">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {description}
        </span>
        <strong className="mt-2 block text-2xl font-semibold tracking-normal">
          {children}
        </strong>
      </div>
      <div className="uml-section">
        <span className="uml-label">Fields</span>
        <div className="mt-2 space-y-1.5">
          {fields.map((field) => (
            <div className="uml-line" key={field}>
              <code>{field}</code>
            </div>
          ))}
        </div>
      </div>
      <div className="uml-section">
        <span className="uml-label">Methods</span>
        <div className="mt-2 space-y-1.5">
          {methods.map((method) => (
            <div className="uml-line" key={method}>
              <code>{method}</code>
            </div>
          ))}
        </div>
      </div>
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
      <div className="uml-action">
        <span className="inline-flex rounded-full border border-current px-3 py-1 text-xs font-semibold">
          {actionLabel}
        </span>
      </div>
    </button>
  );
}

function DescriptionPanel({ selectedDescription, onClose }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-300">
            Class Description
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-normal">
            {selectedDescription.className}
          </h2>
          <p className="korean-keep mt-3 text-base leading-7 text-slate-300">
            {selectedDescription.role}
          </p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="mobile-close-button"
            aria-label="Close class description"
          >
            X
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {selectedDescription.metrics.map(({ label, value }) => (
          <div className="metric-card" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
          fields
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {selectedDescription.fields.map((field) => (
            <div
              key={field.name}
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
            >
              <code className="text-sm font-semibold text-slate-100">
                {field.name}
              </code>
              <p className="korean-keep mt-2 text-sm leading-6 text-slate-400">
                {field.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
          methods & properties
        </p>
        <div className="mt-4 space-y-3">
          {selectedDescription.methods.map((method) => (
            <div
              key={method.name}
              className="rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <code className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-950">
                {method.name}
              </code>
              <p className="korean-keep mt-3 text-sm leading-6 text-slate-300">
                {method.description}
              </p>
            </div>
          ))}
        </div>
        <p className="korean-keep mt-4 rounded-2xl bg-black/25 p-4 text-sm leading-7 text-teal-100">
          {selectedDescription.designNote}
        </p>
      </div>

      {selectedDescription.methodCall ? (
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
              method call
            </p>
            <code className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-950">
              {selectedDescription.methodCall.name}
            </code>
          </div>
          <p className="mt-5 rounded-2xl bg-black/25 p-4 font-mono text-sm leading-7 text-teal-100 lg:text-base">
            {selectedDescription.methodCall.result}
          </p>
        </div>
      ) : null}

      {selectedDescription.reagentResults ? (
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
            {selectedDescription.reagentResults.map(
              ({ reagent, result, sampleName }) => (
                <div
                  key={reagent}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <p className="text-sm font-semibold text-slate-400">
                    {sampleName} + {reagent}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {result}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function Home() {
  const [selectedKey, setSelectedKey] = useState("alkane");
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const selectedDescription = useMemo(
    () => getDescriptionData(selectedKey),
    [selectedKey]
  );

  function handleClassSelect(key) {
    setSelectedKey(key);
    setIsDescriptionOpen(true);
  }

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

        <div className="grid flex-1 gap-6 py-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(400px,0.92fr)] lg:items-stretch">
          <section className="rounded-[2rem] border border-slate-200 bg-white/80 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-7">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  UML Diagram
                </p>
                <h2 className="korean-keep mt-2 text-2xl font-semibold text-slate-950">
                  OOP Class Diagram
                </h2>
              </div>
              <span className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                Interactive OOP Map
              </span>
            </div>

            <div className="class-map">
              <ClassNode
                description="«abstract» interface"
                fields={["- fields: none"]}
                methods={[
                  "+ formula: property",
                  "+ molar_mass: property",
                  "+ display_info()",
                  "+ combustion_reaction()",
                  "+ perform_test()",
                ]}
                tone="slate"
                active={selectedKey === "adt"}
                onClick={() => handleClassSelect("adt")}
              >
                HydrocarbonADT
              </ClassNode>
              <div className="map-line" aria-hidden="true" />
              <ClassNode
                description="base class"
                fields={["- __name: str", "- __c_count: int", "- __h_count: int"]}
                methods={[
                  "+ formula: property",
                  "+ molar_mass: property",
                  "+ display_info()",
                  "+ combustion_reaction()",
                  "+ perform_test()",
                ]}
                tone="slate"
                active={selectedKey === "base"}
                onClick={() => handleClassSelect("base")}
              >
                Hydrocarbon
              </ClassNode>
              <div className="uml-branch" aria-hidden="true">
                <span className="uml-branch-arrow" />
                <span className="uml-branch-drop uml-branch-drop-left" />
                <span className="uml-branch-drop uml-branch-drop-center" />
                <span className="uml-branch-drop uml-branch-drop-right" />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {typeKeys.map((key) => {
                  const type = hydrocarbonTypes[key];
                  return (
                    <ClassNode
                      key={key}
                      description={
                        <>
                          concrete class · <FormulaRule rule={type.formulaRule} />
                        </>
                      }
                      fields={["inherited fields"]}
                      methods={[
                        "+ __init__()",
                        "+ combustion_reaction()",
                        "+ perform_test()",
                      ]}
                      tone={type.accent}
                      active={selectedKey === key}
                      onClick={() => handleClassSelect(key)}
                    >
                      {type.className}
                    </ClassNode>
                  );
                })}
              </div>
            </div>
          </section>

          <aside className="result-panel hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] sm:p-7 lg:block">
            <DescriptionPanel
              selectedDescription={selectedDescription}
            />
          </aside>
        </div>
      </section>

      {isDescriptionOpen ? (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950 text-white lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-class-description-title"
        >
          <div className="min-h-screen p-5">
            <section
              id="mobile-class-description-title"
              className="mx-auto max-w-xl"
            >
              <DescriptionPanel
                selectedDescription={selectedDescription}
                onClose={() => setIsDescriptionOpen(false)}
              />
            </section>
          </div>
        </div>
      ) : null}
    </main>
  );
}
