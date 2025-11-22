document.addEventListener("DOMContentLoaded", function() {

  // --- LÓGICA DAS ABAS E BOTÕES (DA PÁGINA) ---
  // Seletores corrigidos para funcionar com o HTML
  const tabButtons = document.querySelectorAll(".tabs .tab-button");
  const tabContents = document.querySelectorAll(".caixa .tab-content");

  tabButtons.forEach(button => {
    button.addEventListener("click", function() {
      tabButtons.forEach(btn => btn.classList.remove("active"));
      tabContents.forEach(content => content.style.display = "none");
      this.classList.add("active");
      const targetTabId = this.getAttribute("data-tab");
      const targetTabContent = document.getElementById(targetTabId);
      if (targetTabContent) {
        targetTabContent.style.display = "block";
      }
    });
  });

  const btnEncontrarMentores = document.querySelector(".btn-encontrar-mentores");
  if (btnEncontrarMentores) {
    btnEncontrarMentores.addEventListener("click", function() {
      window.location.href = "../buscadementor/busca.html"; 
    });
  }

  const btnAgendar = document.querySelector(".btn-agendar");
  if (btnAgendar) {
    btnAgendar.addEventListener("click", function() {
      window.location.href = "../buscadementor/busca.html";
    });
  }
  // --- FIM DA LÓGICA DA PÁGINA ---


  // --- NOVO: LÓGICA DE CARREGAR DADOS DO USUÁRIO (NOME/EMAIL) ---
  
  // --- NOVO: FUNÇÃO AUXILIAR PARA EXIBIR A FOTO ---
  function exibirFoto(base64Image) {
      const avatarLateral = document.querySelector(".barra-lateral .avatar");
      if (!avatarLateral) return;

      if (base64Image) {
          avatarLateral.style.backgroundImage = `url(${base64Image})`;
          avatarLateral.style.backgroundSize = 'cover';
          avatarLateral.style.backgroundPosition = 'center';
          avatarLateral.style.backgroundColor = 'transparent'; 
      } else {
          avatarLateral.style.backgroundImage = 'none';
          avatarLateral.style.backgroundColor = '#e6e9ee'; // Volta ao fundo cinza
      }
  }
  // --- FIM DA NOVA FUNÇÃO ---
  
  // Função para preencher nome e email na barra lateral/cabeçalho
  function preencherDadosUsuario(usuario) {
    if (!usuario) return;

    // CHAMADA PARA EXIBIR A FOTO CARREGADA
    exibirFoto(usuario.fotoBase64);

    // Preenche o nome
    document.querySelectorAll(".nome-usuario").forEach(el => {
      if (el) el.innerText = usuario.nome || '[Nome]';
    });

    // Preenche o email
    document.querySelectorAll(".email-usuario").forEach(el => {
      if (el) el.innerText = usuario.email || 'email@gmail.com';
    });
  }

  // Carrega os dados ao iniciar a página
  const usuarioString = localStorage.getItem('usuarioCadastrado');
  if (usuarioString) {
    try {
      const usuarioLogado = JSON.parse(usuarioString);
      preencherDadosUsuario(usuarioLogado);
    } catch (e) {
      console.error("Erro ao carregar dados do usuário:", e);
    }
  } else {
    console.warn("Nenhum usuário logado encontrado no localStorage.");
  }
  // --- FIM DA NOVA LÓGICA ---


  // ---- 1. LÓGICA DE NAVEGAÇÃO DA BARRA LATERAL ----
  document.querySelectorAll(".barra-lateral nav li").forEach(li => {
    li.addEventListener("click", function() {
      const dataLink = this.getAttribute("data-link"); 
      if (!dataLink) return; 

      if (dataLink === "inicio") {
        window.location.href = "../painelmentorado/homementorado.html";
      } else if (dataLink === "buscar-mentores") {
        window.location.href = "../buscadementor/busca.html";
      } else if (dataLink === "minhas-sessoes") {
        window.location.href = "../minhasessoes/minhasessoes.html";
      } else if (dataLink === "perfil") {
        window.location.href = "../perfilmentorado/perfilmentorado.html";
      } else if (dataLink === "chat") {
        alert("Página 'Chat' ainda não implementada.");
      } else if (dataLink === "favoritos") {
        alert("Página 'Favoritos' ainda não implementada.");
      }
    });
  });

  // ---- 2. LÓGICA DE SAIR (LOGOUT) ----
  const logoutButton = document.querySelector(".sair a");
  if (logoutButton) {
    logoutButton.addEventListener("click", function(event) {
      event.preventDefault();
      // Remove o usuário cadastrado ao sair
      localStorage.removeItem('usuarioCadastrado'); 
      localStorage.removeItem('userAccountType');
      window.location.href = "../homepage/homepage.html";
    });
  }

});