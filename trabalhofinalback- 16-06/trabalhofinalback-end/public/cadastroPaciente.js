document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("pacienteForm");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const paciente = {
      nome: document.getElementById("nome").value,
      email: document.getElementById("email").value,
      senha: document.getElementById("senha").value,
      cpf: document.getElementById("cpf").value,
      dataNascimento: document.getElementById("dataNascimento").value,
      rua: document.getElementById("rua").value,
      numero: document.getElementById("numero").value,
      bairro: document.getElementById("bairro").value,
      cidade: document.getElementById("cidade").value,
      estado: document.getElementById("estado").value
    };

    try {
      const response = await fetch("http://localhost:8080/api/pacientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(paciente)
      });

      if (response.ok) {
        alert("Paciente cadastrado com sucesso!");
        window.location.href = "login.html";
      } else {
        const msg = await response.text();
        alert("Erro ao cadastrar paciente: " + msg);
      }
    } catch (error) {
      alert("Erro de conexão com o servidor.");
    }
  });
});
