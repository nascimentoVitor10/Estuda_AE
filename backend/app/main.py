from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import UserProfile, GuideResponse
from app.services import ai_service

app = FastAPI(title="EstudaAe API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, restrinja para o domínio do frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/gerar-guia", response_model=GuideResponse)
def gerar_guia(profile: UserProfile):
    if not profile.consentimento_lgpd:
        raise HTTPException(status_code=400, detail="O consentimento LGPD é obrigatório[cite: 4, 5].")
    
    try:
        guia = ai_service.gerar_guia_estudos(profile)
        return guia
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar guia com a IA: {str(e)}")

@app.get("/health")
def health_check():
    return {"status": "healthy"}