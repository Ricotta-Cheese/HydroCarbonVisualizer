export const reagents = ["브롬수", "과망가니즈산 칼륨", "암모니아성 질산은"];

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
        return "흰색 침전물 생성됨";
      }
      if (reagent === "브롬수" || reagent === "과망가니즈산 칼륨") {
        return "빠르게 반응하여 색이 변화함";
      }
      return "반응함";
    },
  },
};

export const typeKeys = Object.keys(hydrocarbonTypes);

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

export function getCarbonOptions(typeOrKey) {
  const type =
    typeof typeOrKey === "string" ? hydrocarbonTypes[typeOrKey] : typeOrKey;

  return Array.from(
    { length: type.maxCarbon - type.minCarbon + 1 },
    (_, index) => type.minCarbon + index
  );
}
