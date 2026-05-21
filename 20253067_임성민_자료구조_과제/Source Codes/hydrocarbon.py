from hydrocarbon_ADT import HydrocarbonADT

class Hydrocarbon(HydrocarbonADT):
    def __init__(self, name, c_count, h_count):
        self.__name = name            # Private: 이름 보호
        self.__c_count = c_count      # Private: 탄소 수
        self.__h_count = h_count      # Private: 수소 수

    @property
    def name(self): return self.__name

    @property
    def c_count(self): return self.__c_count

    @property
    def h_count(self): return self.__h_count

    @property
    def formula(self):
        return f"C{self.__c_count}H{self.__h_count}"

    @property
    def molar_mass(self):
        # 탄소(12), 수소(1) 기준 분자량 계산
        return (self.__c_count * 12) + (self.__h_count * 1)

    def display_info(self):
        print(f"명칭: {self.name} | 화학식: {self.formula} | 분자량: {self.molar_mass}g/mol")

    def get_combustion_reaction(self):
        # 기본 연소 공식: CxHy + (x + y/4)O2 -> xCO2 + (y/2)H2O
        o2 = self.c_count + (self.h_count / 4)
        return f"{self.formula} + {o2}O2 -> {self.c_count}CO2 + {self.h_count/2}H2O"

    def perform_test(self, reagent):
        # 기본적으로는 반응이 없다고 설정...
        print(f"[{self.name}] + [{reagent}] : 아무런 변화가 없음")