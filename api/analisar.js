export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { mensagem } = req.body;

    if (!mensagem) {
      return res.status(400).json({ error: "Mensagem obrigatória" });
    }

    const chave = process.env.OPENAI_API_KEY?.trim();

    if (!chave) {
      return res.status(500).json({
        error: "A chave OPENAI_API_KEY não foi encontrada no Vercel."
      });
    }

    const resposta = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${chave}`
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        input: mensagem
      })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      return res.status(resposta.status).json({
        error: dados.error?.message || "Erro na OpenAI"
      });
    }

    return res.status(200).json({
      resposta: dados.output_text
    });

  } catch (erro) {
    return res.status(500).json({
      error: erro.message || "Erro interno no AgroZap"
    });
  }
}

