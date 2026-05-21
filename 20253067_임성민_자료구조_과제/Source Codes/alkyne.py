# 알칸(Alkyne, C(n)H(2n-2)) 클래스
from hydrocarbon import Hydrocarbon

class Alkyne(Hydrocarbon):
    def __init__(self, name, c_count): # c_count : 분자를 구성하는 탄소의 개수
        # 알카인 공식: C(n)H(2n-2)
        super().__init__(name, c_count, (2 * c_count) - 2)

    def get_combustion_reaction(self):
        reaction = super().get_combustion_reaction()
        return f"[알카인 연소] {reaction}"

    def perform_test(self, reagent): # 알칸만의 성질을 이용한 반응 실험 결과 출력
        if reagent == "암모니아성 질산은":
            print(f"[{self.name}] + [{reagent}] : 흰색 침전물 생성됨")
        elif reagent in ["브롬수", "과망가니즈산 칼륨"]:
            print(f"[{self.name}] + [{reagent}] : 빠르게 반응하여 색이 변화함")
        else:
            print(f"[{self.name}] + [{reagent}] : 반응함")