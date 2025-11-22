document.addEventListener("DOMContentLoaded", function() {

  // Seletores para a Foto
  const avatarLateral = document.querySelector(".barra-lateral .avatar");

  // --- FUNÇÃO PARA EXIBIR A FOTO (Copilado de perfilmentor.js) ---
  function exibirFoto(base64Image) {
      if (avatarLateral) {
          if (base64Image) {
              avatarLateral.style.backgroundImage = `url(${base64Image})`;
              avatarLateral.style.backgroundSize = 'cover';
              avatarLateral.style.backgroundPosition = 'center';
              avatarLateral.style.backgroundColor = 'transparent'; // Remove o fundo padrão
          } else {
              // Limpar foto se não houver (voltando ao estado original)
              avatarLateral.style.backgroundImage = 'none';
              avatarLateral.style.backgroundColor = '#e6e9ee'; // Volta ao fundo cinza (assumindo #e6e9ee como padrão)
          }
      }
  }
  // --- FIM DA FUNÇÃO PARA EXIBIR A FOTO ---


  function preencherDadosUsuario(usuario) {
    if (!usuario) return;

    // --- NOVO: Carregar e exibir a foto, se existir ---
    exibirFoto(usuario.fotoPerfil || null);
    // --------------------------------------------------

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
  }
  
  const logoutButton = document.querySelector(".sair a");
  if (logoutButton) {
    logoutButton.addEventListener("click", function(event) {
      event.preventDefault();
      // Adicionando a remoção de itens para um logout completo (como no perfilmentor.js)
      localStorage.removeItem('usuarioCadastrado'); 
      localStorage.removeItem('userAccountType');
      window.location.href = "../HomePage/homepage.html"; // Ajustado para o caminho 'homepage.html'
    });
  }
  
  // Navegação da Barra Lateral 
  document.querySelectorAll(".barra-lateral nav li").forEach(li => {
  li.addEventListener("click", function() {
      const dataLink = this.getAttribute('data-link'); 
      // A lógica de navegação foi simplificada para a URL alvo
      let targetUrl = null;
      if (dataLink === "inicio") { 
        targetUrl = "../painelmentor/homementor.html"; 
      } else if (dataLink === "minha-agenda") { 
        targetUrl = "../agendamentor/agendamentor.html"; 
      } else if (dataLink === "minhas-sessoes") {
        targetUrl = "../mentorsessoes/sessoesmentor.html"; 
      } else if (dataLink === "perfil") { 
        targetUrl = "../perfilmentor/perfilmentor.html"; 
      } else if (dataLink === "chat") {
        alert("Página 'Chat' ainda não implementada.");
        return;
      } else if (dataLink === "Avaliação") {
        alert("Página 'Avaliação' ainda não implementada.");
        return;
      } 
      
      if (targetUrl) {
          window.location.href = targetUrl;
      }
    });
  });


  // --- LÓGICA DA PÁGINA DE AGENDA ---

  const monthYearEl = document.getElementById('month-year');
  const calendarDaysEl = document.getElementById('calendar-days');
  const prevMonthBtn = document.getElementById('prev-month');
  const nextMonthBtn = document.getElementById('next-month');
  const dataSelecionadaCabecalhoEl = document.getElementById('data-selecionada-cabecalho');

  // Elementos da Disponibilidade Atual
  const diasAtuaisEl = document.getElementById('dias-atuais');
  const horariosAtuaisEl = document.getElementById('horarios-atuais');
  const valorAtualEl = document.getElementById('valor-atual');
  const valorCombinarEl = document.getElementById('valor-combinar');

  const CHAVE_DISPONIBILIDADE = 'mentorDisponibilidade';
  let dataAtual = new Date();
  let dataSelecionada = new Date();

  // --- LÓGICA DO CALENDÁRIO ---
  const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  // Função de formato de data ATUALIZADA
  function formatarDataCabecalho(date) {
    return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  function renderizarCalendario() {
    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();
    monthYearEl.innerText = `${meses[mes]} ${ano}`;
    calendarDaysEl.innerHTML = '';
    const primeiroDiaMes = new Date(ano, mes, 1).getDay();
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();
    const hoje = new Date();

    for (let i = 0; i < primeiroDiaMes; i++) {
      const diaEl = document.createElement('div');
      diaEl.classList.add('dia', 'outro-mes');
      calendarDaysEl.appendChild(diaEl);
    }

    for (let i = 1; i <= diasNoMes; i++) {
      const diaEl = document.createElement('div');
      diaEl.classList.add('dia');
      diaEl.innerText = i;
      const diaDate = new Date(ano, mes, i);

      if (diaDate.toDateString() === hoje.toDateString() && diaDate.toDateString() !== dataSelecionada.toDateString()) {
        diaEl.classList.add('hoje');
      }
      if (diaDate.toDateString() === dataSelecionada.toDateString()) {
        diaEl.classList.add('selecionado');
        // Atualiza o cabeçalho da data
        dataSelecionadaCabecalhoEl.innerText = formatarDataCabecalho(dataSelecionada);
      }

      diaEl.addEventListener('click', () => {
        dataSelecionada = new Date(ano, mes, i);
        document.querySelectorAll('.dia.selecionado').forEach(d => d.classList.remove('selecionado'));
        // Re-aplica a classe 'hoje' se o dia de hoje for des-selecionado
        document.querySelectorAll('.dia.hoje').forEach(d => d.classList.remove('hoje'));
        const hojeEl = Array.from(calendarDaysEl.children).find(d => d.innerText == hoje.getDate() && dataAtual.getMonth() === hoje.getMonth() && dataAtual.getFullYear() === hoje.getFullYear());
        if (hojeEl && dataSelecionada.toDateString() !== hoje.toDateString()) {
            hojeEl.classList.add('hoje');
        }
        
        diaEl.classList.add('selecionado');
        diaEl.classList.remove('hoje'); // Dia selecionado não é 'hoje'
        
        // Atualiza o cabeçalho da data
        dataSelecionadaCabecalhoEl.innerText = formatarDataCabecalho(dataSelecionada);
        // Lógica para carregar sessões (se houver)
      });
      calendarDaysEl.appendChild(diaEl);
    }
  }

  prevMonthBtn.addEventListener('click', () => {
    dataAtual.setMonth(dataAtual.getMonth() - 1);
    renderizarCalendario();
  });

  nextMonthBtn.addEventListener('click', () => {
    dataAtual.setMonth(dataAtual.getMonth() + 1);
    renderizarCalendario();
  });

  // --- LÓGICA DE CARREGAR DISPONIBILIDADE (VISUALIZAÇÃO) ---

  function carregarDisponibilidadeAtual() {
    const dadosSalvos = JSON.parse(localStorage.getItem(CHAVE_DISPONIBILIDADE));

    if (!dadosSalvos || (!dadosSalvos.dias || !dadosSalvos.dias.length) && (!dadosSalvos.horarios || !dadosSalvos.horarios.length) && !dadosSalvos.valor) {
      diasAtuaisEl.innerHTML = '<span class="vazio">Nenhum dia definido</span>';
      horariosAtuaisEl.innerHTML = '<span class="vazio">Nenhum horário definido</span>';
      valorAtualEl.style.display = 'none';
      valorCombinarEl.style.display = 'inline-block'; 
      return;
    }

    // Dias
    if (dadosSalvos.dias && dadosSalvos.dias.length > 0) {
      diasAtuaisEl.innerHTML = dadosSalvos.dias
        .map(dia => `<span class="tag">${dia}</span>`).join('');
    } else {
      diasAtuaisEl.innerHTML = '<span class="vazio">Nenhum dia definido</span>';
    }

    // Horários
    if (dadosSalvos.horarios && dadosSalvos.horarios.length > 0) {
        let tagsHorarios = '';
        const maxTags = 3; 
        tagsHorarios = dadosSalvos.horarios.slice(0, maxTags)
            .map(h => `<span class="tag">${h}</span>`).join('');
        
        if(dadosSalvos.horarios.length > maxTags) {
            tagsHorarios += ` <span class="tag">+${dadosSalvos.horarios.length - maxTags}</span>`;
        }
      horariosAtuaisEl.innerHTML = tagsHorarios;
    } else {
      horariosAtuaisEl.innerHTML = '<span class="vazio">Nenhum horário definido</span>';
    }

    // Valor
    if (dadosSalvos.valor && parseFloat(dadosSalvos.valor) > 0) { // Verifica se é um valor válido e positivo
      valorAtualEl.innerText = `R$ ${dadosSalvos.valor}`;
      valorAtualEl.style.display = 'inline-block';
      valorCombinarEl.style.display = 'none';
    } else {
      valorAtualEl.style.display = 'none';
      valorCombinarEl.style.display = 'inline-block';
    }
  }

  // --- LÓGICA DO MODAL ---
  
  const modalOverlay = document.getElementById('modal-disponibilidade');
  const btnAbrirModal = document.getElementById('btn-editar-disponibilidade');
  const btnFecharModal = document.getElementById('btn-modal-cancelar');
  const btnSalvarModal = document.getElementById('btn-modal-salvar');
  const modalBtnsDia = modalOverlay.querySelectorAll('.selecao-dias .btn-toggle');
  const modalBtnsHorario = modalOverlay.querySelectorAll('.selecao-horarios .btn-toggle');
  const modalInputValor = document.getElementById('input-valor-hora');

  // Adiciona funcionalidade de toggle aos botões
  function setupToggleButtons(buttons) {
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('ativo');
      });
    });
  }
  setupToggleButtons(modalBtnsDia);
  setupToggleButtons(modalBtnsHorario);

  // Carrega dados salvos no modal
  function carregarDisponibilidadeModal() {
    const dadosSalvos = JSON.parse(localStorage.getItem(CHAVE_DISPONIBILIDADE)) || {};
    
    // Reseta todos os botões
    modalBtnsDia.forEach(btn => btn.classList.remove('ativo'));
    modalBtnsHorario.forEach(btn => btn.classList.remove('ativo'));

    // Seleciona os dias salvos
    if (dadosSalvos.dias) {
      modalBtnsDia.forEach(btn => {
        if (dadosSalvos.dias.includes(btn.dataset.dia)) {
          btn.classList.add('ativo');
        }
      });
    }
    // Seleciona os horários salvos
    if (dadosSalvos.horarios) {
      modalBtnsHorario.forEach(btn => {
        if (dadosSalvos.horarios.includes(btn.dataset.horario)) {
          btn.classList.add('ativo');
        }
      });
    }
    // Preenche o valor
    modalInputValor.value = dadosSalvos.valor || '';
  }

  // Abre o modal
  btnAbrirModal.addEventListener('click', (e) => {
    e.preventDefault();
    carregarDisponibilidadeModal(); // Carrega dados atuais no modal
    modalOverlay.classList.add('visivel');
  });

  // Fecha o modal
  function fecharModal() {
    modalOverlay.classList.remove('visivel');
  }
  btnFecharModal.addEventListener('click', fecharModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) { // Fecha ao clicar fora
      fecharModal();
    }
  });

  // Salva as alterações do modal
  btnSalvarModal.addEventListener('click', () => {
    const diasSelecionados = Array.from(modalBtnsDia)
      .filter(btn => btn.classList.contains('ativo'))
      .map(btn => btn.dataset.dia);
    
    const horariosSelecionados = Array.from(modalBtnsHorario)
      .filter(btn => btn.classList.contains('ativo'))
      .map(btn => btn.dataset.horario);
      
    // Garante que o valor seja salvo como string, mas verifica se é numérico
    const valor = modalInputValor.value.trim();

    const novosDados = {
      dias: diasSelecionados,
      horarios: horariosSelecionados,
      valor: valor
    };

    // Salva no localStorage
    localStorage.setItem(CHAVE_DISPONIBILIDADE, JSON.stringify(novosDados));
    
    // Atualiza a visualização da disponibilidade na página
    carregarDisponibilidadeAtual(); 
    
    fecharModal();
  });


  // --- INICIALIZAÇÃO DA PÁGINA ---
  renderizarCalendario();
  carregarDisponibilidadeAtual();
  // Atualiza o cabeçalho com a data selecionada inicial
  dataSelecionadaCabecalhoEl.innerText = formatarDataCabecalho(dataSelecionada);

});