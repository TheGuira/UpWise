document.addEventListener("DOMContentLoaded", function() {

    // 1. Link "Voltar ao início"
    document.getElementById("link-voltar").addEventListener("click", function(event) {
      event.preventDefault();
      // Sai da pasta 'login' (../) e entra na 'homepage' (homepage/)
      window.location.href = "../index.html";
    });

    // 2. Link "Cadastrar-se"
    document.getElementById("link-cadastrar").addEventListener("click", function(event) {
      event.preventDefault();
      // Sai da pasta 'login' (../) e entra na 'cadastro' (cadastro/)
      window.location.href = "../cadastro/cadastro.html";
    });
    
    // ===================================================
    // INÍCIO DO CÓDIGO DE LOGIN ATUALIZADO
    // ===================================================

    // 3. Lógica de "Login"
    const loginForm = document.querySelector(".LoginBox form");
    
    if (loginForm) {
      loginForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Impede o envio real do formulário
        
        // --- 📍 NOVO: CAPTURAR DADOS DO LOGIN ---
        const emailDigitado = document.getElementById("email").value;
        const senhaDigitada = document.getElementById("senha").value;

        // --- 📍 NOVO: BUSCAR DADOS SALVOS DO CADASTRO ---
        const dadosSalvos = localStorage.getItem('usuarioCadastrado');

        // 1. Verificar se existe algum usuário cadastrado
        if (!dadosSalvos) {
          alert("Nenhum usuário cadastrado. Por favor, cadastre-se primeiro.");
          return;
        }

        // Converter o texto salvo de volta para um objeto
        const usuario = JSON.parse(dadosSalvos);

        // 2. Verificar se o email E a senha batem
        if (emailDigitado === usuario.email && senhaDigitada === usuario.senha) {
          
          alert('Login realizado com sucesso! Redirecionando...');

          // Redireciona baseado no tipo salvo no objeto do usuário
          if (usuario.tipoConta === 'mentor') {
            window.location.href = "../Painelmentor/homementor.html";
          } else {
            window.location.href = "../Painelmentorado/homementorado.html";
          }

        } else {
          // Se o email ou a senha estiverem errados
          alert("Email ou senha incorretos.");
        }
      });
    }
    // ===================================================
    // FIM DO CÓDIGO DE LOGIN ATUALIZADO
    // ===================================================
    

});
