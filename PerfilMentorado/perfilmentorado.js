document.addEventListener("DOMContentLoaded", function() {
  // --- LÓGICA DAS ABAS E BOTÕES ---
  const tabButtons = document.querySelectorAll(".perfil-tabs a");
  const tabContents = document.querySelectorAll(".aba-conteudo"); 

  tabButtons.forEach(button => {
    button.addEventListener("click", function(event) {
      event.preventDefault(); 
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
      localStorage.removeItem('usuarioCadastrado'); 
      localStorage.removeItem('userAccountType');
      window.location.href = "../homepage/homepage.html";
    });
  }

  // ---- 3. LÓGICA DE SELEÇÃO DE ESPECIALIDADES ----
  const specialtyButtons = document.querySelectorAll(".btn-especialidade");
  specialtyButtons.forEach(button => {
    button.addEventListener("click", function(event) {
      event.preventDefault(); 
      this.classList.toggle("active"); 
    });
  });


  // --- NOVO: 4. LÓGICA DE CARREGAR E SALVAR DADOS DO PERFIL ---
  const formPerfil = document.querySelector(".caixa form");
  const usuarioString = localStorage.getItem('usuarioCadastrado');
  let usuarioLogado = null;

  // Seletores para a Foto (NOVO)
  const inputFoto = document.getElementById('input-foto');
  const iconeEditarFoto = document.getElementById('icone-editar-foto');
  const fotoPlaceholder = document.getElementById('foto-placeholder');
  const avatarLateral = document.querySelector(".barra-lateral .avatar");
  
  // FUNÇÃO DE EXIBIÇÃO DA FOTO
  function exibirFoto(base64Image) {
      if (base64Image) {
          // Exibir no Perfil Principal
          if (fotoPlaceholder) {
              fotoPlaceholder.style.backgroundImage = `url(${base64Image})`;
              fotoPlaceholder.style.backgroundSize = 'cover';
              fotoPlaceholder.style.backgroundPosition = 'center';
              fotoPlaceholder.innerText = ''; // Remove o texto 'foto'
          }
          // Exibir na Barra Lateral
          if (avatarLateral) {
              avatarLateral.style.backgroundImage = `url(${base64Image})`;
              avatarLateral.style.backgroundSize = 'cover';
              avatarLateral.style.backgroundPosition = 'center';
              // Garante que o fundo cinza padrão seja removido pelo background-image
              avatarLateral.style.backgroundColor = 'transparent'; 
          }
      } else {
          // Limpar foto se não houver (voltando ao estado original)
          if (fotoPlaceholder) {
              fotoPlaceholder.style.backgroundImage = 'none';
              fotoPlaceholder.innerText = 'foto';
          }
           if (avatarLateral) {
              avatarLateral.style.backgroundImage = 'none';
              avatarLateral.style.backgroundColor = '#e6e9ee'; // Volta ao fundo cinza
          }
      }
  }

  // FUNÇÃO QUE PREENCHE OS DADOS
  function preencherDados(usuario) {

    if (!usuario) return; // 
    
    // CHAMADA PARA EXIBIR A FOTO CARREGADA
    exibirFoto(usuario.fotoBase64); 
    
    document.querySelectorAll(".nome-usuario").forEach(el => {
      if (el) el.innerText = usuario.nome || '[Nome]';
    });
    document.querySelectorAll(".email-usuario").forEach(el => {
      if (el) el.innerText = usuario.email || 'email@gmail.com';
    });
    
    // Info Principal (local que você circulou)
    const nomePrincipal = document.querySelector(".perfil-info-principal h2");
    if (nomePrincipal) {
      nomePrincipal.innerText = usuario.nome || '[Nome]';
    }
    
    const emailPrincipal = document.querySelector(".perfil-info-principal p");
    if (emailPrincipal) {
      emailPrincipal.innerText = usuario.email || 'email@gmail.com';
    }

    const tipoPerfil = document.querySelector(".perfil-info-principal .tipo-perfil");
    if (tipoPerfil) {
      tipoPerfil.innerText = usuario.tipoConta || '[tipo do perfil]';
    }

    // Estatísticas (Nível de Aprendizado - Requer a mudança no HTML)
    const nivelStat = document.querySelector(".stat-item .valor[data-tipo='nivel']");
    if (nivelStat) {
      // Ajusta o texto para ser amigável (ex: 'intermediario' -> 'Intermediário')
      const textoNivel = usuario.nivelExperiencia ? usuario.nivelExperiencia.charAt(0).toUpperCase() + usuario.nivelExperiencia.slice(1) : '[Nivel de aprendizado]';
      nivelStat.innerText = textoNivel;
    }

    // Formulário - Aba Pessoal (Campos que você mencionou)
    const inputNome = document.getElementById('nome');
    if (inputNome) inputNome.value = usuario.nome || '';
    
    const inputBio = document.getElementById('bio');
    if (inputBio) inputBio.value = usuario.biografia || '';
    
    const inputLinkedin = document.getElementById('linkedin');
    if (inputLinkedin) inputLinkedin.value = usuario.linkedin || 'https://linkedin.com/in/seuperfil'; // Mantém o placeholder
    
    // Formulário - Aba Profissional
    const selectNivel = document.getElementById('nivel');
    if (selectNivel) selectNivel.value = usuario.nivelExperiencia || 'iniciante';
    
    // Áreas de Especialidade (Interesse)
    const botoesAreas = document.querySelectorAll(".btn-especialidade");
    botoesAreas.forEach(btn => {
      btn.classList.remove('active'); 
      if (usuario.areasDeInteresse && usuario.areasDeInteresse.includes(btn.innerText.trim())) {
        btn.classList.add('active');
      }
    });
  }
  
  // Carrega os dados ao iniciar a página
  if (usuarioString) {
    try {
      usuarioLogado = JSON.parse(usuarioString);
      preencherDados(usuarioLogado);
    } catch (e) {
      console.error("Erro ao carregar dados do usuário:", e);
    }
  } else {
    console.warn("Nenhum usuário logado encontrado no localStorage. (Isso é normal se você não veio do cadastro)");
  }

  // Adiciona o evento de 'submit' ao formulário para SALVAR
  if (formPerfil) {
    formPerfil.addEventListener("submit", function(event) {
      event.preventDefault(); 
      
      if (!usuarioLogado) {
        alert("Erro: Não foi possível encontrar os dados do usuário para salvar.");
        return;
      }

      // Coleta de dados (igual a antes)
      usuarioLogado.nome = document.getElementById('nome').value;
      usuarioLogado.biografia = document.getElementById('bio').value;
      usuarioLogado.linkedin = document.getElementById('linkedin').value;
      usuarioLogado.nivelExperiencia = document.getElementById('nivel').value;
      
      const areasSelecionadas = [];
      document.querySelectorAll(".btn-especialidade.active").forEach(btn => {
        areasSelecionadas.push(btn.innerText.trim());
      });
      usuarioLogado.areasDeInteresse = areasSelecionadas;

      localStorage.setItem('usuarioCadastrado', JSON.stringify(usuarioLogado));

      alert("Perfil atualizado com sucesso!");
      preencherDados(usuarioLogado); 
    });
  }


  // --- NOVO: LÓGICA DE UPLOAD DA FOTO (Base64) ---

  // 1. Clicar no ícone abre o input de arquivo
  if (iconeEditarFoto && inputFoto) {
      iconeEditarFoto.addEventListener('click', function() {
          inputFoto.click(); 
      });
  }

  // 2. Lida com a seleção do arquivo
  if (inputFoto) {
      inputFoto.addEventListener('change', function() {
          const file = this.files[0];
          if (file) {
              const reader = new FileReader();
              
              reader.onload = function(e) {
                  const base64Image = e.target.result;

                  // 3. Salva a string Base64 no objeto do usuário e no localStorage
                  if (usuarioLogado) {
                      usuarioLogado.fotoBase64 = base64Image;
                      localStorage.setItem('usuarioCadastrado', JSON.stringify(usuarioLogado));
                      exibirFoto(base64Image); // 4. Exibe imediatamente
                      alert("Foto de perfil atualizada e salva!");
                  } else {
                      alert("Erro: Usuário não logado para salvar a foto.");
                  }
              };
              
              reader.readAsDataURL(file);
          }
      });
  }
  
});