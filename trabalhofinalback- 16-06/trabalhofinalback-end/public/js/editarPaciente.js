document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("pacienteForm");
  const btnAtualizar = document.getElementById("btnAtualizar");
  const btnExcluir = document.getElementById("btnExcluir");

  let editando = false;
  let pacienteId = null;
  const token = localStorage.getItem("token");

  const campos = form.querySelectorAll("input");
  campos.forEach((input) => (input.disabled = true)); // inicia desabilitado

  // Buscar dados do paciente logado e o selecionado pelo ADMIN
  try {
    const idSelecionado = localStorage.getItem("editarUsuarioId");
    const url = idSelecionado
      ? `http://localhost:8080/api/usuarios/${idSelecionado}`
      : `http://localhost:8080/api/pacientes/me`;

    const response = await fetch(url, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (response.ok) {
      const paciente = await response.json();
      pacienteId = paciente.id;

      document.getElementById("nome").value = paciente.nome;
      document.getElementById("email").value = paciente.email;
      document.getElementById("senha").value = paciente.senha;
      document.getElementById("cpf").value = paciente.cpf;
      document.getElementById("dataNascimento").value = paciente.dataNascimento;
      document.getElementById("rua").value = paciente.rua;
      document.getElementById("numero").value = paciente.numero;
      document.getElementById("bairro").value = paciente.bairro;
      document.getElementById("cidade").value = paciente.cidade;
      document.getElementById("estado").value = paciente.estado;
    } else {
      alert("Erro ao buscar dados do usuário.");
    }
  } catch (error) {
    alert("Erro de conexão.");
  }

  // Atualizar / Confirmar
  btnAtualizar.addEventListener("click", async () => {
    if (!editando) {
      campos.forEach((input) => {
        input.disabled = false;
        input.parentElement.classList.add("editable");
      });
      btnAtualizar.textContent = "CONFIRMAR ATUALIZAÇÃO";
      editando = true;
      return;
    }

    const pacienteAtualizado = {
      nome: document.getElementById("nome").value,
      email: document.getElementById("email").value,
      senha: document.getElementById("senha").value,
      cpf: document.getElementById("cpf").value,
      dataNascimento: document.getElementById("dataNascimento").value,
      rua: document.getElementById("rua").value,
      numero: document.getElementById("numero").value,
      bairro: document.getElementById("bairro").value,
      cidade: document.getElementById("cidade").value,
      estado: document.getElementById("estado").value,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/api/pacientes/${pacienteId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(pacienteAtualizado),
        }
      );

      if (response.ok) {
        alert("Cadastro atualizado com sucesso!");

        // Desabilita os campos e remove estilo de edição
        campos.forEach((input) => {
          input.disabled = true;
          input.parentElement.classList.remove("editable");
        });

        btnAtualizar.textContent = "ATUALIZAR CADASTRO";
        editando = false;
      } else {
        const erro = await response.text();
        alert("Erro ao atualizar: " + erro);
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
    }
  });

  // Excluir conta
  btnExcluir.addEventListener("click", async () => {
    const confirmar = confirm("Deseja realmente excluir sua conta?");
    if (!confirmar) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/pacientes/${pacienteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (response.ok) {
        alert("Conta excluída com sucesso.");
        localStorage.clear();
        window.location.href = "login.html";
      } else {
        alert("Erro ao excluir conta.");
      }
    } catch (error) {
      alert("Erro de conexão com o servidor.");
    }
  });
});
