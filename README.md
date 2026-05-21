# Hydrocarbon Class Map

탄화수소의 객체 지향 구조를 시각적으로 이해하기 위한 Next.js 기반 인터랙티브 클래스 맵입니다.

`HydrocarbonADT`에서 시작해 `Hydrocarbon` 기본 클래스를 거쳐 `Alkane`, `Alkene`, `Alkyne` 구체 클래스로 이어지는 상속 구조를 UML 스타일로 보여줍니다. 각 클래스를 클릭하면 필드, 메서드, 분자식, 분자량, 연소 반응식, 시약 반응 결과를 확인할 수 있습니다.

## 주요 기능

- 탄화수소 클래스 구조를 UML 다이어그램 형태로 시각화
- `HydrocarbonADT`, `Hydrocarbon`, `Alkane`, `Alkene`, `Alkyne` 클래스 설명 제공
- 알케인, 알켄, 알카인의 분자식 규칙 비교
- 분자량과 연소 반응식 계산 결과 표시
- 브롬수, 과망가니즈산 칼륨, 암모니아성 질산은 반응 결과 비교
- 데스크톱에서는 다이어그램과 설명 패널을 나란히 표시
- 모바일에서는 클래스 선택 시 설명을 전체 화면 패널로 표시

## 학습 포인트

이 프로젝트는 다음 객체 지향 개념을 설명하기 위해 구성되었습니다.

- 추상 자료형 / 인터페이스 역할
- 기본 클래스와 구체 클래스의 관계
- 상속을 통한 공통 필드와 메서드 재사용
- 메서드 오버라이딩
- 같은 메서드 호출이 클래스별로 다르게 동작하는 다형성

## 기술 스택

- Next.js
- React
- Tailwind CSS
- ESLint

## 실행 방법

```bash
npm install
npm run dev
브라우저에서 아래 주소로 접속합니다.

http://localhost:3000
사용 가능한 스크립트
npm run dev
개발 서버를 실행합니다.

npm run build
프로덕션 빌드를 생성합니다.

npm run start
빌드된 앱을 실행합니다.

npm run lint
ESLint로 코드 스타일과 잠재적인 문제를 확인합니다.

프로젝트 구조
src/app/
  layout.jsx      # 앱 메타데이터와 루트 레이아웃
  page.jsx        # 클래스 맵, 설명 패널, 탄화수소 데이터 로직
  globals.css     # 전역 스타일과 UML 다이어그램 스타일
화면 구성
메인 화면은 크게 두 영역으로 구성됩니다.

UML Diagram
탄화수소 클래스의 상속 구조를 보여주는 인터랙티브 다이어그램입니다.

Class Description
선택한 클래스의 역할, 필드, 메서드, 계산 결과, 반응 결과를 보여주는 설명 패널입니다.

예시 클래스 구조
HydrocarbonADT
  ↓
Hydrocarbon
  ↓
Alkane / Alkene / Alkyne
Alkane, Alkene, Alkyne는 공통 부모 클래스의 구조를 공유하면서도 각자의 분자식 규칙과 시약 반응 결과를 다르게 구현합니다.
```
