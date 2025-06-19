//usuarios.html --- configuração da lista de usuários

if (document.getElementById("userList")) {
  let users = [];

  //ALTERAR LEANDRO
  fetch("https://run.mocky.io/v3/40a8353f-bb90-4ac5-a2d7-ffc7b05d39cc")
    .then((res) => res.json())
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
            <span><strong>CPF:</strong> ${user.cpf}</span>
            <span><strong>Status:</strong> ${user.status}</span>
          </div>
          <div class="user-actions">
            <button class="admin-btn" onclick="toggleAdmin(${index})">
              Tornar ${user.status === "admin" ? "comum" : "admin"}
            </button>
            <button class="delete-btn" onclick="deleteUser(${index})">
              Excluir
            </button>
          </div>
        `;

      userList.appendChild(div);
    });
  }

  function toggleAdmin(index) {
    const user = users[index];
    const novoStatus = user.status === "admin" ? "comum" : "admin";

    //alterar LEANDRO
    fetch(`https://suaapi.com/usuarios/${user.cpf}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: novoStatus }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao atualizar status");
        user.status = novoStatus;
        renderUsers();
      })
      .catch((err) => {
        alert("Não foi possível atualizar o status: " + err.message);
      });
  }

  function deleteUser(index) {
  const user = users[index];

  //ALTERAR LEANDRO
  if (confirm("Tem certeza que deseja excluir este usuário?")) {
    fetch(`https://suaapi.com/usuarios/${user.cpf}`, {
      method: "DELETE"
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao excluir usuário");
        // Remove localmente só se backend confirmou exclusão
        users.splice(index, 1);
        renderUsers();
      })
      .catch(err => {
        alert("Não foi possível excluir o usuário: " + err.message);
      });
    }
  }
}

//listaage.html --- configuração lista agendamentos

if (document.getElementById("agendamentoList")) {
  document.addEventListener("DOMContentLoaded", () => {
    renderAgendamentos();
  });

  const agendamentos = [
    {
      nome: "Carla Souza",
      data: "2025-06-15",
      horario: "14:00",
      vacina: "Hepatite B",
      status: "Agendada",
    },
    {
      nome: "João Mendes",
      data: "2025-06-16",
      horario: "10:30",
      vacina: "Covid-19",
      status: "Agendada",
    },
  ];

  function renderAgendamentos() {
    const list = document.getElementById("agendamentoList");
    list.innerHTML = "";

    agendamentos.forEach((agendamento, index) => {
      const agendamentoDiv = document.createElement("div");
      agendamentoDiv.className = "agendamento";

      agendamentoDiv.innerHTML = `
      <div class="agendamento-info">
        <span><strong>Paciente:</strong> ${agendamento.nome}</span>
        <span><strong>Data:</strong> ${agendamento.data}</span>
        <span><strong>Horário:</strong> ${agendamento.horario}</span>
        <span><strong>Vacina:</strong> ${agendamento.vacina}</span>
        <span><strong>Status:</strong> <span id="status-${index}">${agendamento.status}</span></span>
      </div>
      <div class="agendamento-actions">
        <button class="aplicada-btn" onclick="atualizarStatus(${index}, 'Aplicada')">Aplicada</button>
        <button class="atrasada-btn" onclick="atualizarStatus(${index}, 'Atrasada')">Atrasada</button>
      </div>
    `;

      list.appendChild(agendamentoDiv);
    });
  }

  function atualizarStatus(index, novoStatus) {
    agendamentos[index].status = novoStatus;
    document.getElementById(`status-${index}`).textContent = novoStatus;
  }
}
