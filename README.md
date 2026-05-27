# HydroCarbon OOP Visualizer

탄화수소 OOP 과제의 Python 클래스 구조를 웹에서 이해할 수 있도록 만든 Next.js 시각화 앱입니다. `HydrocarbonADT -> Hydrocarbon -> Alkane / Alkene / Alkyne` 상속 구조, 메서드 오버라이딩, 다형성에 따른 실행 결과 차이를 인터랙션으로 보여주는 것이 핵심 목표입니다.

## 현재 개발 상태

현재 브랜치인 `milestone/03-reagent--visual`은 전체 개발 계획 중 **3단계**입니다.

- 1단계 `Class Map`: OOP 상속 구조와 클래스별 오버라이딩 결과를 클릭 인터랙션으로 확인할 수 있습니다.
- 2단계 `Combustion View`: 탄화수소 종류와 탄소 수에 따라 완전 연소식, 분자량, 산소 요구량, 생성물 수가 즉시 갱신되며 단계별 반응 흐름을 시각화합니다.
- 3단계 `Reagent Test`: 브롬수, 과망가니즈산 칼륨, 암모니아성 질산은 반응을 타입별 다형성으로 시각화합니다.
- 4단계 `Reaction Lab`: 탄화수소 종류, 탄소 수, 시약을 함께 조합해 색 변화와 침전 여부를 빠르게 관찰합니다.

## 주요 기능

### Class Map

`/` 경로에서 확인할 수 있는 첫 화면입니다.

- `HydrocarbonADT`, `Hydrocarbon`, `Alkane`, `Alkene`, `Alkyne`의 관계를 UML 스타일 카드로 표현
- 클래스 노드를 클릭하면 필드, 메서드, 설계 의도, 실행 결과 패널 표시
- `get_combustion_reaction()`과 `perform_test(reagent)`가 하위 클래스에서 어떻게 다르게 동작하는지 확인
- 모바일에서는 설명 패널을 별도 다이얼로그로 열어 작은 화면에서도 읽기 쉽게 구성

### Combustion View

`/combustion` 경로에서 확인할 수 있는 두 번째 화면입니다.

- 알케인, 알켄, 알카인을 선택하면 각 계열의 일반식이 적용됩니다.
- 탄소 수를 조절하면 분자식, 분자량, 산소 계수, `CO2`, `H2O` 생성량이 즉시 다시 계산됩니다.
- 반응 단계는 `Fuel -> Oxygen -> CO2 -> H2O` 순서로 진행됩니다.
- 데스크톱에서는 sticky 시각화 영역과 스크롤 기반 단계 전환을 사용하고, 버튼으로도 단계를 이동할 수 있습니다.
- 추가 애니메이션 라이브러리 없이 React 상태와 CSS 전환/애니메이션으로 구현했습니다.

### Reagent Test

`/reagents` 경로에서 확인할 수 있는 시약 반응 화면입니다.

- 같은 `perform_test(reagent)` 호출이 `Alkane`, `Alkene`, `Alkyne`에서 서로 다른 결과를 내는 과정을 보여줍니다.
- 브롬수, 과망가니즈산 칼륨, 암모니아성 질산은의 초기 색과 반응 후 관찰 결과를 CSS 비커 시각화로 표현합니다.
- 암모니아성 질산은 반응을 알카인 계열의 침전 반응 예시로 단순화해 표시합니다.

### Reaction Lab

`/lab` 경로에서 확인할 수 있는 종합 실험 화면입니다.

- 탄화수소 종류, 탄소 수, 시약을 직접 조합합니다.
- 선택 즉시 비커 색이 천천히 변하며, 무색 탈색, 색 유지, 갈색/흰색 침전 같은 핵심 관찰 결과를 짧게 보여줍니다.
- 분자식과 시약 관찰을 가장 크게 보여주고, 분자량, 산소 요구량, 생성물 수는 하단 계산 요약으로 축소해 표시합니다.
- 연소식은 필요할 때만 펼쳐 볼 수 있도록 접힌 정보로 제공합니다.

## OOP 개념 대응

- 추상화: `HydrocarbonADT`가 분자식, 분자량, 정보 출력, 연소 반응, 시약 반응 메서드 규격을 정의합니다.
- 상속: `Hydrocarbon`이 공통 필드와 계산 로직을 구현하고, `Alkane`, `Alkene`, `Alkyne`이 이를 상속합니다.
- 캡슐화: Python 예제에서는 `__name`, `__c_count`, `__h_count` private field로 데이터를 보호합니다.
- 오버라이딩: 각 하위 클래스가 `get_combustion_reaction()`과 `perform_test(reagent)`를 계열 특성에 맞게 재정의합니다.
- 다형성: 같은 메서드 호출이라도 선택된 탄화수소 타입에 따라 서로 다른 연소 prefix와 시약 반응 결과가 표시됩니다.

## 기술 스택

- Next.js
- React
- Tailwind CSS
- CSS animation / transition
- ESLint

## 프로젝트 구조

```text
src/
  app/
    page.jsx              # Class Map 화면
    combustion/page.jsx   # Combustion View 화면
    reagents/page.jsx     # Reagent Test 화면
    lab/page.jsx          # Reaction Lab 화면
    layout.jsx            # 전역 레이아웃 및 metadata
    globals.css           # 전역 스타일과 반응/분자 애니메이션
  components/
    AppNavigation.jsx     # 상단 라우트 내비게이션
  lib/
    hydrocarbons.js       # 탄화수소 데이터, 계산 함수, 시약 반응 규칙
```

## 실행 방법

의존성이 설치되어 있지 않다면 먼저 설치합니다.

```bash
npm install
```

개발 서버를 실행합니다.

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`을 열어 확인합니다.

## 검증 방법

```bash
npm run lint
npm run build
```

확인해야 할 항목:

- `/`에서 각 클래스 노드를 클릭했을 때 설명 패널과 실행 결과가 바뀌는지 확인
- `/combustion`에서 탄화수소 종류와 탄소 수를 바꿨을 때 계산값과 반응식이 즉시 갱신되는지 확인
- `/reagents`에서 탄화수소 종류와 시약을 바꿨을 때 색 변화와 시약 결과가 즉시 갱신되는지 확인
- `/lab`에서 탄화수소 종류, 탄소 수, 시약 변경 시 계산과 반응 결과가 함께 갱신되는지 확인
- 데스크톱과 모바일 화면에서 카드, 설명 패널, 반응 단계 UI가 겹치지 않는지 확인
- Vercel 배포 전 `npm run build`가 성공하는지 확인

## 배포

Vercel 배포를 기준으로 구성된 Next.js 프로젝트입니다. 최종 제출본은 모든 마일스톤을 병합한 뒤 `main` 브랜치를 기준으로 배포하는 것을 목표로 합니다.
