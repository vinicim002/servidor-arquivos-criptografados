document.addEventListener("DOMContentLoaded", function () {
  // Adiciona o ouvinte de clique para o botão de registro
  document.querySelector(".bnt-signup").addEventListener("click", () => {
    window.location.href = "register.html";
  });

  // Adiciona o ouvinte de clique para o botão de login
  document.querySelector(".bnt-signin").addEventListener("click", () => {
    window.location.href = "login.html";
  });
});
