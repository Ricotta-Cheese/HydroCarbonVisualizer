export const reagents = ["브롬수", "과망가니즈산 칼륨", "암모니아성 질산은"];

export const reagentMetadata = {
  브롬수: {
    englishName: "Bromine water",
    initialLabel: "적갈색",
    finalLabel: "무색 또는 변화 없음",
    initialColor: "#b45309",
    accentColor: "#f59e0b",
    detects: "이중 결합과 삼중 결합을 가진 불포화 탄화수소",
    observation: "적갈색이 사라지는지 관찰합니다.",
  },
  "과망가니즈산 칼륨": {
    englishName: "Potassium permanganate",
    initialLabel: "보라색",
    finalLabel: "갈색 침전 또는 변화 없음",
    initialColor: "#7c3aed",
    accentColor: "#8b5cf6",
    detects: "불포화 결합이 있는 탄화수소",
    observation: "보라색이 사라지고 갈색 침전이 생기는지 관찰합니다.",
  },
  "암모니아성 질산은": {
    englishName: "Ammoniacal silver nitrate",
    initialLabel: "무색",
    finalLabel: "흰색 침전 또는 변화 없음",
    initialColor: "#e2e8f0",
    accentColor: "#94a3b8",
    detects: "말단 알카인의 침전 반응",
    observation: "말단 알카인 예시에서 흰색 침전물이 생기는지 관찰합니다.",
  },
};

export const hydrocarbonTypes = {
  alkane: {
    className: "Alkane",
    koreanName: "알케인",
    sampleName: "뷰테인",
    cCount: 4,
    minCarbon: 1,
    maxCarbon: 8,
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
    minCarbon: 2,
    maxCarbon: 8,
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
    minCarbon: 2,
    maxCarbon: 8,
    formulaRule: "CnH2n-2",
    accent: "violet",
    role: "삼중 결합을 가진 불포화 탄화수소",
    reactionPrefix: "[알카인 연소]",
    hydrogenCount: (carbon) => 2 * carbon - 2,
    reagentResult: (reagent) => {
      if (reagent === "암모니아성 질산은") {
        return "말단 알카인 예시로 흰색 침전물 생성됨";
      }
      if (reagent === "브롬수" || reagent === "과망가니즈산 칼륨") {
        return "빠르게 반응하여 색이 변화함";
      }
      return "반응함";
    },
  },
};

export const typeKeys = Object.keys(hydrocarbonTypes);

const reagentVisuals = {
  alkane: {
    브롬수: {
      finalColor: "#b45309",
      finalLabel: "적갈색 유지",
      phase: "unchanged",
      tone: "neutral",
      status: "No reaction",
      labComment: "적갈색 유지",
      observation: "포화 탄화수소라 브롬수의 적갈색이 유지됩니다.",
    },
    "과망가니즈산 칼륨": {
      finalColor: "#7c3aed",
      finalLabel: "보라색 유지",
      phase: "unchanged",
      tone: "neutral",
      status: "No reaction",
      labComment: "보라색 유지",
      observation: "단일 결합만 있어 보라색 용액이 유지됩니다.",
    },
    "암모니아성 질산은": {
      finalColor: "#e2e8f0",
      finalLabel: "변화 없음",
      phase: "unchanged",
      tone: "neutral",
      status: "No visible change",
      labComment: "침전 없음",
      observation: "침전 없이 용액이 투명하게 남습니다.",
    },
  },
  alkene: {
    브롬수: {
      finalColor: "#f8fafc",
      finalLabel: "무색",
      phase: "decolorized",
      tone: "reactive",
      status: "Positive unsaturation test",
      labComment: "무색으로 탈색",
      observation: "이중 결합이 반응해 적갈색이 무색으로 탈색됩니다.",
    },
    "과망가니즈산 칼륨": {
      finalColor: "#92400e",
      finalLabel: "갈색 침전",
      phase: "precipitate",
      tone: "reactive",
      status: "Positive oxidation test",
      labComment: "갈색 침전 생성",
      observation: "보라색이 사라지고 갈색 침전이 나타납니다.",
    },
    "암모니아성 질산은": {
      finalColor: "#e2e8f0",
      finalLabel: "변화 없음",
      phase: "unchanged",
      tone: "neutral",
      status: "No reaction",
      labComment: "침전 없음",
      observation: "침전 없이 변화가 거의 나타나지 않습니다.",
    },
  },
  alkyne: {
    브롬수: {
      finalColor: "#fde68a",
      finalLabel: "옅은 노란색",
      phase: "changed",
      tone: "reactive",
      status: "Fast color change",
      labComment: "옅은 노란색으로 변화",
      observation: "삼중 결합 때문에 브롬수 색이 빠르게 옅어집니다.",
    },
    "과망가니즈산 칼륨": {
      finalColor: "#854d0e",
      finalLabel: "갈색으로 변화",
      phase: "changed",
      tone: "reactive",
      status: "Fast color change",
      labComment: "갈색으로 변화",
      observation: "삼중 결합이 빠르게 반응해 용액 색이 변합니다.",
    },
    "암모니아성 질산은": {
      finalColor: "#f8fafc",
      finalLabel: "흰색 침전",
      phase: "white-precipitate",
      tone: "reactive",
      status: "White precipitate",
      labComment: "흰색 침전 생성",
      observation: "말단 알카인 예시로 흰색 침전이 생성됩니다.",
    },
  },
};

const hydrocarbonNames = {
  alkane: {
    1: "메테인",
    2: "에테인",
    3: "프로페인",
    4: "뷰테인",
    5: "펜테인",
    6: "헥세인",
    7: "헵테인",
    8: "옥테인",
  },
  alkene: {
    2: "에텐",
    3: "프로펜",
    4: "뷰텐",
    5: "펜텐",
    6: "헥센",
    7: "헵텐",
    8: "옥텐",
  },
  alkyne: {
    2: "에타인",
    3: "프로파인",
    4: "뷰타인",
    5: "펜타인",
    6: "헥사인",
    7: "헵타인",
    8: "옥타인",
  },
};

export function formatNumber(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function getHydrocarbonName(typeKey, carbonCount) {
  return hydrocarbonNames[typeKey]?.[carbonCount] ?? "이름 데이터 없음";
}

export function getHydrocarbonDetails(typeOrKey, carbonCount) {
  const type =
    typeof typeOrKey === "string" ? hydrocarbonTypes[typeOrKey] : typeOrKey;
  const carbon = carbonCount ?? type.cCount;
  const hCount = type.hydrogenCount(carbon);
  const molarMass = carbon * 12 + hCount;
  const oxygen = carbon + hCount / 4;
  const water = hCount / 2;

  return {
    carbon,
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

export function getClassFlow(typeKey) {
  const type = hydrocarbonTypes[typeKey];

  return ["HydrocarbonADT", "Hydrocarbon", type?.className ?? "Unknown"];
}

export function getCombustionReaction(typeOrKey, carbonCount) {
  const type =
    typeof typeOrKey === "string" ? hydrocarbonTypes[typeOrKey] : typeOrKey;
  const details = getHydrocarbonDetails(type, carbonCount);

  return `${type.reactionPrefix} C${details.carbon}H${details.hCount} + ${formatNumber(
    details.oxygen
  )}O2 -> ${details.carbon}CO2 + ${formatNumber(details.water)}H2O`;
}

export function getReagentTestResult(typeKey, reagent, carbonCount) {
  const type = hydrocarbonTypes[typeKey];
  const metadata = reagentMetadata[reagent];
  const visual = reagentVisuals[typeKey]?.[reagent] ?? {
    finalColor: metadata?.initialColor ?? "#e2e8f0",
    phase: "unknown",
    tone: "neutral",
    status: "Unknown",
    labComment: "관찰 결과 없음",
    observation: "반응 데이터가 없습니다.",
  };
  const details = getHydrocarbonDetails(type, carbonCount);

  return {
    reagent,
    metadata,
    type,
    typeKey,
    classFlow: getClassFlow(typeKey),
    details,
    formula: `C${details.carbon}H${details.hCount}`,
    methodCall: `${type.className}.perform_test("${reagent}")`,
    result: type.reagentResult(reagent),
    ...visual,
    oopConcept:
      "같은 perform_test(reagent) 호출이 concrete class의 오버라이딩 구현에 따라 다른 관찰 결과를 반환합니다.",
  };
}

export function getCarbonOptions(typeOrKey) {
  const type =
    typeof typeOrKey === "string" ? hydrocarbonTypes[typeOrKey] : typeOrKey;

  return Array.from(
    { length: type.maxCarbon - type.minCarbon + 1 },
    (_, index) => type.minCarbon + index
  );
}
