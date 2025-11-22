document.addEventListener("DOMContentLoaded", function() {

  // --- SEU CÓDIGO ORIGINAL DE ABAS E BOTÕES ---
  const tabLinks = document.querySelectorAll(".perfil-tabs a");
  const tabContents = document.querySelectorAll(".aba-conteudo");

  tabLinks.forEach(link => {
    link.addEventListener("click", function(event) {
      event.preventDefault(); 
      const tabId = this.getAttribute("data-tab");

      tabLinks.forEach(item => item.classList.remove("active"));
      tabContents.forEach(item => item.classList.remove("active"));

      this.classList.add("active");
      const content = document.getElementById(tabId);
      if (content) {
        content.classList.add("active");
      }
    });
  });

  const selectionButtons = document.querySelectorAll(".btn-selecao");
  selectionButtons.forEach(button => {
    button.addEventListener("click", function(event) {
      event.preventDefault(); 
      this.classList.toggle("active");
    });
  });
  


  // --- CÓDIGO DE NAVEGAÇÃO E SAIR ---
  const logoutButton = document.querySelector(".sair a");
  if (logoutButton) {
    logoutButton.addEventListener("click", function(event) {
      event.preventDefault();
      localStorage.removeItem('usuarioCadastrado'); 
      localStorage.removeItem('userAccountType');
      window.location.href = "../HomePage/homepage.html";
    });
    
  }

 // --- Lógica de Navegação da Barra Lateral ---
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

  const formPerfil = document.querySelector(".caixa form");
  const usuarioString = localStorage.getItem('usuarioCadastrado');
  let usuarioLogado = null

  // Seletores para a Foto
  const inputFoto = document.getElementById('input-foto');
  const iconeEditarFoto = document.getElementById('icone-editar-foto');
  const fotoPlaceholder = document.getElementById('foto-placeholder');
  const avatarLateral = document.querySelector(".barra-lateral .avatar");
  

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


  function preencherDados(usuario) {
    if (!usuario) return; 

    // Carregar e exibir a foto, se existir
    exibirFoto(usuario.fotoPerfil || null);
    
    // Cabeçalho e Barra Lateral
    document.querySelectorAll(".nome-usuario").forEach(el => {
      if (el) el.innerText = usuario.nome || '[Nome]';
    });
    document.querySelectorAll(".email-usuario").forEach(el => {
      if (el) el.innerText = usuario.email || 'email@gmail.com';
    });
    
    // Info Principal
    const nomePrincipal = document.querySelector(".perfil-info-principal h2");
    if (nomePrincipal) nomePrincipal.innerText = usuario.nome || '[Nome]';
    
    const emailPrincipal = document.querySelector(".perfil-info-principal p");
    if (emailPrincipal) emailPrincipal.innerText = usuario.email || 'email@gmail.com';

    const tipoPerfil = document.querySelector(".perfil-info-principal .tipo-perfil");
    if (tipoPerfil) tipoPerfil.innerText = usuario.tipoConta || '[tipo do perfil]';

    // Estatísticas (Nível de Experiência)
    const nivelStat = document.querySelector(".stat-item .valor[data-tipo='nivel']");
    if (nivelStat) {
      nivelStat.innerText = usuario.nivelExperiencia || '[Nivel de aprendizado]';
    }

    // Formulário - Aba Pessoal
    const inputNome = document.getElementById('nome');
    if (inputNome) inputNome.value = usuario.nome || '';
    
    const inputBio = document.getElementById('bio');
    if (inputBio) inputBio.value = usuario.biografia || '';
    
    const inputLinkedin = document.getElementById('linkedin');
    if (inputLinkedin) inputLinkedin.value = usuario.linkedin || '';
    
    // Formulário - Aba Profissional
    const selectNivel = document.getElementById('nivel');
    if (selectNivel) selectNivel.value = usuario.nivelExperiencia || 'iniciante';
    
    // Áreas de Especialidade
    const abaProfissional = document.getElementById('profissional');
    if (abaProfissional) {
      const botoesAreas = abaProfissional.querySelectorAll(".btn-selecao");
      botoesAreas.forEach(btn => {
        btn.classList.remove('active'); 
        if (usuario.areasDeInteresse && usuario.areasDeInteresse.includes(btn.innerText.trim())) {
          btn.classList.add('active');
        }
      });
    }
  }

  // Carrega os dados ao iniciar a página
  if (usuarioString) {
    try {
      usuarioLogado = JSON.parse(usuarioString);
      preencherDados(usuarioLogado);
    } catch (e) {
      console.error("Erro ao carregar dados do usuário:", e);
    }
  } 

  // --- NOVA LÓGICA DE CARREGAMENTO DE FOTO ---
  if (iconeEditarFoto && inputFoto) {
      iconeEditarFoto.addEventListener("click", function() {
          inputFoto.click(); // Abre o seletor de arquivos
      });

      inputFoto.addEventListener("change", function(event) {
          const file = event.target.files[0];
          if (file) {
              const reader = new FileReader();
              
              reader.onload = function(e) {
                  const base64Image = e.target.result;
                  
                  // 1. Exibir imediatamente (visualização)
                  exibirFoto(base64Image);
                  
                  // 2. Salvar o Base64 na variável local do usuário logado
                  if (usuarioLogado) {
                      usuarioLogado.fotoPerfil = base64Image;
                      // NOTA: A foto só será salva no localStorage após o SUBMIT do formulário
                      alert("Foto carregada. Clique em 'Salvar Alterações' para manter a foto no seu perfil.");
                  }
              };
              
              reader.readAsDataURL(file); // Converte a imagem para Base64
          }
      });
  }
  // --- FIM DA NOVA LÓGICA DE FOTO ---


  // Adiciona o evento de 'submit' ao formulário para SALVAR
  if (formPerfil) {
    formPerfil.addEventListener("submit", function(event) {
      event.preventDefault(); 
      
      if (!usuarioLogado) {
        alert("Erro: Não foi possível encontrar os dados do usuário para salvar.");
        return;
      }

      // Coleta de dados
      usuarioLogado.nome = document.getElementById('nome').value;
      usuarioLogado.biografia = document.getElementById('bio').value;
      usuarioLogado.linkedin = document.getElementById('linkedin').value;
      usuarioLogado.nivelExperiencia = document.getElementById('nivel').value;

      const areasSelecionadas = [];
      const abaProfissional = document.getElementById('profissional');
      if (abaProfissional) {
        abaProfissional.querySelectorAll(".btn-selecao.active").forEach(btn => {
          areasSelecionadas.push(btn.innerText.trim());
        });
      }
      usuarioLogado.areasDeInteresse = areasSelecionadas;
      
      // A fotoPerfil já foi atualizada no inputFoto.addEventListener('change', ...)
      // e será salva aqui no localStorage
      localStorage.setItem('usuarioCadastrado', JSON.stringify(usuarioLogado));

      alert("Perfil atualizado com sucesso!");
      preencherDados(usuarioLogado); 
    });
  }
});