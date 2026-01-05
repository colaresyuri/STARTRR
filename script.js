// Menu mobile hamburguer
document.addEventListener("DOMContentLoaded", function () {
  var navToggle = document.querySelector(".nav-toggle");
  var mainNav = document.getElementById("mainNav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", !expanded);
      mainNav.classList.toggle("open");
    });
    // Fecha o menu ao clicar em um link
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }
});
// STARTRR - Script universal para todas as páginas

function $(id) {
  return document.getElementById(id);
}

document.addEventListener("DOMContentLoaded", function () {
  // --- PDF ---
  const downloadPdfBtn = document.getElementById("downloadPdfBtn");
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener("click", function () {
      // Coleta dados
      const nome = businessName?.value || "Seu negócio";
      const preco = priceA?.value || "";
      const qtd = qtyA?.value || "";
      const varCost = varCostA?.value || "";
      const fixedCost = fixedCostA?.value || "";
      const invest = investmentA?.value || "";
      const interp = interpretationText?.innerText || "";
      const recs = Array.from(
        document.querySelectorAll("#recommendationsList li")
      ).map((li) => li.innerText);
      // Monta texto
      let conteudo = `Relatório Financeiro\n\n`;
      conteudo += `Nome do negócio: ${nome}\n`;
      conteudo += `Preço por unidade: R$ ${preco}\n`;
      conteudo += `Unidades vendidas: ${qtd}\n`;
      conteudo += `Custo variável por unidade: R$ ${varCost}\n`;
      conteudo += `Custos fixos: R$ ${fixedCost}\n`;
      conteudo += `Investimento inicial: R$ ${invest}\n\n`;
      conteudo += `--- Interpretação ---\n${interp}\n\n`;
      conteudo += `--- Recomendações ---\n`;
      recs.forEach((r, i) => {
        conteudo += `${i + 1}. ${r}\n`;
      });
      // Monta PDF com layout melhorado
      const doc = new window.jspdf.jsPDF();
      // Título
      doc.setFontSize(20);
      doc.text("Relatório Financeiro", 105, 18, { align: "center" });
      let y = 30;
      doc.setFontSize(14);
      doc.text("Dados do negócio:", 10, y);
      y += 8;
      doc.setFontSize(12);
      doc.text(`Nome do negócio: ${nome}`, 10, y);
      y += 7;
      doc.text(`Preço por unidade: R$ ${preco}`, 10, y);
      y += 7;
      doc.text(`Unidades vendidas: ${qtd}`, 10, y);
      y += 7;
      doc.text(`Custo variável por unidade: R$ ${varCost}`, 10, y);
      y += 7;
      doc.text(`Custos fixos: R$ ${fixedCost}`, 10, y);
      y += 7;
      doc.text(`Investimento inicial: R$ ${invest}`, 10, y);
      y += 12;
      doc.setFontSize(14);
      doc.text("Interpretação:", 10, y);
      y += 8;
      doc.setFontSize(12);
      doc.text(doc.splitTextToSize(interp, 185), 10, y);
      y += 18;
      doc.setFontSize(14);
      doc.text("Recomendações:", 10, y);
      y += 8;
      doc.setFontSize(12);
      recs.forEach((r, i) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(`${i + 1}. ${r}`, 12, y);
        y += 7;
      });
      doc.save("relatorio_startrr.pdf");
    });
  }
  // --- Recomendações ---
  function gerarRecomendacoes(a, b) {
    const recs = [];
    // Recomendações para cenário A
    if (a.revenue <= 0)
      recs.push("Aumente o preço ou a quantidade vendida para gerar receita.");
    if (a.profit < 0)
      recs.push("Reduza custos ou aumente o preço para evitar prejuízo.");
    if (a.totalCost > a.revenue)
      recs.push(
        "Os custos totais estão maiores que a receita. Reveja despesas."
      );
    if (a.profit > 0)
      recs.push(
        "Considere reinvestir parte do lucro em marketing ou inovação."
      );
    if (a.revenue > 0 && a.profit / a.revenue < 0.1)
      recs.push(
        "A margem de lucro está baixa (<10%). Avalie estratégias para aumentar o preço ou reduzir custos."
      );
    if (b && b.profit > a.profit)
      recs.push(
        "O cenário B é mais lucrativo. Analise o que muda entre os cenários."
      );
    // Recomendações extras para garantir 6 reais
    const extras = [
      "Busque parcerias locais para ampliar sua rede de clientes.",
      "Implemente controles financeiros mensais para acompanhar a evolução do negócio.",
      "Invista em capacitação e treinamento para melhorar a produtividade.",
      "Acompanhe indicadores como ticket médio e taxa de conversão.",
      "Considere criar promoções sazonais para aumentar o faturamento.",
      "Utilize redes sociais para divulgar seu negócio e atrair novos clientes.",
    ];
    let i = 0;
    while (recs.length < 6 && i < extras.length) {
      recs.push(extras[i]);
      i++;
    }
    return recs.slice(0, 6);
  }
  // --- GRÁFICO ---
  let chartInstance = null;
  function formatBRL(n) {
    return (
      n?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) ||
      "R$ 0,00"
    );
  }

  function renderChart(a, b) {
    // Exibir números dos resultados em cards integrados
    const resultsNumbers = document.getElementById("resultsNumbers");
    if (resultsNumbers) {
      let html = `<div class='result-card'><h4>Cenário A</h4><div class='value' style='color:#22c55e'>Receita: ${formatBRL(
        a.revenue
      )}</div><div class='value' style='color:#ef4444'>Custos Totais: ${formatBRL(
        a.totalCost ?? 0
      )}</div><div class='value' style='color:#3b82f6'>Lucro: ${formatBRL(
        a.profit
      )}</div></div>`;
      if (b) {
        html += `<div class='result-card'><h4>Cenário B</h4><div class='value' style='color:#22c55e'>Receita: ${formatBRL(
          b.revenue
        )}</div><div class='value' style='color:#ef4444'>Custos Totais: ${formatBRL(
          b.totalCost ?? 0
        )}</div><div class='value' style='color:#3b82f6'>Lucro: ${formatBRL(
          b.profit
        )}</div></div>`;
      }
      resultsNumbers.innerHTML = html;
    }
    const canvas = document.getElementById("resultsChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    // Dados para o gráfico
    const labels = b ? ["Cenário A", "Cenário B"] : ["Cenário A"];
    const receita = [a.revenue];
    const custos = [a.totalCost ?? 0];
    const lucro = [a.profit];
    if (b) {
      receita.push(b.revenue);
      custos.push(b.totalCost ?? 0);
      lucro.push(b.profit);
    }
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Receita",
            data: receita,
            backgroundColor: "rgba(34,197,94,0.7)",
            borderColor: "rgba(34,197,94,1)",
            borderWidth: 1,
          },
          {
            label: "Custos Totais",
            data: custos,
            backgroundColor: "rgba(239,68,68,0.7)",
            borderColor: "rgba(239,68,68,1)",
            borderWidth: 1,
          },
          {
            label: "Lucro",
            data: lucro,
            backgroundColor: "rgba(59,130,246,0.7)",
            borderColor: "rgba(59,130,246,1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: { display: false },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  }
  // --- Simulador Financeiro (index.html) ---
  const simulateBtn = $("simulateBtn");
  const clearBtn = $("clearBtn");
  const readBtn = $("readBtn");
  const stopReadBtn = $("stopReadBtn");
  const autoRead = $("autoRead");
  const businessName = $("businessName");
  const priceA = $("priceA");
  const qtyA = $("qtyA");
  const varCostA = $("varCostA");
  const fixedCostA = $("fixedCostA");
  const investmentA = $("investmentA");
  const priceB = $("priceB");
  const qtyB = $("qtyB");
  const varCostB = $("varCostB");
  const fixedCostB = $("fixedCostB");
  const investmentB = $("investmentB");
  const scenarioB = $("scenarioB");
  const toggleB = $("toggleB");
  const cards = $("cards");
  const interpretationText = $("interpretationText");
  const comparison = $("comparison");
  const comparisonTable = $("comparisonTable");

  let isReading = false;
  function setReadingState(active) {
    isReading = active;
    if (readBtn) readBtn.disabled = active;
    if (stopReadBtn) stopReadBtn.disabled = !active;
    document.body.classList.toggle("reading-audio", active);
  }

  function generateSpeechReport(name, a, b) {
    // Exemplo simples
    let txt = `Resultados para ${name}. Receita: R$ ${
      a?.revenue?.toFixed(2) ?? 0
    }. Lucro: R$ ${a?.profit?.toFixed(2) ?? 0}.`;
    if (b)
      txt += ` No cenário B, receita: R$ ${b.revenue?.toFixed(
        2
      )}, lucro: R$ ${b.profit?.toFixed(2)}.`;
    // Adiciona recomendações
    const recList = document.getElementById("recommendationsList");
    if (recList) {
      const recs = Array.from(recList.querySelectorAll("li")).map(
        (li) => li.innerText
      );
      if (recs.length > 0) {
        txt += ` Recomendações: `;
        recs.forEach((r, i) => {
          txt += ` ${i + 1}. ${r}`;
        });
      }
    }
    return txt;
  }

  function readResults() {
    if (isReading) {
      window.speechSynthesis.cancel();
      setReadingState(false);
      return;
    }
    const name = businessName?.value || "Seu negócio";
    // Simulação simplificada para leitura
    const a = {
      revenue: Number(priceA?.value || 0) * Number(qtyA?.value || 0),
      profit:
        (Number(priceA?.value || 0) - Number(varCostA?.value || 0)) *
          Number(qtyA?.value || 0) -
        Number(fixedCostA?.value || 0),
    };
    const b =
      scenarioB && !scenarioB.classList.contains("hidden")
        ? {
            revenue: Number(priceB?.value || 0) * Number(qtyB?.value || 0),
            profit:
              (Number(priceB?.value || 0) - Number(varCostB?.value || 0)) *
                Number(qtyB?.value || 0) -
              Number(fixedCostB?.value || 0),
          }
        : null;
    const text = generateSpeechReport(name, a, b);
    if ("speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = "pt-BR";
        utter.onstart = () => setReadingState(true);
        utter.onend = () => setReadingState(false);
        utter.onerror = () => setReadingState(false);
        window.speechSynthesis.speak(utter);
      } catch (e) {
        setReadingState(false);
        alert("Erro ao tentar ler em voz alta. Recarregue a página.");
      }
    } else {
      setReadingState(false);
      alert("Síntese de voz não suportada neste navegador.");
    }
  }

  if (simulateBtn) {
    simulateBtn.addEventListener("click", function () {
      // Lógica do simulador com cálculo para o gráfico
      const a = {
        revenue: Number(priceA?.value || 0) * Number(qtyA?.value || 0),
        totalCost:
          Number(varCostA?.value || 0) * Number(qtyA?.value || 0) +
          Number(fixedCostA?.value || 0),
        profit:
          (Number(priceA?.value || 0) - Number(varCostA?.value || 0)) *
            Number(qtyA?.value || 0) -
          Number(fixedCostA?.value || 0),
      };
      let b = null;
      if (scenarioB && !scenarioB.classList.contains("hidden")) {
        b = {
          revenue: Number(priceB?.value || 0) * Number(qtyB?.value || 0),
          totalCost:
            Number(varCostB?.value || 0) * Number(qtyB?.value || 0) +
            Number(fixedCostB?.value || 0),
          profit:
            (Number(priceB?.value || 0) - Number(varCostB?.value || 0)) *
              Number(qtyB?.value || 0) -
            Number(fixedCostB?.value || 0),
        };
      }
      renderChart(a, b);
      // Recomendações
      const recs = gerarRecomendacoes(a, b);
      const recList = document.getElementById("recommendationsList");
      if (recList) {
        recList.innerHTML = recs.map((r) => `<li>${r}</li>`).join("");
      }
      if (autoRead && autoRead.checked) readResults();
    });
  }
  if (readBtn) {
    readBtn.addEventListener("click", readResults);
  }
  if (stopReadBtn) {
    stopReadBtn.addEventListener("click", function () {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setReadingState(false);
    });
    stopReadBtn.disabled = true;
  }
  if (toggleB && scenarioB) {
    toggleB.addEventListener("click", function () {
      scenarioB.classList.toggle("hidden");
    });
  }

  // --- Suporte: feedback ilustrativo ---
  const supportForm = document.querySelector("form.vendor-form");
  if (supportForm) {
    supportForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Mensagem recebida! (Formulário ilustrativo)");
      supportForm.reset();
    });
  }

  // --- Vitrine: cadastro ilustrativo ---
  const vendorForm = document.getElementById("vendorForm");
  if (vendorForm) {
    vendorForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Cadastro recebido! (Formulário ilustrativo)");
      vendorForm.reset();
    });
  }
});
