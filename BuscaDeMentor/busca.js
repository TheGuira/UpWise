document.addEventListener('DOMContentLoaded', function() {
     
  // --- SEU CÓDIGO ORIGINAL DE ABAS E BOTÕES ---
  const tabLinks = document.querySelectorAll('.perfil-tabs a');
  const tabContents = document.querySelectorAll('.perfil-form-conteudo .aba-conteudo');

  tabLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault(); 
      const tabId = this.getAttribute('data-tab'); 

      tabLinks.forEach(navLink => navLink.classList.remove('active'));
      tabContents.forEach(content => content.style.display = 'none');

      this.classList.add('active');
      const targetContent = document.getElementById(tabId);
      if (targetContent) {
          targetContent.style.display = 'block';
      }
    });
  });

  const specialtyButtons = document.querySelectorAll('.btn-especialidade');
  specialtyButtons.forEach(button => {
    button.addEventListener('click', function() {
      this.classList.toggle('active');
    });
  });
  // --- FIM DO SEU CÓDIGO ORIGINAL ---


  // --- SELETORES GLOBAIS DE BUSCA E FILTRO ---
  const inputBusca = document.querySelector('.input-busca input');
  const selectArea = document.querySelector('.grupo-filtro:nth-child(1) select');
  const selectExperiencia = document.querySelector('.grupo-filtro:nth-child(2) select');
  const selectPreco = document.querySelector('.grupo-filtro:nth-child(3) select');
  const selectAvaliacao = document.querySelector('.grupo-filtro:nth-child(4) select');
  const contagemResultados = document.querySelector('.contagem-resultados');
  const areaResultados = document.querySelector('.area-resultados');
  const btnLimparFiltros = document.querySelector('.btn-limpar-filtros');
  const caixaEstadoVazio = document.querySelector('.caixa-estado-vazio');

  // --- FUNÇÃO AUXILIAR PARA CRIAR O CARTÃO DO MENTOR  ---
  function criarCartaoMentor(mentor) {
      // Formata a avaliação para mostrar 5.0 
      const avaliacaoFormatada = mentor.avaliacao.toFixed(1);
      // Formata o valor da hora
      let valorFormatado;
      if (mentor.valorHora === 0) {
          valorFormatado = "Gratuito";
      } else {
          valorFormatado = `R$ ${mentor.valorHora.toFixed(2).replace('.', ',')}/hora`;
      }
      
      // Usa nivelExperiencia para exibição, mas o filtro usará a propriedade 'experiencia'
      const nivel = mentor.nivelExperiencia || 'Não Informado';

      const html = `
          <div class="caixa-mentor">
              <div class="info-mentor">
                  <div class="avatar-mentor"></div>
                  <div>
                      <h4>${mentor.nome}</h4>
                      <div class="avaliacao">
                          <i class="fas fa-star"></i> 
                          <span>${avaliacaoFormatada} (${mentor.sessoes || 0} sessões)</span>
                      </div>
                  </div>
              </div>
              <p class="biografia">${mentor.biografia || 'Sem biografia.'}</p>
              <div class="habilidades">
                  ${(mentor.areasDeInteresse || []).map(area => `<span class="tag-habilidade">${area}</span>`).join('')}
              </div>
              <div class="detalhes">
                  <span>Nível: ${nivel}</span> 
                  <span class="separador">|</span> 
                  <span>${valorFormatado}</span>
              </div>
              <div class="area-botoes">
                  <button class="btn-perfil" data-mentor-id="${mentor.id}">Ver Perfil</button>
                  <button class="btn-agendar-mentor" data-mentor-id="${mentor.id}">Agendar</button>
              </div>
          </div>
      `;
      return html;
  }

  // --- FUNÇÃO PRINCIPAL: BUSCAR E FILTRAR MENTORES ---
  function buscarEFiltrarMentores() {
      const termoBusca = inputBusca.value.toLowerCase().trim();
      const filtroArea = selectArea.value;
      const filtroExperiencia = selectExperiencia.value;
      const filtroPreco = selectPreco.value;
      const filtroAvaliacao = selectAvaliacao.value;

      let resultados = mentoresData.filter(mentor => {
          
          // Verifica se o usuário é realmente um mentor (deveria ser sempre true aqui)
          if (mentor.tipoConta !== 'mentor') return false; 
          
          // 1. Filtro por Termo de Busca (Nome, Biografia, Habilidades)
          const habilidades = (mentor.areasDeInteresse || []).join(' ');
          const textoCompleto = (mentor.nome + ' ' + (mentor.biografia || '') + ' ' + habilidades).toLowerCase();
          if (termoBusca && !textoCompleto.includes(termoBusca)) {
              return false;
          }

          // 2. Filtro por Área
          if (filtroArea !== 'Todas as áreas' && mentor.area !== filtroArea) {
              return false;
          }

          // 3. Filtro por Experiência (Usando a propriedade 'experiencia' que é o texto no option, e 'nivelExperiencia' que é o valor salvo)
          if (filtroExperiencia !== 'Todos os níveis' && (mentor.nivelExperiencia || '').toLowerCase() !== filtroExperiencia.toLowerCase()) {
              return false;
          }

          // 4. Filtro por Preço
          if (filtroPreco !== 'Qualquer preço') {
              const preco = mentor.valorHora || 0;
              if (filtroPreco === 'Gratuito' && preco > 0) return false;
              if (filtroPreco === 'Até R$50' && (preco > 50 || preco === 0)) return false;
              if (filtroPreco === 'R$51 - R$150' && (preco <= 50 || preco > 150)) return false;
              if (filtroPreco === 'Acima de R$150' && preco <= 150) return false;
          }

          // 5. Filtro por Avaliação
          if (filtroAvaliacao !== 'Qualquer nota') {
              const avaliacao = mentor.avaliacao || 0;
              if (filtroAvaliacao === '5 Estrelas' && avaliacao < 5) return false;
              if (filtroAvaliacao === '4+ Estrelas' && avaliacao < 4) return false;
              if (filtroAvaliacao === '3+ Estrelas' && avaliacao < 3) return false;
          }

          return true; // Passou em todos os filtros
      });

      // --- RENDERIZAÇÃO DOS RESULTADOS ---
      
      const gradeAnterior = areaResultados.querySelector('.grade-mentores');
      if (gradeAnterior) {
          gradeAnterior.remove();
      }

      if (resultados.length > 0) {
          contagemResultados.textContent = `${resultados.length} Mentores Encontrados`;
          caixaEstadoVazio.style.display = 'none';

          const gradeResultados = document.createElement('div');
          gradeResultados.classList.add('grade-mentores');
          
          resultados.forEach(mentor => {
              gradeResultados.innerHTML += criarCartaoMentor(mentor);
          });
          
          areaResultados.appendChild(gradeResultados);

      } else {
          contagemResultados.textContent = `0 Mentores Encontrados`;
          caixaEstadoVazio.style.display = 'flex'; 
      }

      document.querySelectorAll('.btn-agendar-mentor').forEach(btn => {
          btn.addEventListener('click', function() {
              const mentorId = this.getAttribute('data-mentor-id');
              window.location.href = `../agendamentodementor/agendamento.html?id=${mentorId}`;
          });
      });
  }

  //BUSCA E FILTRAGEM 
  
  // 1. Botão Limpar Filtros (Funcional)
  btnLimparFiltros.addEventListener('click', function() {
      // Limpa os campos de input e select
      inputBusca.value = '';
      selectArea.value = 'Todas as áreas';
      selectExperiencia.value = 'Todos os níveis';
      selectPreco.value = 'Qualquer preço';
      selectAvaliacao.value = 'Qualquer nota';
      
      buscarEFiltrarMentores(); // Re-executa a busca com os filtros limpos
  });
  
  // 2. Input de Busca
  inputBusca.addEventListener('input', buscarEFiltrarMentores);
  
  // 3. Dropdowns de Filtro
  selectArea.addEventListener('change', buscarEFiltrarMentores);
  selectExperiencia.addEventListener('change', buscarEFiltrarMentores);
  selectPreco.addEventListener('change', buscarEFiltrarMentores);
  selectAvaliacao.addEventListener('change', buscarEFiltrarMentores);


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


  // LÓGICA DE PREENCHIMENTO DE DADOS DO USUÁRIO 
  function preencherDadosUsuario(usuario) {
    if (!usuario) return;

    // CHAMADA PARA EXIBIR A FOTO CARREGADA
    exibirFoto(usuario.fotoBase64);

    document.querySelectorAll(".nome-usuario").forEach(el => {
      if (el) el.innerText = usuario.nome || '[Nome]';
    });

    document.querySelectorAll(".email-usuario").forEach(el => {
      if (el) el.innerText = usuario.email || 'email@gmail.com';
    });
  }

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
  // --- FIM DA LÓGICA DE PREENCHIMENTO ---


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

  // ---- 2. LÓGICA DE SAIR ----
  const logoutButton = document.querySelector(".sair a");
  if (logoutButton) {
    logoutButton.addEventListener("click", function(event) {
      event.preventDefault();
      localStorage.removeItem('usuarioCadastrado'); 
      localStorage.removeItem('userAccountType');
      window.location.href = "../homepage/homepage.html";
    });
  }

  // --- INICIALIZAÇÃO ---
  buscarEFiltrarMentores(); 
});