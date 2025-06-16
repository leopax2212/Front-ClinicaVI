document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("recuperarForm");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const novaSenha = document.getElementById("novaSenha").value;
    const codigo = document.getElementById("codigo").value;

    if (codigo !== "0000") {
      alert("Código inválido. Tente novamente.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/usuarios/recuperar-senha", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email, novaSenha: novaSenha, codigo: codigo })
      });

      if (response.ok) {
        alert("Senha atualizada com sucesso!");
        window.location.href = "login.html";
      } else {
        const msg = await response.text();
        alert("Erro ao atualizar senha: " + msg);
      }
    } catch (error) {
      alert("Erro de conexão com o servidor.");
    }
  });
});
