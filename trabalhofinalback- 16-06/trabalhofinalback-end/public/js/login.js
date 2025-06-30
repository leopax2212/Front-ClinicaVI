document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      const email = document.getElementById("email").value;
      const senha = document.getElementById("senha").value;

      try {
        const response = await fetch("http://localhost:8080/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ login: email, senha })
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("token", data.token);
          localStorage.setItem("usuarioId", data.usuarioId);
          localStorage.setItem("nomeUsuario", data.nomeUsuario);
          localStorage.setItem("tipoUsuario", data.tipoUsuario);

          // Busca os dados completos do paciente
          const pacienteResponse = await fetch(`http://localhost:8080/api/pacientes/${data.usuarioId}`, {
            headers: {
              "Authorization": "Bearer " + data.token
            }
          });

          if (pacienteResponse.ok) {
            const paciente = await pacienteResponse.json();

            console.log("Paciente retornado:", paciente); // ✅ Aqui está certo!

            localStorage.setItem("emailUsuario", paciente.email || "");
            localStorage.setItem("cpfUsuario", paciente.cpf || "");
            localStorage.setItem("nascimentoUsuario", paciente.dataNascimento || "");
            localStorage.setItem("ruaUsuario", paciente.rua || "");
            localStorage.setItem("numeroUsuario", paciente.numero || "");
            localStorage.setItem("bairroUsuario", paciente.bairro || "");
            localStorage.setItem("cidadeUsuario", paciente.cidade || "");
            localStorage.setItem("estadoUsuario", paciente.estado || "");
          }

          window.location.href = "index.html"; // Redireciona após login
        } else {
          alert("Falha no login: Verifique seu e-mail e senha.");
        }
      } catch (error) {
        alert("Erro de conexão com o servidor.");
        console.error(error);
      }
    });
  }
});
