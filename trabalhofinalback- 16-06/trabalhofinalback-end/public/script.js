// =======================
// 1. Navbar (header.html)
// =======================
function carregarNavbar() {
  fetch("header.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("navbar-placeholder").innerHTML = data;

      const hamburger = document.querySelector(".vi-hamburger");
      const navLinks = document.querySelector(".vi-nav-links");
      const dropdown = document.getElementById("dropdownMenu");

      hamburger?.addEventListener("click", () => {
        navLinks?.classList.toggle("ativo");
        if (dropdown) {
          dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
        }
      });

      document.addEventListener("click", (e) => {
        if (dropdown && !dropdown.contains(e.target) && !hamburger.contains(e.target)) {
          dropdown.style.display = "none";
        }
      });
    });
}

//index.html --- transcrição de tela

document.addEventListener("DOMContentLoaded", () => {
  const leiaMaisBtn = document.getElementById("leiaMaisBtn");
  const voltarBtn = document.getElementById("voltarBtn");
  const slider = document.querySelector(".slider");

  // Mostra a segunda tela
  leiaMaisBtn.addEventListener("click", (e) => {
    e.preventDefault();
    slider.style.transform = "translateX(-100vw)";
    voltarBtn.classList.add("show");
  });

  // Volta para a primeira tela
  voltarBtn.addEventListener("click", () => {
    slider.style.transform = "translateX(0)";
    voltarBtn.classList.remove("show");
  });

  // Carregar navbar
  fetch("header.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("navbar-placeholder").innerHTML = data;
    });
});

// ============================
// 2. Agendamento (agendamento.html)
// ============================
function carregarPacientes(select, token) {
  fetch("http://localhost:8080/api/pacientes", {
    headers: { "Authorization": "Bearer " + token }
  })
    .then(res => res.json())
    .then(pacientes => {
      select.innerHTML = '<option value="" disabled selected>Selecione um paciente</option>';
      pacientes.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = p.nome;
        select.appendChild(option);
      });
    });
}

function carregarVacinas(select, token) {
  fetch("http://localhost:8080/vacinas", {
    headers: { "Authorization": "Bearer " + token }
  })
    .then(res => res.json())
    .then(vacinas => {
      select.innerHTML = '<option value="" disabled selected>Selecione uma vacina</option>';
      vacinas.forEach(v => {
        const option = document.createElement('option');
        option.value = v.id;
        option.textContent = v.nome;
        select.appendChild(option);
      });
    });
}

function preencherHorarios(select) {
  for (let hora = 8; hora <= 17; hora++) {
    ["00", "30"].forEach(min => {
      const horaFormatada = `${hora.toString().padStart(2, "0")}:${min}`;
      const option = document.createElement("option");
      option.value = horaFormatada;
      option.textContent = horaFormatada;
      select.appendChild(option);
    });
  }
}

function inicializarAgendamento(form) {
  const pacienteSelect = document.getElementById('nome');
  const vacinaSelect = document.getElementById('vacina');
  const dataInput = document.getElementById('data');
  const horarioSelect = document.getElementById('horario');
  const token = localStorage.getItem("token");

  carregarPacientes(pacienteSelect, token);
  carregarVacinas(vacinaSelect, token);
  preencherHorarios(horarioSelect);

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const agendamento = {
      pacienteId: pacienteSelect.value,
      vacinaId: vacinaSelect.value,
      dataAplicacao: dataInput.value,
      hora: horarioSelect.value
    };

    console.log("Agendamento enviado:", agendamento);

    fetch("http://localhost:8080/api/agendamentos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(agendamento)
    })
    .then(res => {
      if (res.ok) {
        alert("Agendamento realizado com sucesso!");
        form.reset();
      } else {
        return res.text().then(text => {
          let message = "Erro ao agendar.";
          try {
            const json = JSON.parse(text);
            message += " " + (json.message || res.status);
          } catch (e) {
            message += " Código: " + res.status;
          }
          alert(message);
        });
      }
    })
    .catch(err => {
      console.error("Erro na requisição:", err);
      alert("Erro na requisição.");
    });
  });
}

//Tabela

function preencherTabelasComAPI(filtroTipo, dataInicio, dataFim) {
  const tbody = document.querySelector("#lista-agendamentos");
  if (!tbody) return;

  tbody.innerHTML = "";
  const token = localStorage.getItem("token");

  fetch("http://localhost:8080/api/agendamentos", {
    headers: { "Authorization": "Bearer " + token }
  })
    .then(res => res.json())
    .then(agendamentos => {
      agendamentos.forEach(ag => {
        const dataStr = ag.dataAplicacao;
        const nomeVacina = ag.vacinaNome || `Vacina ID ${ag.vacinaId}`;
        const nomePaciente = ag.pacienteNome || `Paciente ID ${ag.pacienteId}`;
        const horario = ag.hora || "-";

        const dt = new Date(dataStr);
        const dentroIntervalo = (!dataInicio || dt >= new Date(dataInicio)) &&
                                (!dataFim || dt <= new Date(dataFim));

        if (!dentroIntervalo) return;

        if (filtroTipo === "todos" || 
            (filtroTipo === "aplicada" && ag.status === "CONFIRMADO") ||
            (filtroTipo === "agendada" && ag.status !== "CONFIRMADO")) {

          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${nomePaciente}</td>
            <td>${formatarData(dataStr)}</td>
            <td>${horario}</td>
            <td>${nomeVacina}</td>
          `;
          tbody.appendChild(tr);
        }
      });
    })
    .catch(err => {
      console.error("Erro ao buscar agendamentos:", err);
    });
}

// ===========================
// 3. Caderno de Vacinas (caderno.html)
// ===========================
function formatarData(dataStr) {
  const data = new Date(dataStr);
  return data.toLocaleDateString("pt-BR");
}

function preencherTabelas(filtroTipo, dataInicio, dataFim) {
  const tbodyAplicadas = document.querySelector("#tabelaAplicadas tbody");
  const tbodyAgendadas = document.querySelector("#tabelaAgendadas tbody");

  if (!tbodyAplicadas || !tbodyAgendadas) return;

  tbodyAplicadas.innerHTML = "";
  tbodyAgendadas.innerHTML = "";

  const vacinasAplicadas = [
    { nome: "Influenza", data: "2025-03-10", status: "aplicada" },
    { nome: "Hepatite B", data: "2025-01-15", status: "aplicada" },
    { nome: "Tétano", data: "2024-10-20", status: "aplicada" },
  ];

  const vacinasAgendadas = [
    { nome: "Influenza", data: "2025-06-15", status: "agendada" },
    { nome: "COVID-19", data: "2025-07-01", status: "agendada" },
  ];

  function dataNoIntervalo(dataStr) {
    if (!dataInicio && !dataFim) return true;
    const dt = new Date(dataStr);
    if (dataInicio && dt < new Date(dataInicio)) return false;
    if (dataFim && dt > new Date(dataFim)) return false;
    return true;
  }

  vacinasAplicadas.forEach(v => {
    if ((filtroTipo === "todos" || filtroTipo === "aplicada") && dataNoIntervalo(v.data)) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${v.nome}</td>
        <td>${formatarData(v.data)}</td>
        <td><span class="badge-aplicada">Aplicada</span></td>
      `;
      tbodyAplicadas.appendChild(tr);
    }
  });

  vacinasAgendadas.forEach(v => {
    if ((filtroTipo === "todos" || filtroTipo === "agendada") && dataNoIntervalo(v.data)) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${v.nome}</td>
        <td>${formatarData(v.data)}</td>
        <td><span class="badge-agendada">Agendada</span></td>
      `;
      tbodyAgendadas.appendChild(tr);
    }
  });
}

function aplicarFiltros() {
  const filtroTipo = document.getElementById("filtroTipo").value;
  const dataInicio = document.getElementById("dataInicio").value;
  const dataFim = document.getElementById("dataFim").value;
  preencherTabelas(filtroTipo, dataInicio, dataFim);
}

function limparFiltros() {
  document.getElementById("filtroTipo").value = "todos";
  document.getElementById("dataInicio").value = "";
  document.getElementById("dataFim").value = "";
  preencherTabelas("todos");
}

// ===========================
// 4. DOMContentLoaded principal
// ===========================
document.addEventListener("DOMContentLoaded", () => {
  carregarNavbar();

  const formAgendamento = document.getElementById("form-agendamento");
  if (formAgendamento) inicializarAgendamento(formAgendamento);

  if (document.getElementById("tabelaAplicadas")) preencherTabelasComAPI("todos");
});

function aplicarFiltros() {
  const filtroTipo = document.getElementById("filtroTipo").value;
  const dataInicio = document.getElementById("dataInicio").value;
  const dataFim = document.getElementById("dataFim").value;
  preencherTabelasComAPI(filtroTipo, dataInicio, dataFim);
}

