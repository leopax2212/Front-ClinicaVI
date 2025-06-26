// =======================
// 1. VACINA.HTML --- CADASTRO DE VACINA
// =======================
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-agendamento");
  const buscaInput = document.getElementById("buscaVacina");
  const tabela = document.getElementById("lista-vacinas");
  const paginacaoDiv = document.getElementById("paginacao");
  const token = localStorage.getItem("token");
  const btnSubmit = form.querySelector("button[type='submit']");

  let vacinaEditandoId = null;
  let vacinasSalvas = [];
  let vacinasFiltradas = [];
  let paginaAtual = 1;
  const vacinasPorPagina = 5;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nome = document.getElementById("vacina").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const fabricante = document.getElementById("fabricante").value.trim();
    const quantidadeDisponivel = parseInt(
      document.getElementById("quantidade").value
    );
    const reaplicacaoInput = document
      .getElementById("reaplicacao")
      .value.trim();
    const diasParaReaplicacao = reaplicacaoInput
      ? parseInt(reaplicacaoInput)
      : null;

    const novaVacina = {
      nome,
      descricao,
      fabricante,
      quantidadeDisponivel,
      diasParaReaplicacao,
    };

    const method = vacinaEditandoId ? "PUT" : "POST";
    const url = vacinaEditandoId
      ? `http://localhost:8080/vacinas/${vacinaEditandoId}`
      : "http://localhost:8080/vacinas";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(novaVacina),
      });

      if (response.ok) {
        const vacinaSalva = await response.json();
        alert(
          vacinaEditandoId
            ? "Vacina atualizada com sucesso!"
            : "Vacina cadastrada com sucesso!"
        );

        if (vacinaEditandoId) {
          const index = vacinasSalvas.findIndex((v) => v.id === vacinaSalva.id);
          if (index !== -1) vacinasSalvas[index] = vacinaSalva;
        } else {
          vacinasSalvas.push(vacinaSalva);
        }

        aplicarFiltroEBuildTabela();
        form.reset();
        vacinaEditandoId = null;
        btnSubmit.textContent = "Confirmar Cadastro";
      } else {
        const erro = await response.text();
        alert("Erro ao salvar vacina: " + erro);
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
          Authorization: "Bearer " + token,
        },
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
    const termo =
      buscaInput && buscaInput.value ? buscaInput.value.toLowerCase() : "";

    vacinasFiltradas = vacinasSalvas.filter(
      (v) => v.nome && v.nome.toLowerCase().includes(termo)
    );

    construirTabela();
  }

  function construirTabela() {
    tabela.innerHTML = "";

    const totalPaginas = Math.ceil(vacinasFiltradas.length / vacinasPorPagina);
    if (paginaAtual > totalPaginas && totalPaginas > 0) {
      paginaAtual = totalPaginas;
    }

    const inicio = (paginaAtual - 1) * vacinasPorPagina;
    const fim = inicio + vacinasPorPagina;
    const vacinasPagina = vacinasFiltradas.slice(inicio, fim);

    vacinasPagina.forEach((vacina) => {
      const linha = document.createElement("tr");
      linha.innerHTML = `
       <td>${vacina.nome}</td>
       <td>${vacina.descricao}</td>
       <td>${vacina.fabricante}</td>
       <td>${vacina.quantidadeDisponivel}</td>
       <td>${vacina.diasParaReaplicacao ?? "-"}</td>
       <td>
         <button class="btn-editar" style="background: none; border: none; cursor: pointer;">
           <i class="fas fa-pencil-alt" style="color: gray;"></i>
         </button>
         <button class="btn-deletar" style="background: none; border: none; cursor: pointer; margin-left: 8px;">
           <i class="fas fa-trash-alt" style="color: red;"></i>
         </button>
       </td>
     `;

      // Deletar vacina
      linha.querySelector(".btn-deletar").addEventListener("click", async () => {
        if (confirm("Deseja realmente deletar esta vacina?")) {
          try {
            const response = await fetch(
              `http://localhost:8080/vacinas/${vacina.id}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: "Bearer " + token,
                },
              }
            );

            if (response.ok) {
              vacinasSalvas = vacinasSalvas.filter((v) => v.id !== vacina.id);
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

      // Editar vacina
      linha.querySelector(".btn-editar").addEventListener("click", () => {
        preencherFormularioEdicao(vacina);
      });

      tabela.appendChild(linha);
    });

    construirPaginacao();
  }

  function construirPaginacao() {
    paginacaoDiv.innerHTML = "";
    const totalPaginas = Math.ceil(vacinasFiltradas.length / vacinasPorPagina);

    paginacaoDiv.style.display = totalPaginas > 1 ? "flex" : "none";

    for (let i = 1; i <= totalPaginas; i++) {
      const botao = document.createElement("button");
      botao.textContent = i;
      botao.classList.toggle("active", i === paginaAtual);

      botao.addEventListener("click", () => {
        paginaAtual = i;
        construirTabela();
      });

      paginacaoDiv.appendChild(botao);
    }
  }

  function preencherFormularioEdicao(vacina) {
    vacinaEditandoId = vacina.id;

    document.getElementById("vacina").value = vacina.nome;
    document.getElementById("descricao").value = vacina.descricao;
    document.getElementById("fabricante").value = vacina.fabricante;
    document.getElementById("quantidade").value = vacina.quantidadeDisponivel;
    document.getElementById("reaplicacao").value =
      vacina.diasParaReaplicacao ?? "";

    btnSubmit.textContent = "Atualizar Vacina";

    form.scrollIntoView({ behavior: "smooth" });
  }

  carregarVacinasSalvas();
});

// =======================
// 2. DOENCAS.HTML --- CADASTRO DE DOENCA
// =======================
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-agendamento");
  const buscaInput = document.getElementById("buscaDoenca");
  const tabela = document.getElementById("lista-doencas");
  const paginacaoDiv = document.getElementById("paginacao");
  const token = localStorage.getItem("token");

  let doencasSalvas = [];
  let doencasFiltradas = [];
  let paginaAtual = 1;
  const doencasPorPagina = 5;
  let doencaEditandoId = null;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nomeDoenca = document.getElementById("nome").value.trim();
    const local = document.getElementById("local").value.trim();
    const casos = document.getElementById("casos").value.trim();
    const sintomas = document
      .getElementById("sintomas")
      .value.split(",")
      .map((s) => s.trim());
    const medidasPreventivas = document
      .getElementById("medidas")
      .value.split(",")
      .map((m) => m.trim());

    const novaDoenca = {
      nomeDoenca,
      local,
      casos,
      sintomas,
      medidasPreventivas,
    };

    try {
      const url = doencaEditandoId
        ? `http://localhost:8080/doencas/${doencaEditandoId}`
        : "http://localhost:8080/doencas";

      const method = doencaEditandoId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(novaDoenca),
      });

      if (response.ok) {
        const doencaSalva = await response.json();

        if (doencaEditandoId) {
          doencasSalvas = doencasSalvas.map((d) =>
            d.id === doencaEditandoId ? doencaSalva : d
          );
          alert("Doença atualizada com sucesso!");
        } else {
          doencasSalvas.push(doencaSalva);
          alert("Doença cadastrada com sucesso!");
        }

        doencaEditandoId = null;
        form.reset();
        aplicarFiltroEBuildTabela();
      } else {
        const erro = await response.text();
        alert("Erro ao salvar doença: " + erro);
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
      const response = await fetch("http://localhost:8080/doencas", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

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
    doencasFiltradas = doencasSalvas.filter((d) =>
      (d.nomeDoenca ?? "").toLowerCase().includes(termo)
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
        <td>${doenca.sintomas?.join(", ")}</td>
        <td>${doenca.medidasPreventivas?.join(", ")}</td>
        <td>
         <button class="btn-editar" style="background: none; border: none; cursor: pointer;">
           <i class="fas fa-pencil-alt" style="color: gray;"></i>
         </button>
         <button class="btn-deletar" style="background: none; border: none; cursor: pointer; margin-left: 8px;">
           <i class="fas fa-trash-alt" style="color: red;"></i>
         </button>
       </td>
      `;

      // Botão editar
      linha.querySelector(".btn-editar").addEventListener("click", () => {
        preencherFormularioEdicao(doenca);
      });

      // Botão deletar
      linha.querySelector(".btn-deletar").addEventListener("click", async () => {
        if (confirm("Deseja realmente deletar esta doença?")) {
          try {
            const response = await fetch(
              `http://localhost:8080/doencas/${doenca.id}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: "Bearer " + token,
                },
              }
            );

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

  function preencherFormularioEdicao(doenca) {
    doencaEditandoId = doenca.id;

    document.getElementById("nome").value = doenca.nomeDoenca;
    document.getElementById("local").value = doenca.local;
    document.getElementById("casos").value = doenca.casos;
    document.getElementById("sintomas").value = doenca.sintomas?.join(", ");
    document.getElementById("medidas").value = doenca.medidasPreventivas?.join(", ");

    document.getElementById("form-agendamento").scrollIntoView({ behavior: "smooth" });
  }

  function construirPaginacao() {
    paginacaoDiv.innerHTML = "";

    const totalPaginas = Math.ceil(doencasFiltradas.length / doencasPorPagina);

    if (totalPaginas <= 1) {
      paginacaoDiv.style.display = "none";
      return;
    }

    paginacaoDiv.style.display = "flex";

    for (let i = 1; i <= totalPaginas; i++) {
      const botao = document.createElement("button");
      botao.textContent = i;
      botao.classList.toggle("active", i === paginaAtual);

      botao.addEventListener("click", () => {
        paginaAtual = i;
        construirTabela();
      });

      paginacaoDiv.appendChild(botao);
    }
  }

  carregarDoencasSalvas();
});

