from abc import ABC, abstractmethod

class CompilerService(ABC):
    @abstractmethod
    def compile(self,path):
        return None
