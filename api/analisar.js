export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido"
    });
  }

  try {
    const { mensagem } = req.body;

    if (!mensagem || mensagem.trim() === "") {
      return res.status(400).json({
        error: "Mensagem obrigatória"
      });
    }

    const texto = mensagem.toLowerCase();

    // =========================
    // IDENTIFICAR TIPO
    // =========================

    let tipo = "registro";

    if (
      texto.includes("comprei") ||
      texto.includes("gastei") ||
      texto.includes("paguei") ||
      texto.includes("custo") ||
      texto.includes("gasto")
    ) {
      tipo = "gasto";
    }

    if (
      texto.includes("vendi") ||
      texto.includes("venda") ||
      texto.includes("recebi")
    ) {
      tipo = "venda";
    }

    if (
      texto.includes("colhi") ||
      texto.includes("produzi") ||
      texto.includes("produção")
    ) {
      tipo = "produção";
    }

    // =========================
    // IDENTIFICAR CATEGORIA
    // =========================

    let categoria = "outros";

    if (
      texto.includes("adubo") ||
      texto.includes("fertilizante")
    ) {
      categoria = "adubo";
    }

    if (
      texto.includes("café") ||
      texto.includes("cafe")
    ) {
      categoria = "café";
    }

    if (
      texto.includes("diesel") ||
      texto.includes("combustível") ||
      texto.includes("combustivel")
    ) {
      categoria = "combustível";
    }

    if (
      texto.includes("ração") ||
      texto.includes("racao")
    ) {
      categoria = "ração";
    }

    if (
      texto.includes("sementes") ||
      texto.includes("semente")
    ) {
      categoria = "sementes";
    }

    if (
      texto.includes("defensivo") ||
      texto.includes("herbicida") ||
      texto.includes("fungicida") ||
      texto.includes("inseticida")
    ) {
      categoria = "defensivos";
    }

    if (
      texto.includes("máquina") ||
      texto.includes("maquina") ||
      texto.includes("trator")
    ) {
      categoria = "máquinas";
    }

    // =========================
    // ENCONTRAR VALOR
    // =========================

    let valor = null;

    const valorEncontrado = texto.match(
      /r\$\s?([\d.,]+)|(\d+(?:[.,]\d+)?)\s?(?:reais)/
    );

    if (valorEncontrado) {
      let numero = valorEncontrado[1] || valorEncontrado[2];

      numero = numero
        .replace(/\./g, "")
        .replace(",", ".");

      valor = Number(numero);
    }

    // =========================
    // ENCONTRAR QUANTIDADE
    // =========================

    let quantidade = null;

    const quantidadeEncontrada = texto.match(
      /(\d+(?:[.,]\d+)?)\s?(sacos?|kg|quilos?|litros?|l|hectares?|ha|unidades?)/
    );

    if (quantidadeEncontrada) {
      quantidade = quantidadeEncontrada[1];
    }

    // =========================
    // MONTAR RESPOSTA
    // =========================

    let resposta = "🌱 AgroZap identificou este registro:\n\n";

    resposta += `📌 Tipo: ${tipo}\n`;
    resposta += `📂 Categoria: ${categoria}\n`;

    if (quantidade) {
      resposta += `📦 Quantidade: ${quantidade}\n`;
    }

    if (valor !== null) {
      resposta += `💰 Valor: R$ ${valor.toLocaleString("pt-BR", {
        minimumFractionDigits: 2
      })}\n`;
    }

    resposta += `📝 Descrição: ${mensagem}\n\n`;

    resposta += "✅ Registro analisado com sucesso.";

    return res.status(200).json({
      resposta: resposta,
      registro: {
        tipo: tipo,
        categoria: categoria,
        descricao: mensagem,
        valor: valor,
        quantidade: quantidade
      }
    });

  } catch (erro) {

    return res.status(500).json({
      error: "Erro interno no AgroZap"
    });

  }
}
