# 알케인(Alkane, C(n)H(2n+2)) 클래스
from hydrocarbon import Hydrocarbon

class Alkane(Hydrocarbon):
    def __init__(self, name, c_count): # c_count : 분자를 구성하는 탄소의 개수
        # 알케인 공식에 따라 수소 수 계산 후 부모 생성자 호출
        super().__init__(name, c_count, (2 * c_count) + 2)

    def get_combustion_reaction(self):
        reaction = super().get_combustion_reaction()
        return f"[알케인 연소] {reaction}"

    def perform_test(self, reagent): # 알케인만의 성질을 이용한 반응 실험 결과 출력
        if reagent == "브롬수" or reagent == "과망가니즈산 칼륨":
            print(f"[{self.name}] + [{reagent}] : 반응하지 않음")
        elif reagent == "암모니아성 질산은":
            print(f"[{self.name}] + [{reagent}] : 아무런 변화가 없음")
        else:
            print(f"[{self.name}] + [{reagent}] : 대한 반응 데이터 없음")