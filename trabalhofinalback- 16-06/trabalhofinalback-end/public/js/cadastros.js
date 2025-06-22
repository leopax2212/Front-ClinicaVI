// =======================
// 1. VACINA.HTML --- CADASTRO DE VACINA
// =======================
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-agendamento");
  const buscaInput = document.getElementById("buscaVacina");
  const tabela = document.getElementById("lista-vacinas");
  const paginacaoDiv = document.getElementById("paginacao");
  const token = localStorage.getItem("token");

  if (!form || !tabela || !paginacaoDiv) return; // Garante que é a página correta

  let vacinasSalvas = [];
  let vacinasFiltradas = [];
  let paginaAtual = 1;
  const vacinasPorPagina = 5;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nome = document.getElementById("vacina").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const fabricante = document.getElementById("fabricante").value.trim();
    const quantidadeDisponivel = parseInt(document.getElementById("quantidade").value);
    const reaplicacaoInput = document.getElementById("reaplicacao").value.trim();
    const diasParaReaplicacao = reaplicacaoInput ? parseInt(reaplicacaoInput) : null;

    const novaVacina = {
      nome,
      descricao,
      fabricante,
      quantidadeDisponivel,
      diasParaReaplicacao
    };

    try {
      const response = await fetch("http://localhost:8080/vacinas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify(novaVacina),
      });

      if (response.ok) {
        const vacinaSalva = await response.json();
        alert("Vacina cadastrada com sucesso!");
        vacinasSalvas.push(vacinaSalva);
        aplicarFiltroEBuildTabela();
        form.reset();
      } else {
        const erro = await response.text();
        alert("Erro ao cadastrar vacina: " + erro);
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      alert("Erro de conexão com o servidor.");
    }
  });

  if (buscaInput) {
    buscaInput.addEventListener("input", () => {
      paginaAtual = 1;
      aplicarFiltroEBuildTabela();
    });
  }

  async function carregarVacinasSalvas() {
    try {
      const response = await fetch("http://localhost:8080/vacinas", {
        headers: {
          "Authorization": "Bearer " + token
        }
      });

      if (response.ok) {
        vacinasSalvas = await response.json();
        aplicarFiltroEBuildTabela();
      } else {
        alert("Erro ao carregar vacinas salvas.");
      }
    } catch (err) {
      console.error("Erro ao buscar vacinas:", err);
      alert("Erro de conexão com o servidor.");
    }
  }

  function aplicarFiltroEBuildTabela() {
    const termo = buscaInput && buscaInput.value
      ? buscaInput.value.toLowerCase()
      : "";

    vacinasFiltradas = vacinasSalvas.filter(v =>
      v.nome && v.nome.toLowerCase().includes(termo)
    );

    construirTabela();
  }

  function construirTabela() {
    tabela.innerHTML = "";

    const inicio = (paginaAtual - 1) * vacinasPorPagina;
    const fim = inicio + vacinasPorPagina;
    const vacinasPagina = vacinasFiltradas.slice(inicio, fim);

    vacinasPagina.forEach(vacina => {
      const linha = document.createElement("tr");
      linha.innerHTML = `
        <td>${vacina.nome}</td>
        <td>${vacina.descricao}</td>
        <td>${vacina.fabricante}</td>
        <td>${vacina.quantidadeDisponivel}</td>
        <td>${vacina.diasParaReaplicacao ?? "-"}</td>
        <td><button class="btn-cancelar">Deletar</button></td>
      `;

      linha.querySelector(".btn-cancelar").addEventListener("click", async () => {
        if (confirm("Deseja realmente deletar esta vacina?")) {
          try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/vacinas/${vacina.id}`, {
              method: "DELETE",
              headers: {
                "Authorization": "Bearer " + token
              }
            });

            if (response.ok) {
              vacinasSalvas = vacinasSalvas.filter(v => v.id !== vacina.id);
              aplicarFiltroEBuildTabela();
              alert("Vacina deletada com sucesso.");
            } else {
              alert("Erro ao deletar vacina.");
            }
          } catch (err) {
            console.error("Erro ao deletar:", err);
            alert("Erro de conexão com o servidor.");
          }
        }
      });

      tabela.appendChild(linha);
    });

    construirPaginacao();
  }

  function construirPaginacao() {
    paginacaoDiv.innerHTML = "";

    const totalPaginas = Math.ceil(vacinasFiltradas.length / vacinasPorPagina);

    for (let i = 1; i <= totalPaginas; i++) {
      const botao = document.createElement("button");
      botao.textContent = i;
      botao.style.margin = "0 5px";
      botao.style.padding = "8px 12px";
      botao.style.border = "none";
      botao.style.borderRadius = "8px";
      botao.style.backgroundColor = i === paginaAtual ? "#0071e3" : "#ddd";
      botao.style.color = i === paginaAtual ? "#fff" : "#333";
      botao.style.cursor = "pointer";

      botao.addEventListener("click", () => {
        paginaAtual = i;
        construirTabela();
      });

      paginacaoDiv.appendChild(botao);
    }
  }

  carregarVacinasSalvas();
});

// =======================
// 1. DOENCAS.HTML --- CADASTRO DE DOENCA
// =======================
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-agendamento");
  const buscaInput = document.getElementById("buscaDoenca");
  const tabela = document.getElementById("lista-doencas");
  const paginacaoDiv = document.getElementById("paginacao");

  let doencasSalvas = [];
  let doencasFiltradas = [];
  let paginaAtual = 1;
  const doencasPorPagina = 5;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nomeDoenca = document.getElementById("nome").value.trim();
    const local = document.getElementById("local").value.trim();
    const casos = document.getElementById("casos").value.trim();
    const sintomasInput = document.getElementById("sintomas").value.trim();
    const sintomas = sintomasInput.split(",").map(s => s.trim());
    const medidas = document.getElementById("medidas").value.trim();
    const medidasPreventivas = medidas ? medidas.split(",").map(item => item.trim()) : [];

    const novaDoenca = { nomeDoenca, local, casos, sintomas, medidasPreventivas };


    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/doencas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify(novaDoenca),
      });

      if (response.ok) {
        const doencaSalva = await response.json();
        alert("Doença cadastrada com sucesso!");
        doencasSalvas.push(doencaSalva);
        aplicarFiltroEBuildTabela();
        form.reset();
      } else {
        const erro = await response.text();
        alert("Erro ao cadastrar doença: " + erro);
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      alert("Erro de conexão com o servidor.");
    }
  });

  buscaInput.addEventListener("input", () => {
    paginaAtual = 1;
    aplicarFiltroEBuildTabela();
  });

  async function carregarDoencasSalvas() {
    try {
      const response = await fetch("http://localhost:8080/doencas");
      if (response.ok) {
        doencasSalvas = await response.json();
        aplicarFiltroEBuildTabela();
      } else {
        alert("Erro ao carregar doenças salvas.");
      }
    } catch (err) {
      console.error("Erro ao buscar doenças:", err);
      alert("Erro de conexão com o servidor.");
    }
  }

  function aplicarFiltroEBuildTabela() {
    const termo = buscaInput.value.toLowerCase();
    doencasFiltradas = doencasSalvas.filter(
      (d) => (d.nome ?? "").toLowerCase().includes(termo)
    );
    construirTabela();
  }

  function construirTabela() {
    tabela.innerHTML = "";

    const inicio = (paginaAtual - 1) * doencasPorPagina;
    const fim = inicio + doencasPorPagina;
    const doencasPagina = doencasFiltradas.slice(inicio, fim);

    doencasPagina.forEach((doenca) => {
      const linha = document.createElement("tr");
      linha.innerHTML = `
        <td>${doenca.nomeDoenca}</td>
        <td>${doenca.local}</td>
        <td>${doenca.casos}</td>
        <td>${doenca.sintomas}</td>
        <td>${doenca.medidasPreventivas}</td>
        <td><button class="btn-cancelar">Deletar</button></td>
      `;

      linha.querySelector(".btn-cancelar").addEventListener("click", async () => {
        if (confirm("Deseja realmente deletar esta doença?")) {
          try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/doencas/${doenca.id}`, {
              method: "DELETE",
              headers: {
                "Authorization": "Bearer " + token
              }
            });
            if (response.ok) {
              doencasSalvas = doencasSalvas.filter((d) => d.id !== doenca.id);
              aplicarFiltroEBuildTabela();
              alert("Doença deletada com sucesso.");
            } else {
              alert("Erro ao deletar doença.");
            }
          } catch (err) {
            console.error("Erro ao deletar:", err);
            alert("Erro de conexão com o servidor.");
          }
        }
      });

      tabela.appendChild(linha);
    });

    construirPaginacao();
  }

  function construirPaginacao() {
    paginacaoDiv.innerHTML = "";

    const totalPaginas = Math.ceil(doencasFiltradas.length / doencasPorPagina);

    if (totalPaginas <= 1) {
      paginacaoDiv.style.display = "none";
      return;
    }

    paginacaoDiv.style.display = "block";

    for (let i = 1; i <= totalPaginas; i++) {
      const botao = document.createElement("button");
      botao.textContent = i;
      botao.style.margin = "0 5px";
      botao.style.padding = "8px 12px";
      botao.style.border = "none";
      botao.style.borderRadius = "8px";
      botao.style.backgroundColor = i === paginaAtual ? "#0071e3" : "#ddd";
      botao.style.color = i === paginaAtual ? "#fff" : "#333";
      botao.style.cursor = "pointer";

      botao.addEventListener("click", () => {
        paginaAtual = i;
        construirTabela();
      });

      paginacaoDiv.appendChild(botao);
    }
  }

  carregarDoencasSalvas();
});

