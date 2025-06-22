document.addEventListener("DOMContentLoaded", () => {
  const tipoUsuario = localStorage.getItem("tipoUsuario");

  if (tipoUsuario !== "ADMIN") {
    alert("Acesso restrito a administradores.");
    window.location.href = "index.html"; // ou qualquer página pública
  }
});
