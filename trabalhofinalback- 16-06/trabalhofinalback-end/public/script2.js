 //usuarios.html --- configuração da lista de usuários
 
 if (document.getElementById("userList")) {
 let users = [
        {
          nome: "João Silva",
          email: "joao@example.com",
          cpf: "123.456.789-00",
          status: "comum",
        },
      ];

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
        users[index].status =
          users[index].status === "admin" ? "comum" : "admin";
        renderUsers();
      }

      function deleteUser(index) {
        if (confirm("Tem certeza que deseja excluir este usuário?")) {
          users.splice(index, 1);
          renderUsers();
        }
      }

      renderUsers();
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
    status: "Agendada"
  },
  {
    nome: "João Mendes",
    data: "2025-06-16",
    horario: "10:30",
    vacina: "Covid-19",
    status: "Agendada"
  }
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