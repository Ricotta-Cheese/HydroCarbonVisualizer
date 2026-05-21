from alkane import Alkane
from alkene import Alkene
from alkyne import Alkyne

if __name__ == "__main__":
    # 1. 인스턴스 생성
    hydrocarbons = [
        # 알케인 그룹 (CnH2n+2)
        Alkane("메테인", 1), Alkane("에테인", 2), Alkane("프로페인", 3), Alkane("뷰테인", 4),
        # 알켄 그룹 (CnH2n)
        Alkene("에텐", 2), Alkene("프로펜", 3), Alkene("뷰텐", 4), Alkene("펜텐", 5),
        # 알카인 그룹 (CnH2n-2)
        Alkyne("에타인", 2), Alkyne("프로파인", 3), Alkyne("뷰타인", 4), Alkyne("펜타인", 5)
    ]

    print("-" * 20 + " 탄화수소 분석 리포트 " + "-" * 20)

    # 2. 반복문을 통한 정보 및 다형성 테스트 출력
    for hydrocarbon in hydrocarbons:
        # 기본 정보 출력 (이름, 화학식, 분자량)
        hydrocarbon.display_info()

        # 연소 반응식 출력 (오버라이딩된 메서드)
        print(f"반응식: {hydrocarbon.get_combustion_reaction()}")

        # 시약 검출 반응 출력
        # "브롬수", "과망가니즈산 칼륨", "암모니아성 질산은" 세 종류 시약에 대한 실험 결과 출력
        print("---<화학적 검출 반응 결과>---")
        reagents = ["브롬수", "과망가니즈산 칼륨", "암모니아성 질산은"]
        for r in reagents:
            # 다형성: 동일한 호출이지만 객체의 타입에 따라 다른 결과 출력
            hydrocarbon.perform_test(r)
            # ----------------------------------

        print("-" * 65)

    else:
        print("\n모든 탄화수소에 대한 계산 및 반응 테스트가 성공적으로 종료되었습니다")