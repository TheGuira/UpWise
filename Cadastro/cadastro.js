document.addEventListener("DOMContentLoaded", function() {

 
  // 1. VARIÁVEIS DE LÓGICA DAS ETAPAS
  
  const steps = document.querySelectorAll('.form-step');
  const nextBtns = document.querySelectorAll('.next-btn');
  const backBtns = document.querySelectorAll('.back-btn');
  const progressBar = document.querySelector('.progress-bar');
  const tipoContaBtns = document.querySelectorAll('.tipo-conta');
  const areaBtns = document.querySelectorAll('.area');
  const cadastroForm = document.getElementById('cadastroForm');

  let currentStep = 0;
  let tipoContaSelecionada = null; // Acompanha a escolha (mentor/mentorado)

  
  // 2. VARIÁVEIS DE LÓGICA DE NAVEGAÇÃO
 
  const linkVoltar = document.querySelector(".back-link");
  const linksLogin = document.querySelectorAll(".login-text a");

 
  // 3. FUNÇÕES PRINCIPAIS
  

  // Atualiza a barra de progresso
  function updateProgressBar() {
    if (progressBar) {
        const percent = ((currentStep + 1) / steps.length) * 100;
        progressBar.style.width = percent + '%';
    }
  }

  // Lógica de seleção de Tipo de Conta (Etapa 1)
  tipoContaBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tipoContaBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      tipoContaSelecionada = btn.getAttribute('data-value');
    });
  });

  // Lógica de seleção de Áreas de Interesse (Etapa 3)
  areaBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('selected');
    });
  });

  // Lógica de AVANÇAR (Botões "Próximo")
  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      
      // Validação da Etapa 1 (Tipo de Conta)
      if (currentStep === 0) {
        if (!tipoContaSelecionada) {
          alert('Por favor, selecione se você é Mentor ou Mentorado.');
          return; // Para a execução, não avança
        }
      }
      
      // Validação de Email/Senha (Etapa 2)
    
      // Se passou nas validações, avança
      if (currentStep < steps.length - 1) {
        steps[currentStep].classList.remove('active');
        currentStep++;
        steps[currentStep].classList.add('active');
        updateProgressBar();
      }
    });
  });

  // Lógica de VOLTAR (Botões "Voltar")
  backBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 0) {
        steps[currentStep].classList.remove('active');
        currentStep--;
        steps[currentStep].classList.add('active');
        updateProgressBar();
      }
    });
  });

  // Lógica FINAL (Etapa 3 )
  if (cadastroForm) {
    cadastroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Validação final (caso o usuário tenha pulado algo)
      if (!tipoContaSelecionada) {
        alert("Um tipo de conta (Mentor ou Mentorado) é necessário. Volte para a Etapa 1.");
        return;
      }

      // Dados básicos (Etapa 1 e 2)
      const nome = document.getElementById('nome').value;
      const email = document.getElementById('email').value;
      const senha = document.getElementById('senha').value; 

      // Dados do perfil (Etapa 2, presumindo os IDs)
      const biografia = document.getElementById('biografia')?.value || '';
      const nivelExperiencia = document.getElementById('nivel_experiencia')?.value || '';
      const linkedin = document.getElementById('linkedin')?.value || '';

      // Dados de Interesse (Etapa 3)
      const areasSelecionadasBotoes = document.querySelectorAll('.area.selected');
      const areasDeInteresse = [];
      areasSelecionadasBotoes.forEach(botao => {
        areasDeInteresse.push(botao.innerText); // Pega o texto do botão (ex: "Programação")
      });

      const outrasAreas = document.getElementById('outras').value;

      const usuario = {
        nome: nome,
        email: email,
        senha: senha,
        tipoConta: tipoContaSelecionada,
        biografia: biografia,
        nivelExperiencia: nivelExperiencia,
        linkedin: linkedin,
        areasDeInteresse: areasDeInteresse, 
        outrasAreas: outrasAreas
      };

      //SALVAR O USUÁRIO NO LOCALSTORAGE ---
      localStorage.setItem('usuarioCadastrado', JSON.stringify(usuario));
      
      localStorage.removeItem('userAccountType'); 
      
      alert('Cadastro concluído! Redirecionando para o seu painel...');

      // Redirecionar para a home correta
      if (tipoContaSelecionada === 'mentor') {
        window.location.href = "../Painelmentor/homementor.html";
      } else {
        window.location.href = "../Painelmentorado/homementorado.html";
      }
    });
  }

  // LÓGICA DE NAVEGAÇÃO (Links de "Voltar" e "Login")
  
  // Link "Voltar ao início"
  if (linkVoltar) {
    linkVoltar.addEventListener("click", function(event) {
      event.preventDefault();
      window.location.href = "../index.html";
    });
  }

  // Links "Fazer login"
  linksLogin.forEach(link => {
    link.addEventListener("click", function(event) {
      event.preventDefault();
      window.location.href = "../login/login.html";
    });
  });


});
