from abc import ABC, abstractmethod

class HydrocarbonADT(ABC):
    @property
    @abstractmethod
    def formula(self):
        # 화학식을 반환하는 추상 프로퍼티
        pass

    @property
    @abstractmethod
    def molar_mass(self):
        # 분자량을 반환하는 추상 프로퍼티
        pass

    @abstractmethod
    def display_info(self):
        # 탄화수소의 정보를 출력하는 추상 메서드
        pass

    @abstractmethod
    def get_combustion_reaction(self):
        # 연소 반응식을 문자열로 반환하는 추상 메서드
        pass

    @abstractmethod
    def perform_test(self, reagent):
        # 시약 반응 테스트를 수행하는 추상 메서드
        pass