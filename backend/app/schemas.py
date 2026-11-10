from pydantic import BaseModel, Field

class UserProfile(BaseModel):
    escolaridade: str
    curso_ou_area: str
    o_que_ja_estuda: str
    objetivo: str
    assunto_desejado: str
    consentimento_lgpd: bool

class TopicGuide(BaseModel):
    ordem: int
    titulo: str
    por_que_importa: str
    onde_se_aplica: str
    relacao_com_objetivo: str

class GuideResponse(BaseModel):
    assunto: str
    topicos: list[TopicGuide]