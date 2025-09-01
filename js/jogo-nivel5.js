document.addEventListener('DOMContentLoaded', () => {
    // ======================================================
    // 1. SELEÇÃO DOS ELEMENTOS DO HTML (DOM)
    // ======================================================
    const spanNomeUsuario = document.getElementById('nome-usuario');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const palavraDisplay = document.getElementById('palavra-display');
    const inputPalavra = document.getElementById('input-palavra');
    const contadorAcertosSpan = document.getElementById('contador-acertos');
    const animacaoCoruja = document.getElementById('animacao-coruja');
    const somDeAcerto = new Audio('assets/som-acerto.mp3');
    const progressoNivelSpan = document.getElementById('progresso-nivel');
    const corujaParabens = document.getElementById('coruja-parabens');

    // ======================================================
    // 2. VARIÁVEIS DE ESTADO DO JOGO
    // ======================================================
    let estadoJogo = {};
    const totalDeOperacoes = 60;
    const progressoChave = 'progressoNivel5';
    const nivelAtual = 5;
    let respostaCorreta = '';

    // ======================================================
    // 3. FUNÇÕES DE PROGRESSO
    // ======================================================
    function salvarProgresso() {
        localStorage.setItem('digitaiProgresso', JSON.stringify(estadoJogo));
    }

    function carregarDadosIniciais() {
        const progressoSalvo = localStorage.getItem('digitaiProgresso');
        if (progressoSalvo) {
            estadoJogo = JSON.parse(progressoSalvo);
            if (!estadoJogo[progressoChave]) {
                estadoJogo[progressoChave] = { indice: 0, acertos: 0 };
            }
            spanNomeUsuario.textContent = estadoJogo.nomeUsuario;
            if (estadoJogo.temaPreferido === 'dark') {
                document.body.classList.add('dark-mode');
                themeToggleBtn.textContent = 'Mudar Tema ☀️';
            }
            iniciarJogo();
        } else {
            window.location.href = 'index.html';
        }
    }

    // ======================================================
    // 4. FUNÇÕES PRINCIPAIS DO JOGO
    // ======================================================
    function iniciarJogo() {
        const progresso = estadoJogo[progressoChave];
        contadorAcertosSpan.textContent = progresso.acertos;
        progressoNivelSpan.textContent = `${progresso.acertos} / ${totalDeOperacoes}`;
        inputPalavra.disabled = false;
        inputPalavra.value = '';
        inputPalavra.style.textTransform = 'none';
        inputPalavra.type = 'text';
        corujaParabens.classList.remove('mostrar');
        document.body.classList.remove('card-ativo');
        apresentarNovaPalavra();
        inputPalavra.focus();
    }

    //  GERAR AS 4 OPERAÇÕES
    function apresentarNovaPalavra() {
        const progresso = estadoJogo[progressoChave];
        const indiceAtual = progresso.indice;

        if (indiceAtual >= totalDeOperacoes) {
            palavraDisplay.textContent = "NÍVEL 5 COMPLETO!";
            inputPalavra.value = 'PARABÉNS!';
            inputPalavra.disabled = true;
            corujaParabens.classList.add('mostrar');

            if (!estadoJogo.niveisConcluidos) estadoJogo.niveisConcluidos = [];
            if (!estadoJogo.niveisConcluidos.includes(nivelAtual)) {
                estadoJogo.niveisConcluidos.push(nivelAtual);
                salvarProgresso();
            }
            return;
        }

        let operacao;
        const tipoDeConta = indiceAtual % 4; // 0=Soma, 1=Subtração, 2=Multiplicação, 3=Divisão

        if (tipoDeConta === 0) { // Soma
            let num1, num2;
            if (Math.random() < 0.75) {
                num1 = Math.floor(Math.random() * 90) + 10;
                num2 = Math.floor(Math.random() * 90) + 10;
            } else {
                num1 = Math.floor(Math.random() * 51) + 100;
                num2 = Math.floor(Math.random() * 51) + 100;
            }
            operacao = `${num1} + ${num2}`;
            respostaCorreta = (num1 + num2).toString();

        } else if (tipoDeConta === 1) { //  Subtração
            const num1 = Math.floor(Math.random() * 80) + 20;
            const num2 = Math.floor(Math.random() * num1); // Garantir que num2 seja menor que num1
            operacao = `${num1} - ${num2}`;
            respostaCorreta = (num1 - num2).toString();

        } else if (tipoDeConta === 2) { // Multiplicação
            const numA = Math.floor(Math.random() * 6) + 1;
            const numB = Math.floor(Math.random() * 10) + 1;

            if (Math.random() > 0.5) {
                operacao = `${numA} x ${numB}`;
                respostaCorreta = (numA * numB).toString();
            } else {
                operacao = `${numB} x ${numA}`;
                respostaCorreta = (numB * numA).toString();
            }
        } else { //  Divisão
            const divisor = Math.floor(Math.random() * 5) + 2; // de 2 a 6
            const quociente = Math.floor(Math.random() * 10) + 1; // de 1 a 10
            const dividendo = divisor * quociente;
            operacao = `${dividendo} ÷ ${divisor}`;
            respostaCorreta = quociente.toString();
        }

        palavraDisplay.textContent = operacao;
        inputPalavra.value = '';
        inputPalavra.focus();
        corujaParabens.classList.remove('mostrar');
    }

    function feedbackAcerto() {
        const progresso = estadoJogo[progressoChave];
        progresso.acertos++;
        progresso.indice++;
        contadorAcertosSpan.textContent = progresso.acertos;
        progressoNivelSpan.textContent = `${progresso.acertos} / ${totalDeOperacoes}`;
        try {
            somDeAcerto.play();
        } catch (error) {
            console.warn("Não foi possível tocar o som de acerto. Erro:", error);
        }
        animacaoCoruja.classList.add('mostrar');
        setTimeout(() => {
            animacaoCoruja.classList.remove('mostrar');
        }, 2000);
        salvarProgresso();
        apresentarNovaPalavra();
    }

    function feedbackErro() {
        inputPalavra.classList.add('shake');
        setTimeout(() => {
            inputPalavra.classList.remove('shake');
            inputPalavra.value = '';
        }, 500);
    }

    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        estadoJogo.temaPreferido = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        if (estadoJogo.temaPreferido === 'dark') {
            themeToggleBtn.textContent = 'Mudar Tema ☀️';
        } else {
            themeToggleBtn.textContent = 'Mudar Tema 🌙';
        }
        salvarProgresso();
    }

    // ======================================================
    // 5. EVENT LISTENERS E INICIALIZAÇÃO
    // ======================================================
    inputPalavra.addEventListener('input', () => {
        if (inputPalavra.disabled) return;
        const palavraDigitada = inputPalavra.value;
        if (palavraDigitada === respostaCorreta) {
            feedbackAcerto();
        }
    });

    inputPalavra.addEventListener('keydown', (event) => {
        if (inputPalavra.disabled) return;
        if (event.key === 'Enter') {
            event.preventDefault();
            const palavraDigitada = inputPalavra.value;
            if (palavraDigitada === '') return;
            if (palavraDigitada === respostaCorreta) {
                feedbackAcerto();
            } else {
                feedbackErro();
            }
        }
    });

    themeToggleBtn.addEventListener('click', toggleTheme);

    carregarDadosIniciais();
});