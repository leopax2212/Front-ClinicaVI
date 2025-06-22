//usuarios.html --- configuração da lista de usuários

if (document.getElementById("userList")) {
  let users = [];

  const token = localStorage.getItem("token");

  fetch("http://localhost:8080/api/usuarios", {
    headers: {
      "Authorization": `Bearer ${token}` 
    }
  })
    .then((res) => {
      if (!res.ok) throw new Error("Falha na requisição: " + res.status);
      return res.json();
    })
    .then((data) => {
      users = data;
      renderUsers();
    })
    .catch((error) => {
      console.error("Erro ao carregar usuários:", error);
    });

  function renderUsers() {
    const userList = document.getElementById("userList");
    userList.innerHTML = "";

    users.forEach((user, index) => {
      const div = document.createElement("div");
      div.className = "user";

      div.innerHTML = `
          <div class="user-info">
            <span><strong>Nome:</strong> ${user.nome}</span>
            <span><strong>Email:</strong> ${user.email}</span>
            <span><strong>Tipo:</strong> ${user.tipo}</span>
          </div>
          <div class="user-actions">
            <button class="admin-btn" onclick="toggleTipo(${index})">
              Tornar ${user.tipo === "ADMIN" ? "PACIENTE" : "ADMIN"}
            </button>
            <button class="delete-btn" onclick="deleteUser(${index})">
              Excluir
            </button>
          </div>
        `;

      userList.appendChild(div);
    });
  }

  window.toggleTipo = function (index) {
    const user = users[index];
    const novoTipo = user.tipo === "ADMIN" ? "PACIENTE" : "ADMIN";

    fetch(`http://localhost:8080/api/usuarios/${user.id}`, { 
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify({ ...user, tipo: novoTipo })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.mensagem);
        user.tipo = data.usuario.tipo;
        renderUsers();
      })
      .catch((err) => {
        alert("Não foi possível atualizar o tipo: " + err.message);
      });
  }
}

//listaage.html --- configuração lista agendamentos

if (document.getElementById("agendamentoList")) {
  document.addEventListener("DOMContentLoaded", () => {
    renderAgendamentos();
  });

  async function renderAgendamentos() {
    const list = document.getElementById("agendamentoList");
    const token = localStorage.getItem("token");

    if (!token) {
      list.innerHTML = "<p>Token não encontrado. Faça login.</p>";
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/agendamentos/pendentes", {
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        list.innerHTML = "<p>Erro ao carregar agendamentos.</p>";
        return;
      }

      const agendamentos = await response.json();
      list.innerHTML = "";

      agendamentos.forEach((agendamento, index) => {
        const agendamentoDiv = document.createElement("div");
        agendamentoDiv.className = "agendamento";

        const horaFormatada = agendamento.hora ? agendamento.hora : "Sem horário";
        const dias = agendamento.diasEmAtraso < 0 ? 0 : agendamento.diasEmAtraso;

        agendamentoDiv.innerHTML = `
          <div class="agendamento-info">
            <span><strong>Paciente:</strong> ${agendamento.pacienteNome}</span>
            <span><strong>Data:</strong> ${formatarData(agendamento.dataAplicacao)}</span>
            <span><strong>Horário:</strong> ${horaFormatada}</span>
            <span><strong>Vacina:</strong> ${agendamento.vacinaNome}</span>
            <span><strong>Dias em atraso:</strong> ${dias}</span>
            <span><strong>Status:</strong> <span id="status-${index}">${agendamento.status}</span></span>
          </div>
          ${agendamento.status === "AGENDADO" ? `
          <div class="agendamento-actions">
            <button class="aplicada-btn" onclick="confirmarAplicacao(${agendamento.id})">Aplicada</button>
            <button class="atrasada-btn" onclick="cancelarAgendamento(${agendamento.id})">Cancelar</button>
          </div>
          ` : ""}
        `;

        list.appendChild(agendamentoDiv);
      });
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      list.innerHTML = "<p>Erro ao conectar com o servidor.</p>";
    }
  }

  function formatarData(dataISO) {
    const data = new Date(dataISO + "T00:00:00");
    return data.toLocaleDateString("pt-BR");
  }

  function confirmarAplicacao(id) {
  const token = localStorage.getItem("token");
  const usuarioConfirmadorId = localStorage.getItem("usuarioId");

  if (!token) {
    alert("Token de autenticação não encontrado.");
    return;
  }

  if (!usuarioConfirmadorId) {
    alert("ID do usuário confirmador não encontrado. Faça login novamente.");
    return;
  }

  fetch(`http://localhost:8080/api/agendamentos/${id}/confirmar?usuarioConfirmadorId=${usuarioConfirmadorId}`, {
    method: "PUT",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    }
  })
    .then(async (res) => {
      if (res.ok) {
        alert("Aplicação confirmada com sucesso!");
        renderAgendamentos(); // Atualiza a lista após confirmação
      } else {
        const erro = await res.text();
        alert("Erro ao confirmar aplicação: " + erro);
      }
    })
    .catch(err => {
      console.error("Erro na requisição:", err);
      alert("Erro na confirmação de aplicação.");
    });
}

  function cancelarAgendamento(id) {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8080/api/agendamentos/${id}/cancelar`, {
      method: "PUT",
      headers: {
        "Authorization": "Bearer " + token
      }
    })
      .then(res => {
        if (res.ok) {
          alert("Agendamento cancelado!");
          renderAgendamentos();
        } else {
          alert("Erro ao cancelar agendamento.");
        }
      })
      .catch(err => {
        console.error(err);
        alert("Erro no cancelamento.");
      });
  }
}
