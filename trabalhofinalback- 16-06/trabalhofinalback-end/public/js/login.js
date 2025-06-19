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

                localStorage.setItem("token", token);

                // Salvar o nome no localStorage
                localStorage.setItem("nomeUsuario", data.nome);

                window.location.href = "index.html";
            } else {
                alert("Falha no login: Verifique seu e-mail e senha.");
            }
        });
    }
});
