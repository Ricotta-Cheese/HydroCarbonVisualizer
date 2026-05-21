# 알켄(Alkene, C(n)H(2n)) 클래스

from hydrocarbon import Hydrocarbon

class Alkene(Hydrocarbon):
    def __init__(self, name, c_count): # c_count : 분자를 구성하는 탄소의 개수
        # 알켄 공식에 따라 수소 수 계산 후 부모 생성자 호출
        super().__init__(name, c_count, 2 * c_count)

    def get_combustion_reaction(self):
        reaction = super().get_combustion_reaction()
        return f"[알켄 연소] {reaction}"

    def perform_test(self, reagent): # 알켄만의 성질을 이용한 반응 실험 결과 출력
        if reagent == "브롬수":
            print(f"[{self.name}] + [{reagent}] : 적갈색 브롬수가 무색으로 탈색됨")
        elif reagent == "과망가니즈산 칼륨":
            print(f"[{self.name}] + [{reagent}] : 보라색 용액이 사라지고 갈색 침전이 생김")
        else:
            print(f"[{self.name}] + [{reagent}] : 반응하지 않음")