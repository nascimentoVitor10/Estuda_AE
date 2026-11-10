
import os
import json
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types

from app.schemas import UserProfile, GuideResponse


# Carrega o .env localizado na raiz do backend
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)


class AIService:
    def __init__(self):
        self.client = None

    def _get_client(self):
        if self.client is None:
            api_key = os.getenv("GEMINI_API_KEY")

            if not api_key:
                raise RuntimeError(
                    "GEMINI_API_KEY não foi configurada."
                )

            self.client = genai.Client(api_key=api_key)

        return self.client

    def gerar_guia_estudos(self, profile: UserProfile) -> GuideResponse:
        client = self._get_client()

        prompt = f"""
        Gere um guia de estudos sequenciado para o assunto:
        '{profile.assunto_desejado}'.

        O perfil do estudante é:
        - Escolaridade: {profile.escolaridade}
        - Área/Curso: {profile.curso_ou_area}
        - O que já estuda: {profile.o_que_ja_estuda}
        - Objetivo: {profile.objetivo}

        Retorne estritamente um JSON estruturado contendo
        uma lista de tópicos. Cada tópico deve conter:
        - ordem (número inteiro)
        - titulo (string)
        - por_que_importa (string explicativa contextualizada ao perfil)
        - onde_se_aplica (string prática)
        - relacao_com_objetivo (string ligando diretamente ao objetivo)
        """

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=GuideResponse,
                temperature=0.3,
            ),
        )

        if not response.text:
            raise RuntimeError("A IA retornou uma resposta vazia.")

        data = json.loads(response.text)

        return GuideResponse(**data)


ai_service = AIService()
