export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido"
    });
  }

  try {

    const { mensagem } = req.body;

    if (!mensagem) {
      return res.status(400).json({
        error: "Mensagem obrigatória"
      });
    }

    const resposta = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },

        body: JSON.stringify({

          model: "gpt-5-mini",

          input: [
            {
              role: "system",
              content:
                "Você é o AgroZap, um assistente simples para produtores rurais. Entenda a mensagem do produtor e responda em português. Não invente informações."
            },
            {
              role: "user",
              content: mensagem
            }
          ]

        })
      }
    );

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

