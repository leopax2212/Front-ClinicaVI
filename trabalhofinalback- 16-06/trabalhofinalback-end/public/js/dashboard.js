document.addEventListener("DOMContentLoaded", () => {
  carregarVacinas();
  buscarDashboard();
});

function carregarVacinas() {
  fetch("http://localhost:8080/api/vacinas")
    .then(res => res.json())
    .then(vacinas => {
      const select = document.getElementById("vacinaSelect");
      vacinas.forEach(v => {
        const opt = document.createElement("option");
        opt.value = v.nome; // ajuste conforme necessário
        opt.innerText = v.nome;
        select.appendChild(opt);
      });
    })
    .catch(() => alert("Erro ao carregar vacinas."));
}

function buscarDashboard() {
  const inicio = document.getElementById("dataInicio").value;
  const fim = document.getElementById("dataFim").value;
  const vacina = document.getElementById("vacinaSelect").value;

  const params = new URLSearchParams();
  if (inicio) params.append("dataInicio", inicio);
  if (fim) params.append("dataFim", fim);
  if (vacina) params.append("vacina", vacina);

  fetch(`http://localhost:8080/api/dashboard?${params.toString()}`)
    .then(res => res.json())
    .then(dados => {
      document.getElementById("totalCard").innerText = `Total: ${dados.total}`;
      document.getElementById("maisAgendadaCard").innerText = `Mais agendada: ${dados.vacinaMaisAgendada}`;

      atualizarGraficoLinha(dados.agendamentosPorDia);
      atualizarGraficoPizza(dados.vacinas);
      preencherTabela(dados.agendamentos);
    })
    .catch(() => alert("Erro ao buscar dados do dashboard."));
}

function atualizarGraficoLinha(dados) {
  const ctx = document.getElementById("graficoLinha").getContext("2d");
  if (window.linhaChart) window.linhaChart.destroy();
  window.linhaChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: Object.keys(dados),
      datasets: [{
        label: "Agendamentos por dia",
        data: Object.values(dados),
        borderColor: "#007aff",
        backgroundColor: "rgba(0,122,255,0.1)",
        tension: 0.4,
        fill: true
      }]
    }
  });
}

function atualizarGraficoPizza(dados) {
  const ctx = document.getElementById("graficoPizza").getContext("2d");
  if (window.pizzaChart) window.pizzaChart.destroy();
  window.pizzaChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(dados),
      datasets: [{
        data: Object.values(dados),
        backgroundColor: ["#007aff", "#ff9500", "#34c759", "#ff3b30"]
      }]
    }
  });
}

function preencherTabela(agendamentos) {
  const tbody = document.querySelector("#tabelaAgendamentos tbody");
  tbody.innerHTML = "";
  agendamentos.forEach(a => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${a.paciente.nome}</td><td>${a.vacina.nome}</td><td>${a.data}</td>`;
    tbody.appendChild(tr);
  });
}
