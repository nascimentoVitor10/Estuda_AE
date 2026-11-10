import React, { useState } from 'react';

export default function App() {
  const [formData, setFormData] = useState({
    escolaridade: 'Graduação',
    curso_ou_area: 'Sistemas de Informação',
    o_que_ja_estuda: 'Lógica e Python básico',
    objetivo: 'Criar aplicações web completas',
    assunto_desejado: 'Desenvolvimento Backend com FastAPI',
    consentimento_lgpd: false
  });

  const [loading, setLoading] = useState(false);
  const [guide, setGuide] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.consentimento_lgpd) {
      alert('Você precisa aceitar os termos de consentimento da LGPD.');
      return;
    }

    setLoading(true);
    setError(null);
    setGuide(null);

    try {
      const response = await fetch('http://localhost:8000/api/gerar-guia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Falha ao gerar o guia de estudos.');
      const data = await response.json();
      setGuide(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-sm border border-slate-200 rounded-xl p-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-indigo-600">EstudaAe 🚀</h1>
          <p className="text-slate-600 mt-2">Guia de estudos contextualizado sob medida para o seu objetivo.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Assunto que deseja estudar</label>
            <input type="text" name="assunto_desejado" value={formData.assunto_desejado} onChange={handleChange} required
              className="mt-1 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Escolaridade</label>
              <input type="text" name="escolaridade" value={formData.escolaridade} onChange={handleChange} required
                className="mt-1 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Curso ou Área</label>
              <input type="text" name="curso_ou_area" value={formData.curso_ou_area} onChange={handleChange} required
                className="mt-1 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">O que você já estuda / Conhecimento prévio</label>
            <input type="text" name="o_que_ja_estuda" value={formData.o_que_ja_estuda} onChange={handleChange} required
              className="mt-1 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Qual o seu objetivo principal?</label>
            <input type="text" name="objetivo" value={formData.objetivo} onChange={handleChange} required
              className="mt-1 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" name="consentimento_lgpd" id="lgpd" checked={formData.consentimento_lgpd} onChange={handleChange}
              className="w-4 h-4 text-indigo-600 border-slate-300 rounded" />
            <label htmlFor="lgpd" className="text-sm text-slate-600">Concordo com a coleta mínima de dados para fins educacionais (LGPD)[cite: 4, 5].</label>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50">
            {loading ? 'Gerando Guia Contextualizado...' : 'Gerar Meu Guia de Estudos'}
          </button>
        </form>

        {error && <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">{error}</div>}

        {guide && (
          <div className="mt-10 border-t border-slate-200 pt-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Guia para: {guide.assunto}</h2>
            <div className="space-y-6">
              {guide.topicos.map((t) => (
                <div key={t.ordem} className="p-5 bg-slate-50 border border-slate-200 rounded-xl shadow-xs">
                  <span className="inline-block px-2.5 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full mb-2">
                    Tópico {t.ordem}
                  </span>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">{t.titulo}</h3>
                  <div className="space-y-2 text-sm text-slate-700">
                    <p><strong className="text-slate-900">Por que importa:</strong> {t.por_que_importa}</p>
                    <p><strong className="text-slate-900">Onde se aplica:</strong> {t.onde_se_aplica}</p>
                    <p><strong className="text-slate-900">Relação com seu objetivo:</strong> {t.relacao_com_objetivo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}