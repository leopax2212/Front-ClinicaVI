document.addEventListener("DOMContentLoaded", () => {
  const tipoUsuario = localStorage.getItem("tipoUsuario");
  const nomeUsuario = localStorage.getItem("nomeUsuario");

  // Atualiza o nome do usuário no menu
  const nomeUsuarioEl = document.getElementById("nome-usuario");
  if (nomeUsuarioEl && nomeUsuario) {
    nomeUsuarioEl.textContent = nomeUsuario;
  }

  // Verifica se é admin
  if (tipoUsuario !== "ADMIN") {
    // Seleciona todos os <li> do menu dropdown
    const menuItems = document.querySelectorAll(".vi-dropdown-menu ul li");

    menuItems.forEach((item) => {
      const texto = item.textContent.trim().toUpperCase();

      // Esconde opções específicas para não-admins
      if (["USUÁRIOS", "DOENÇAS", "VACINAS", "AGENDAMENTOS"].includes(texto)) {
        item.style.display = "none";
      }
    });
  }
});
