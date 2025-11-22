document.addEventListener("DOMContentLoaded", function() {

  // --- NOVO: LÓGICA DE CARREGAR DADOS DO USUÁRIO (NOME/EMAIL/FOTO) ---
  
  // Função para preencher nome, email E FOTO na barra lateral/cabeçalho
  function preencherDadosUsuario(usuario) {
    if (!usuario) return;

    // Preencher Nome e Email
    document.querySelectorAll(".nome-usuario").forEach(el => {
      if (el) el.innerText = usuario.nome || '[Nome]';
    });
    document.querySelectorAll(".email-usuario").forEach(el => {
      if (el) el.innerText = usuario.email || 'email@gmail.com';
    });

    // NOVO: Carregar e exibir a Foto de Perfil (Avatar na barra lateral)
    const avatarLateral = document.querySelector(".barra-lateral .avatar");
    if (avatarLateral && usuario.fotoPerfil) {
        avatarLateral.style.backgroundImage = `url(${usuario.fotoPerfil})`;
        avatarLateral.style.backgroundSize = 'cover';
        avatarLateral.style.backgroundPosition = 'center';
        avatarLateral.style.backgroundColor = 'transparent'; // Remove o fundo cinza padrão
    } else if (avatarLateral) {
        // Se não houver foto (ex: usuário limpa), volta ao padrão
        avatarLateral.style.backgroundImage = 'none';
        avatarLateral.style.backgroundColor = '#e6e9ee'; 
    }
  }
  const usuarioString = localStorage.getItem('usuarioCadastrado');
  if (usuarioString) {
    try {
      const usuarioLogado = JSON.parse(usuarioString);
      preencherDadosUsuario(usuarioLogado);
    } catch (e) {
      console.error("Erro ao carregar dados do usuário:", e);
    }
  } 
  
  const logoutButton = document.querySelector(".sair a");
  if (logoutButton) {
    logoutButton.addEventListener("click", function(event) {
      event.preventDefault();
      localStorage.removeItem('usuarioCadastrado');
      window.location.href = "../homepage/homepage.html"; 
    });
  }
  
  document.querySelectorAll(".barra-lateral nav li").forEach(li => {
  li.addEventListener("click", function() {
      const dataLink = this.getAttribute('data-link'); 
      if (dataLink === "inicio") { 
        window.location.href = "../painelmentor/homementor.html"; 
      } else if (dataLink === "minha-agenda") { 
        window.location.href = "../agendamentor/agendamentor.html"; 
      } else if (dataLink === "minhas-sessoes") {
        window.location.href = "../mentorsessoes/sessoesmentor.html"; 
      } else if (dataLink === "perfil") { 
        window.location.href = "../perfilmentor/perfilmentor.html"; 
      } else if (dataLink === "chat") {
        alert("Página 'Chat' ainda não implementada.");
      } else if (dataLink === "Avaliação") {
        alert("Página 'Avaliação' ainda não implementada.");
      }  
    });
  });


  // --- LÓGICA DA PÁGINA DE SESSÕES (NOVA) ---

  const abas = document.querySelectorAll('.aba-item');
  const paineis = document.querySelectorAll('.aba-painel');

  abas.forEach(aba => {
    aba.addEventListener('click', () => {
      // 1. Desativa todas as abas e paineis
      abas.forEach(a => a.classList.remove('ativo'));
      paineis.forEach(p => {
        p.classList.remove('ativo');
        p.style.display = 'none'; // Esconde o painel
      });

      // 2. Ativa a aba clicada
      aba.classList.add('ativo');

      // 3. Mostra o painel correspondente
      const alvoId = `painel-${aba.dataset.aba}`;
      const painelAlvo = document.getElementById(alvoId);
      
      if (painelAlvo) {
        painelAlvo.classList.add('ativo');
        painelAlvo.style.display = 'block'; 
      }
    });
  });

});