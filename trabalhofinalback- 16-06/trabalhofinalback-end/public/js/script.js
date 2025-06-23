// =======================
// 1. Navbar (header.html)
// =======================
function carregarNavbar() {
  fetch("../header.html")
    .then((res) => res.text())
    .then((data) => {
      const navbar = document.getElementById("navbar-placeholder");
      if (navbar) navbar.innerHTML = data;

      const hamburger = document.querySelector(".vi-hamburger");
      const navLinks = document.querySelector(".vi-nav-links");
      const dropdown = document.getElementById("dropdownMenu");

      hamburger?.addEventListener("click", () => {
        navLinks?.classList.toggle("ativo");
        if (dropdown) {
          dropdown.style.display =
            dropdown.style.display === "block" ? "none" : "block";
        }
      });

      document.addEventListener("click", (e) => {
        if (
          dropdown &&
          !dropdown.contains(e.target) &&
          !hamburger.contains(e.target)
        ) {
          dropdown.style.display = "none";
        }
      });

      const nomeUsuario = localStorage.getItem("nomeUsuario");
      const nomeElemento = document.getElementById("nome-usuario");

      if (nomeUsuario && nomeElemento) {
        nomeElemento.textContent = nomeUsuario;
      }
    });
}

// ===========================
// 2. Tela Inicial (index.html)
// ===========================
function configurarTelaInicial() {
  const leiaMaisBtn = document.getElementById("leiaMaisBtn");
  const voltarBtn = document.getElementById("voltarBtn");
  const slider = document.querySelector(".slider");

  if (leiaMaisBtn && voltarBtn && slider) {
    leiaMaisBtn.addEventListener("click", (e) => {
      e.preventDefault();
      slider.style.transform = "translateX(-100vw)";
      voltarBtn.classList.add("show");
    });

    voltarBtn.addEventListener("click", () => {
      slider.style.transform = "translateX(0)";
      voltarBtn.classList.remove("show");
    });
  }
}

// =======================
// 3. Agendamento (agendamento.html)
// =======================
function carregarPacientes(select, token) {
  if (!select || !token) return;
  fetch("http://localhost:8080/api/pacientes", {
    headers: { Authorization: "Bearer " + token },
  })
    .then((res) => res.json())
    .then((pacientes) => {
      select.innerHTML =
        '<option value="" disabled selected>Selecione um paciente</option>';
      pacientes.forEach((p) => {
        const option = document.createElement("option");
        option.value = p.id;
        option.textContent = p.nome;
        select.appendChild(option);
      });
    });
}

function carregarVacinas(select, token) {
  if (!select || !token) return;
  fetch("http://localhost:8080/vacinas", {
    headers: { Authorization: "Bearer " + token },
  })
    .then((res) => res.json())
    .then((vacinas) => {
      select.innerHTML =
        '<option value="" disabled selected>Selecione uma vacina</option>';
      vacinas.forEach((v) => {
        const option = document.createElement("option");
        option.value = v.id;
        option.textContent = v.nome;
        select.appendChild(option);
      });
    });
}

function preencherHorarios(select) {
  if (!select) return;
  for (let hora = 8; hora <= 17; hora++) {
    ["00", "30"].forEach((min) => {
      const horaFormatada = `${hora.toString().padStart(2, "0")}:${min}`;
      const option = document.createElement("option");
      option.value = horaFormatada;
      option.textContent = horaFormatada;
      select.appendChild(option);
    });
  }
}

function inicializarAgendamento(form) {
  if (!form) return;

  const pacienteSelect = document.getElementById("nome");
  const vacinaSelect = document.getElementById("vacina");
  const dataInput = document.getElementById("data");
  const horarioSelect = document.getElementById("horario");
  const submitBtn = form.querySelector("button[type='submit']");
  const token = localStorage.getItem("token");

  if (
    !pacienteSelect ||
    !vacinaSelect ||
    !dataInput ||
    !horarioSelect ||
    !token
  )
    return;

  carregarPacientes(pacienteSelect, token);
  carregarVacinas(vacinaSelect, token);
  preencherHorarios(horarioSelect);

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const agendamento = {
      pacienteId: pacienteSelect.value,
      vacinaId: vacinaSelect.value,
      dataAplicacao: dataInput.value,
      hora: horarioSelect.value,
    };

    submitBtn.disabled = true;

    fetch("http://localhost:8080/api/agendamentos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(agendamento),
    })
      .then((res) => {
        submitBtn.disabled = false;
        if (res.ok) {
          alert("Agendamento realizado com sucesso!");
          form.reset();
          carregarAgendamentos();
        } else {
          return res.text().then((text) => {
            alert(text || `Erro ao agendar. Código: ${res.status}`);
          });
        }
      })
      .catch((err) => {
        console.error("Erro na requisição:", err);
        alert("Erro na requisição.");
        submitBtn.disabled = false;
      });
  });
}

function filtrarAgendamentos() {
  const filtro = document
    .getElementById("buscaAgendamento")
    .value.toLowerCase();
  const linhas = document.querySelectorAll("#tabela-agendamentos tbody tr");

  linhas.forEach((linha) => {
    const nomePaciente =
      linha.querySelector("td")?.textContent?.toLowerCase() || "";
    linha.style.display = nomePaciente.includes(filtro) ? "" : "none";
  });
}

// Conectar ao campo de input
document.addEventListener("DOMContentLoaded", () => {
  const campoBusca = document.getElementById("buscaAgendamento");
  if (campoBusca) {
    campoBusca.addEventListener("input", filtrarAgendamentos);
  }
});

// ==============================
// 3. Listagem e Paginação
// ==============================
let agendamentosSalvos = [];
let agendamentosFiltrados = [];
let paginaAtual = 1;
const porPagina = 5;

async function carregarAgendamentos() {
  const token = localStorage.getItem("token");
  const usuarioId = localStorage.getItem("usuarioId");
  if (!token || !usuarioId || !document.getElementById("lista-agendamentos"))
    return;

  try {
    const response = await fetch(
      `http://localhost:8080/api/agendamentos/usuario/${usuarioId}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    if (!response.ok) throw new Error("Erro ao carregar agendamentos");

    agendamentosSalvos = await response.json();
    aplicarPaginacao();
  } catch (error) {
    console.error("Erro ao carregar agendamentos:", error);
  }
}

function aplicarPaginacao() {
  const tbody = document.getElementById("lista-agendamentos");
  const paginacaoDiv = document.getElementById("paginacao");
  if (!tbody || !paginacaoDiv) return;

  agendamentosFiltrados = [...agendamentosSalvos];
  const total = agendamentosFiltrados.length;
  const totalPaginas = Math.ceil(total / porPagina);
  const inicio = (paginaAtual - 1) * porPagina;
  const fim = inicio + porPagina;

  const agendamentosPagina = agendamentosFiltrados.slice(inicio, fim);

  tbody.innerHTML = "";

  agendamentosPagina.forEach((agendamento) => {
    const tr = document.createElement("tr");
    const statusClasse = agendamento.status.toLowerCase();
    tr.innerHTML = `
      <td>${agendamento.pacienteNome}</td>
      <td>${formatarData(agendamento.dataAplicacao)}</td>
      <td>${agendamento.hora || "-"}</td>
      <td>${agendamento.vacinaNome}</td>
      <td><span class="status ${statusClasse}">${agendamento.status}</span></td>
      <td>
        ${
          agendamento.status === "AGENDADO"
            ? `<button class="btn-cancelar" data-id="${agendamento.id}">Cancelar</button>`
            : "-"
        }
      </td>
    `;

    const btnCancelar = tr.querySelector(".btn-cancelar");
    if (btnCancelar) {
      btnCancelar.addEventListener("click", () => {
        if (confirm("Tem certeza que deseja cancelar este agendamento?")) {
          cancelarAgendamento(agendamento.id);
        }
      });
    }

    tbody.appendChild(tr);
  });

  // Paginação
  paginacaoDiv.innerHTML = "";
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
      aplicarPaginacao();
    });

    paginacaoDiv.appendChild(botao);
  }
}

function cancelarAgendamento(id) {
  const token = localStorage.getItem("token");
  fetch(`http://localhost:8080/api/agendamentos/${id}/cancelar`, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => {
      if (res.ok) {
        alert("Agendamento cancelado!");
        carregarAgendamentos();
      } else {
        alert("Erro ao cancelar agendamento.");
      }
    })
    .catch((err) => {
      console.error(err);
      alert("Erro no cancelamento.");
    });
}

function formatarData(dataISO) {
  const data = new Date(dataISO);
  return data.toLocaleDateString("pt-BR");
}

// ===============================
// 4. Caderno de Vacinas (Mockado) (caderno.html)
// ===============================
async function preencherTabelas(filtroTipo, dataInicio, dataFim) {
  const tbodyAplicadas = document.querySelector("#tabelaAplicadas tbody");
  const tbodyAgendadas = document.querySelector("#tabelaAgendadas tbody");
  if (!tbodyAplicadas || !tbodyAgendadas) return;

  tbodyAplicadas.innerHTML = "";
  tbodyAgendadas.innerHTML = "";

  const token = localStorage.getItem("token");
  const usuarioId = localStorage.getItem("usuarioId"); // ← AGORA USAMOS usuarioId

  if (!token || !usuarioId) {
    alert("Usuário não autenticado.");
    return;
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // ← USANDO novo endpoint com usuarioId
  const [aplicadas, agendadas] = await Promise.all([
    fetch(
      `http://localhost:8080/api/agendamentos/usuario/${usuarioId}/status/APLICADA`,
      { headers }
    ).then((res) => res.json()),
    fetch(
      `http://localhost:8080/api/agendamentos/usuario/${usuarioId}/status/AGENDADO`,
      { headers }
    ).then((res) => res.json()),
  ]);

  function dataNoIntervalo(dataStr) {
    const dt = new Date(dataStr);
    if (dataInicio && dt < new Date(dataInicio)) return false;
    if (dataFim && dt > new Date(dataFim)) return false;
    return true;
  }

  aplicadas.forEach((v) => {
    if (
      (filtroTipo === "todos" || filtroTipo === "aplicada") &&
      dataNoIntervalo(v.dataAplicacao)
    ) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${v.vacinaNome}</td>
        <td>${formatarData(v.dataAplicacao)}</td>
        <td>${v.hora}</td>
        <td><span class="badge-aplicada">Aplicada</span></td>
      `;
      tbodyAplicadas.appendChild(tr);
    }
  });

  agendadas.forEach((v) => {
    if (
      (filtroTipo === "todos" || filtroTipo === "agendada") &&
      dataNoIntervalo(v.dataAplicacao)
    ) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${v.vacinaNome}</td>
        <td>${formatarData(v.dataAplicacao)}</td>
        <td>${v.hora}</td>
        <td><span class="badge-agendada">Agendada</span></td>
      `;
      tbodyAgendadas.appendChild(tr);
    }
  });
}

async function carregarAgendamentosAtrasados() {
  const tbodyAtrasadas = document.querySelector("#tabelaAtrasadas tbody");
  if (!tbodyAtrasadas) return;

  tbodyAtrasadas.innerHTML = "";

  const token = localStorage.getItem("token");
  const usuarioId = localStorage.getItem("usuarioId");

  if (!token || !usuarioId) {
    alert("Usuário não autenticado.");
    return;
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const res = await fetch(
      `http://localhost:8080/api/agendamentos/usuario/${usuarioId}/atrasados`,
      { headers }
    );

    if (!res.ok) {
      const erro = await res.text();
      throw new Error(erro);
    }

    const atrasados = await res.json();

    atrasados.forEach((v) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${v.vacinaNome}</td>
        <td>${formatarData(v.dataAplicacao)}</td>
        <td>${v.hora}</td>
        <td><span class="badge-atrasada">Atrasada</span></td>
      `;
      tbodyAtrasadas.appendChild(tr);
    });
  } catch (err) {
    console.error("Erro ao carregar atrasados:", err.message);
  }
}

async function preencherNotificacoesAtraso() {
  const divNotificacoes = document.getElementById("areaNotificacoes");
  if (!divNotificacoes) return;

  const token = localStorage.getItem("token");
  const usuarioId = localStorage.getItem("usuarioId");

  if (!token || !usuarioId) {
    divNotificacoes.innerHTML = "<p>Usuário não autenticado.</p>";
    return;
  }

  const headers = { Authorization: `Bearer ${token}` };

  try {
    const res = await fetch(
      `http://localhost:8080/api/agendamentos/usuario/${usuarioId}/atrasados`,
      {
        headers,
      }
    );

    if (!res.ok) throw new Error("Erro ao buscar vacinas em atraso");

    const atrasados = await res.json();

    divNotificacoes.innerHTML = "";

    if (!atrasados.length) {
      divNotificacoes.innerHTML =
        "<p>Nenhuma vacina agendada está atrasada.</p>";
      return;
    }

    atrasados.forEach((vacina) => {
      const p = document.createElement("p");
      p.innerHTML = `⚠️ A vacina <strong>${
        vacina.vacinaNome
      }</strong> estava agendada para <strong>${formatarData(
        vacina.dataAplicacao
      )}</strong> e ainda não foi aplicada.`;
      divNotificacoes.appendChild(p);
    });
  } catch (error) {
    console.error("Erro ao carregar notificações:", error);
    divNotificacoes.innerHTML =
      "<p>Erro ao carregar notificações de atraso.</p>";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  //preencherTabelas("todos");
  carregarAgendamentosAtrasados(); // ← ESSENCIAL
  preencherNotificacoesAtraso();
});

function aplicarFiltros() {
  const tipo = document.getElementById("filtroTipo").value;
  const inicio = document.getElementById("dataInicio").value;
  const fim = document.getElementById("dataFim").value;
  preencherTabelas(tipo, inicio, fim);
}

function limparFiltros() {
  document.getElementById("filtroTipo").value = "todos";
  document.getElementById("dataInicio").value = "";
  document.getElementById("dataFim").value = "";
  preencherTabelas("todos");
}

// ===============================
// 5. DOMContentLoaded Único
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  carregarNavbar();
  configurarTelaInicial();

  const formAgendamento = document.getElementById("form-agendamento");
  if (formAgendamento) inicializarAgendamento(formAgendamento);

  if (document.getElementById("lista-agendamentos")) carregarAgendamentos();
  if (document.getElementById("tabelaAplicadas")) preencherTabelas("todos");
});
