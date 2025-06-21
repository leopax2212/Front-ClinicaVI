document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("loginForm");
    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();

            const email = document.getElementById("email").value;
            const senha = document.getElementById("senha").value;

            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ login: email, senha })
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.token;

                // Armazena token e dados do usuário
                localStorage.setItem("token", token);
                localStorage.setItem("usuarioId", data.id); // <-- ESSENCIAL para salvar como confirmador
                localStorage.setItem("nomeUsuario", data.nome);

                window.location.href = "index.html"; // redireciona após login
            } else {
                alert("Falha no login: Verifique seu e-mail e senha.");
            }
        });
    }
});
