document.addEventListener('DOMContentLoaded', () => {

    // --- VARIÁVEIS GLOBAIS ---
    let selectedDate = null;
    let selectedTime = null;


    // --- Seleção dos Elementos de Etapa ---
    const steps = document.querySelectorAll('.passo-agendamento');
    const stepperItems = document.querySelectorAll('.item-passo');

    // --- Seleção dos Botões de Navegação ---
    const btnBackToSearch = document.querySelector('.btn-voltar');
    const btnStep1Next = document.querySelector('#step-content-1 .btn-primario');
    // ATENÇÃO: Verificando se o seletor está correto para o botão de confirmação da Etapa 2
    const btnStep2Prev = document.querySelector('#step-content-2 .btn-secundario');
    const btnStep2Confirm = document.querySelector('#step-content-2 .btn-primario'); // Seletor correto
    const btnStep3MySessions = document.querySelector('#step-content-3 .btn-primario');

    // --- Lógica do Calendário Dinâmico ---
    const monthYearDisplay = document.getElementById('calendar-month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const calendarBody = document.getElementById('calendar-body');
    const timeSlots = document.querySelectorAll('.horario-slot');

    let currentDate = new Date();
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    // --- Elementos de Formulário e Resumo ---
    const duracaoSelect = document.getElementById('duracao');
    const topicosInput = document.getElementById('topicos');
    const observacaoTextarea = document.getElementById('observacao');

    // Elementos do Resumo (Etapa 2)
    const resumoData = document.querySelector('#step-content-2 .resumo-sessao .linha-resumo:nth-child(2) strong');
    const resumoHora = document.querySelector('#step-content-2 .resumo-sessao .linha-resumo:nth-child(3) strong');
    const resumoDuracao = document.querySelector('#step-content-2 .resumo-sessao .linha-resumo:nth-child(4) strong');
    const resumoTopicos = document.querySelector('#step-content-2 .resumo-sessao .linha-resumo:nth-child(5) strong');
    const resumoValor = document.querySelector('#step-content-2 .resumo-sessao .linha-resumo.total strong');

    // Elementos do Resumo (Etapa 3 - Sucesso)
    const sucessoDataHora = document.querySelector('#step-content-3 .container-sucesso p:nth-child(2)');

    // Elementos do Mentor (Para ler o nome, valor e duração do HTML)
    const mentorNameElement = document.querySelector('.cabecalho strong'); 
    const mentorValueElement = document.querySelector('.cartao-mentor .detalhes-info-mentor p:nth-child(1)'); 
    const mentorDurationElement = document.querySelector('.cartao-mentor .detalhes-info-mentor p:nth-child(2)'); 


 
    // --- LÓGICA DO PERFIL E BARRA LATERAL ---
   
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


    function preencherDadosUsuario(usuario) {
        if (!usuario) return;

        // Preenche o nome do usuário
        document.querySelectorAll(".nome-usuario").forEach(el => {
            if (el) el.innerText = usuario.nome || '[Nome]';
        });

        // Preenche o email do usuário
        document.querySelectorAll(".email-usuario").forEach(el => {
            if (el) el.innerText = usuario.email || 'email@gmail.com';
        });
    }

    /**
     * Lógica para carregar os dados ao iniciar a página e configurar o mentor.
     */
    function loadAndSetupData() {
        const usuarioString = localStorage.getItem('usuarioCadastrado');
        if (usuarioString) {
            try {
                const usuarioLogado = JSON.parse(usuarioString);
                preencherDadosUsuario(usuarioLogado);
                
                // NOVO: Chama para exibir a foto do usuário
                exibirFoto(usuarioLogado.fotoBase64);
                
            } catch (e) {
                console.error("Erro ao carregar dados do usuário:", e);
            }
        }
        
        // Configura a duração padrão no select para refletir a duração do mentor no HTML.
        const mentorDuration = mentorDurationElement ? mentorDurationElement.textContent.trim() : "1 hora";
        if (duracaoSelect) {
             // Define o valor padrão do select de duração
             duracaoSelect.value = duracaoSelect.querySelector(`option[value="${mentorDuration}"]`) ? mentorDuration : "1 hora";
        }
    }

    // ---- LÓGICA DE NAVEGAÇÃO DA BARRA LATERAL ----
    document.querySelectorAll(".barra-lateral nav li").forEach(li => {
        const dataLink = li.getAttribute('data-link'); 
        
        li.addEventListener("click", function() {
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

    // ---- LÓGICA DE SAIR (LOGOUT) ----
    const logoutButton = document.querySelector(".sair a");
    if (logoutButton) {
        logoutButton.addEventListener("click", function(event) {
            event.preventDefault();
            localStorage.removeItem('usuarioCadastrado');
            localStorage.removeItem('userAccountType');
            window.location.href = "../homepage/homepage.html";
        });
    }

    
    // --- LÓGICA DE AGENDAMENTO E CALENDÁRIO ---
    

    function renderCalendar(date) {
        calendarBody.innerHTML = '';
        const year = date.getFullYear();
        const month = date.getMonth();

        monthYearDisplay.textContent = `${monthNames[month]} ${year}`;

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const today = new Date();
        const currentDay = today.getDate();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        let dateNum = 1;

        for (let i = 0; i < 6; i++) {
            let row = document.createElement('tr');

            for (let j = 0; j < 7; j++) {
                let cell = document.createElement('td');

                if (i === 0 && j < firstDayOfMonth) {
                    // Células do mês anterior
                    cell.classList.add('outro-mes');
                    cell.textContent = new Date(year, month, 0).getDate() - firstDayOfMonth + 1 + j;
                } else if (dateNum > daysInMonth) {
                    // Células do próximo mês
                    cell.classList.add('outro-mes');
                    cell.textContent = dateNum - daysInMonth;
                    dateNum++;
                } else {
                    // Células do mês atual
                    const dayOfMonth = dateNum;
                    cell.textContent = dayOfMonth;

                    const fullDate = new Date(year, month, dayOfMonth);

                    // Desabilitar datas passadas
                    if (fullDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
                        cell.classList.add('desabilitado');
                    } else {
                        // Aplica classe 'hoje'
                        let isToday = (dayOfMonth === currentDay && month === currentMonth && year === currentYear);
                        if (isToday) {
                            cell.classList.add('hoje');
                        }
                        // Adiciona o listener de clique
                        cell.addEventListener('click', () => {
                            if (!cell.classList.contains('desabilitado')) {
                                document.querySelectorAll('#calendar-body td').forEach(el => el.classList.remove('selecionado'));
                                cell.classList.add('selecionado');
                                selectedDate = fullDate; 
                            }
                        });
                    }
                    dateNum++;
                }
                row.appendChild(cell);
            }
            calendarBody.appendChild(row);

            if (dateNum > daysInMonth && i > 3) break;
        }
    }


    /**
     * Função auxiliar para lidar com seleção de horários
     */
    function handleTimeSelection(elements, selectedClass) {
        elements.forEach(element => {
            element.addEventListener('click', () => {
                elements.forEach(el => el.classList.remove(selectedClass));
                element.classList.add(selectedClass);
                selectedTime = element.textContent; 
            });
        });
    }


    // --- Função Principal para Mudar de Etapa ---
    function goToStep(stepNumber) {
        steps.forEach(step => {
            step.classList.remove('active');
        });

        const activeStepContent = document.querySelector(`#step-content-${stepNumber}`);
        if (activeStepContent) {
            activeStepContent.classList.add('active');
        }

        stepperItems.forEach((stepper, index) => {
            const currentStep = index + 1;
            stepper.classList.remove('active', 'completed');

            if (currentStep < stepNumber) {
                stepper.classList.add('completed');
            } else if (currentStep === stepNumber) {
                stepper.classList.add('active');
            }
        });
    }

    /**
     * Atualiza o resumo da Etapa 2, lendo o valor e a duração do HTML.
     */
    function updateStep2Summary() {
        const mentorValue = mentorValueElement ? mentorValueElement.textContent.trim() : "R$ [Valor Faltando]";
        
        // Atualiza data e hora (selecionadas na Etapa 1)
        const dataFormatada = selectedDate ? selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : '[Selecione a Data]';
        resumoData.textContent = dataFormatada;
        resumoHora.textContent = selectedTime || '[Selecione a Hora]';

        // Atualiza duração (do select) e tópicos
        resumoDuracao.textContent = duracaoSelect.value;
        resumoTopicos.textContent = topicosInput.value || 'Não Informado';
        
        // Atualiza valor (Valor Fixo do Mentor lido do HTML)
        resumoValor.textContent = mentorValue; 
    }


    // --- EVENT LISTENERS ---

    // Navegação do Calendário
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', (e) => {
            e.preventDefault();
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar(currentDate);
        });
    }

    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', (e) => {
            e.preventDefault();
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar(currentDate);
        });
    }

    // Botão Voltar para a Busca
    if (btnBackToSearch) {
        btnBackToSearch.addEventListener('click', () => {
            window.location.href = '../buscadementor/busca.html';
        });
    }


    // Navegação Etapa 1 -> Etapa 2
    if (btnStep1Next) {
        btnStep1Next.addEventListener('click', (e) => {
            e.preventDefault();

            // Validação da Etapa 1
            if (!selectedDate || !selectedTime) {
                alert("Por favor, selecione uma data e um horário antes de prosseguir.");
                return;
            }

            // Atualiza Resumo da Etapa 2
            updateStep2Summary();

            goToStep(2);
        });
    }

    // Atualiza o resumo da Etapa 2 em tempo real (Duração/Tópicos)
    duracaoSelect.addEventListener('change', updateStep2Summary);
    topicosInput.addEventListener('input', updateStep2Summary);


    // Navegação Etapa 2 -> Etapa 3 (Confirmação)
    if (btnStep2Confirm) {
        btnStep2Confirm.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            // Verifica se a data e hora ainda estão válidas 
            if (!selectedDate || !selectedTime) {
                 alert("Erro: Data ou hora da sessão não foram definidas corretamente.");
                 return;
            }

            // ** Simulação da Lógica de Agendamento/Pagamento **
            const mentorName = mentorNameElement ? mentorNameElement.textContent.trim() : '[Mentor Desconhecido]';

            console.log('--- Confirmação de Agendamento ---');
            console.log('Mentor:', mentorName);
            console.log('Valor Fixo (Lido do HTML):', resumoValor.textContent);
            console.log('Data:', selectedDate.toLocaleDateString('pt-BR'));
            console.log('Hora:', selectedTime);
            console.log('Duração Escolhida:', duracaoSelect.value);
            console.log('Tópicos:', topicosInput.value);
            console.log('Observação:', observacaoTextarea.value);

            // Atualiza mensagem de Sucesso (Etapa 3)
            const dataSucesso = selectedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
            sucessoDataHora.innerHTML = `Sua sessão foi confirmada para **${dataSucesso}** às **${selectedTime}**`;

            goToStep(3);
        });
    }

    // Navegação Etapa 2 -> Etapa 1 (Voltar)
    if (btnStep2Prev) {
        btnStep2Prev.addEventListener('click', (e) => {
            e.preventDefault();
            goToStep(1);
        });
    }

    // Navegação Etapa 3 -> Minhas Sessões
    if (btnStep3MySessions) {
        btnStep3MySessions.addEventListener('click', () => {
            window.location.href = '../minhasessoes/minhasessoes.html';
        });
    }

    // --- Inicialização ---
    loadAndSetupData();
    renderCalendar(currentDate);
    handleTimeSelection(timeSlots, 'selecionado');
    goToStep(1);
});