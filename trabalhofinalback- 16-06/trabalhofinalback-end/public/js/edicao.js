// usuarios.html --- configuração da lista de usuários com paginação

if (document.getElementById("userList")) {
  let users = [];
  let paginaAtual = 1;
  const itensPorPagina = 5;
  let termoBusca = "";

  const token = localStorage.getItem("token");

  fetch("http://localhost:8080/api/usuarios", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Falha na requisição: " + res.status);
      return res.json();
    })
    .then((data) => {
      users = data;
      renderUsers();
      atualizarPaginacao();
    })
    .catch((error) => {
      console.error("Erro ao carregar usuários:", error);
    });

  function renderUsers() {
    const userList = document.getElementById("userList");
    userList.innerHTML = "";

    const usuariosFiltrados = termoBusca
      ? users.filter((user) =>
          user.nome.toLowerCase().includes(termoBusca.toLowerCase())
        )
      : users;

    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const usuariosPagina = usuariosFiltrados.slice(inicio, fim);

    if (usuariosPagina.length === 0) {
      userList.innerHTML =
        "<p style='text-align:center;'>Nenhum usuário encontrado.</p>";
      return;
    }

    usuariosPagina.forEach((user, index) => {
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
         <button class="edit-btn" onclick="editarUsuario(${
           user.id
         })">Editar</button>
         <button class="delete-btn" onclick="excluirUsuario(${
           user.id
         })">Excluir</button>
       </div>
      `;

      userList.appendChild(div);
    });
  }

  function atualizarPaginacao() {
    const paginacao = document.getElementById("pagination");
    const usuariosFiltrados = termoBusca
      ? users.filter((user) =>
          user.nome.toLowerCase().includes(termoBusca.toLowerCase())
        )
      : users;
    const totalPaginas = Math.ceil(usuariosFiltrados.length / itensPorPagina);

    paginacao.innerHTML = "";

    if (totalPaginas <= 1) {
      paginacao.style.display = "none";
      return;
    } else {
      paginacao.style.display = "flex";
    }

    const btnAnterior = document.createElement("button");
    btnAnterior.textContent = "Anterior";
    btnAnterior.disabled = paginaAtual === 1;
    btnAnterior.className = "pagination-btn";
    btnAnterior.addEventListener("click", () => {
      if (paginaAtual > 1) {
        paginaAtual--;
        renderUsers();
        atualizarPaginacao();
      }
    });
    paginacao.appendChild(btnAnterior);

    for (let i = 1; i <= totalPaginas; i++) {
      const btnPagina = document.createElement("button");
      btnPagina.textContent = i;
      btnPagina.className = `pagination-btn ${
        i === paginaAtual ? "active" : ""
      }`;
      btnPagina.addEventListener("click", () => {
        paginaAtual = i;
        renderUsers();
        atualizarPaginacao();
      });
      paginacao.appendChild(btnPagina);
    }

    const btnProxima = document.createElement("button");
    btnProxima.textContent = "Próxima";
    btnProxima.disabled = paginaAtual === totalPaginas;
    btnProxima.className = "pagination-btn";
    btnProxima.addEventListener("click", () => {
      if (paginaAtual < totalPaginas) {
        paginaAtual++;
        renderUsers();
        atualizarPaginacao();
      }
    });
    paginacao.appendChild(btnProxima);
  }

  const campoBusca = document.getElementById("buscaUsuario");
  if (campoBusca) {
    campoBusca.addEventListener("input", () => {
      termoBusca = campoBusca.value;
      paginaAtual = 1;
      renderUsers();
      atualizarPaginacao();
    });
  }

  window.toggleTipo = function (index) {
    const user = users[index];
    const novoTipo = user.tipo === "ADMIN" ? "PACIENTE" : "ADMIN";

    fetch(`http://localhost:8080/api/usuarios/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...user, tipo: novoTipo }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.mensagem);
        user.tipo = data.usuario.tipo;
        renderUsers();
      })
      .catch((err) => {
        alert("Não foi possível atualizar o tipo: " + err.message);
      });
  };

  window.editarUsuario = function (id) {
    localStorage.setItem("editarUsuarioId", id);
    window.location.href = "edituser.html";
  };

  window.excluirUsuario = function (id) {
    const confirmar = confirm("Tem certeza que deseja excluir este usuário?");
    if (!confirmar) return;

    fetch(`http://localhost:8080/api/usuarios/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao excluir");
        alert("Usuário excluído com sucesso.");
        users = users.filter((user) => user.id !== id);
        renderUsers();
        atualizarPaginacao();
      })
      .catch((err) => {
        alert("Erro ao excluir: " + err.message);
      });
  };
}

//listaage.html --- configuração lista agendamentos

if (document.getElementById("agendamentoList")) {
  let agendamentos = [];
  let paginaAtual = 1;
  const itensPorPagina = 5;
  let termoBusca = "";

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
      const response = await fetch(
        "http://localhost:8080/api/agendamentos/pendentes",
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        list.innerHTML = "<p>Erro ao carregar agendamentos.</p>";
        return;
      }

      agendamentos = await response.json();
      paginaAtual = 1;
      renderPaginaAgendamento();
      atualizarPaginacaoAgendamento();
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      list.innerHTML = "<p>Erro ao conectar com o servidor.</p>";
    }
  }

  function renderPaginaAgendamento() {
    const list = document.getElementById("agendamentoList");
    list.innerHTML = "";

    const agendamentosFiltrados = termoBusca
      ? agendamentos.filter((a) =>
          a.pacienteNome.toLowerCase().includes(termoBusca.toLowerCase())
        )
      : agendamentos;

    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const pagina = agendamentosFiltrados.slice(inicio, fim);

    if (pagina.length === 0) {
      list.innerHTML =
        "<p style='text-align:center;'>Nenhum agendamento encontrado.</p>";
      return;
    }

    pagina.forEach((agendamento, index) => {
      const agendamentoDiv = document.createElement("div");
      agendamentoDiv.className = "agendamento";

      const horaFormatada = agendamento.hora ? agendamento.hora : "Sem horário";
      const dias = agendamento.diasEmAtraso < 0 ? 0 : agendamento.diasEmAtraso;

      agendamentoDiv.innerHTML = `
            <div class="agendamento-info">
            <span><strong>Paciente:</strong> ${agendamento.pacienteNome}</span>
            <span><strong>Data:</strong> ${formatarData(
              agendamento.dataAplicacao
            )}</span>
            <span><strong>Horário:</strong> ${horaFormatada}</span>
            <span><strong>Vacina:</strong> ${agendamento.vacinaNome}</span>
            <span><strong>Dias em atraso:</strong> ${dias}</span>
            <span><strong>Status:</strong> <span id="status-${index}">${
        agendamento.status
      }</span></span>
          </div>
          ${
            agendamento.status === "AGENDADO"
              ? `
          <div class="agendamento-actions">
            <button class="aplicada-btn" onclick="confirmarAplicacao(${agendamento.id})">Aplicada</button>
            <button class="atrasada-btn" onclick="cancelarAgendamento(${agendamento.id})">Cancelar</button>
          </div>
          `
              : ""
          }
        `;

      list.appendChild(agendamentoDiv);
    });
  }

  function atualizarPaginacaoAgendamento() {
    const agendamentosFiltrados = termoBusca
      ? agendamentos.filter((a) =>
          a.pacienteNome.toLowerCase().includes(termoBusca.toLowerCase())
        )
      : agendamentos;

    const totalPaginas = Math.ceil(
      agendamentosFiltrados.length / itensPorPagina
    );
    const paginacao = document.getElementById("pagination");
    paginacao.innerHTML = "";

    if (totalPaginas <= 1) {
      paginacao.style.display = "none";
      return;
    } else {
      paginacao.style.display = "flex";
    }

    const btnAnterior = document.createElement("button");
    btnAnterior.textContent = "Anterior";
    btnAnterior.disabled = paginaAtual === 1;
    btnAnterior.className = "pagination-btn";
    btnAnterior.addEventListener("click", () => {
      if (paginaAtual > 1) {
        paginaAtual--;
        renderPaginaAgendamento();
        atualizarPaginacaoAgendamento();
      }
    });
    paginacao.appendChild(btnAnterior);

    for (let i = 1; i <= totalPaginas; i++) {
      const btnPagina = document.createElement("button");
      btnPagina.textContent = i;
      btnPagina.className = `pagination-btn ${
        i === paginaAtual ? "active" : ""
      }`;
      btnPagina.addEventListener("click", () => {
        paginaAtual = i;
        renderPaginaAgendamento();
        atualizarPaginacaoAgendamento();
      });
      paginacao.appendChild(btnPagina);
    }

    const btnProxima = document.createElement("button");
    btnProxima.textContent = "Próxima";
    btnProxima.disabled = paginaAtual === totalPaginas;
    btnProxima.className = "pagination-btn";
    btnProxima.addEventListener("click", () => {
      if (paginaAtual < totalPaginas) {
        paginaAtual++;
        renderPaginaAgendamento();
        atualizarPaginacaoAgendamento();
      }
    });
    paginacao.appendChild(btnProxima);
  }

  function formatarData(dataISO) {
    const data = new Date(dataISO + "T00:00:00");
    return data.toLocaleDateString("pt-BR");
  }

  function confirmarAplicacao(id) {
    const token = localStorage.getItem("token");
    const usuarioConfirmadorId = localStorage.getItem("usuarioId");

    if (!token || !usuarioConfirmadorId) {
      alert("Token ou ID do usuário não encontrado. Faça login novamente.");
      return;
    }

    fetch(
      `http://localhost:8080/api/agendamentos/${id}/confirmar?usuarioConfirmadorId=${usuarioConfirmadorId}`,
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    )
      .then(async (res) => {
        if (res.ok) {
          alert("Aplicação confirmada com sucesso!");
          renderAgendamentos();
        } else {
          const erro = await res.text();
          alert("Erro ao confirmar aplicação: " + erro);
        }
      })
      .catch((err) => {
        console.error("Erro na requisição:", err);
        alert("Erro na confirmação de aplicação.");
      });
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
          renderAgendamentos();
        } else {
          alert("Erro ao cancelar agendamento.");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Erro no cancelamento.");
      });
  }

  const campoBusca = document.getElementById("buscaAgendamentos");
  if (campoBusca) {
    campoBusca.addEventListener("input", () => {
      termoBusca = campoBusca.value;
      paginaAtual = 1;
      renderPaginaAgendamento();
      atualizarPaginacaoAgendamento();
    });
  }
}
