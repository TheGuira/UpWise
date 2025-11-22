document.addEventListener("DOMContentLoaded", function() {

  // 1. Pega o link "Login"
  document.getElementById("link-login").addEventListener("click", function(event) {
    event.preventDefault();
    // Sai da pasta 'homepage' (../) e entra na 'login' (login/)
    window.location.href = "../Login/login.html";
  });

  // 2. Pega o link "Cadastre-se"
  document.getElementById("link-cadastro").addEventListener("click", function(event) {
    event.preventDefault();
    // Sai da pasta 'homepage' (../) e entra na 'cadastro' (cadastro/)
    window.location.href = "../Cadastro/cadastro.html";
  });

});

