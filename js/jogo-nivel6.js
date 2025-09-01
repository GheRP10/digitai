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
    const totalPalavrasNivel6 = palavrasNivel6.length;
    const progressoChave = 'progressoNivel6';
    const nivelAtual = 6;
    let respostasPossiveis = [];

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
        progressoNivelSpan.textContent = `${progresso.acertos} / ${totalPalavrasNivel6}`;
        inputPalavra.disabled = false;
        inputPalavra.value = '';
        inputPalavra.style.textTransform = 'none';
        corujaParabens.classList.remove('mostrar');
        document.body.classList.remove('card-ativo');
        apresentarNovaPalavra();
        inputPalavra.focus();
    }

    function mostrarCardFinal() {
        const cardContainer = document.createElement('div');
        cardContainer.id = 'card-final';
        cardContainer.className = 'intro-card';
        cardContainer.innerHTML = `
            <div class="card text-center">
                <div class="card-body">
                    <h3 class="card-title">PARABÉNS!</h3>
                    <p class="card-text">Você concluiu com sucesso todos os níveis do Digitai!</p>
                    <p class="card-text">Sua jornada de aprendizado foi incrível. Continue praticando!</p>
                    <hr>
                    <p class="text-muted fst-italic mt-3">Meus parabéns e Agradecimentos by Gheizla Santos</p>
                    <a href="index.html" id="btn-voltar-menu" class="btn btn-primary btn-lg mt-3">Voltar ao Menu</a>
                </div>
            </div>
        `;
        document.body.appendChild(cardContainer);
        document.body.classList.add('card-ativo');
        setTimeout(() => {
            cardContainer.classList.add('mostrar');
            document.getElementById('btn-voltar-menu').focus();
        }, 10);
    }

    function apresentarNovaPalavra() {
        const progresso = estadoJogo[progressoChave];
        const indiceAtual = progresso.indice;

        if (indiceAtual >= totalPalavrasNivel6) {
            palavraDisplay.textContent = "JOGO CONCLUÍDO!";
            inputPalavra.value = 'VOCÊ CONSEGUIU!';
            inputPalavra.disabled = true;
            corujaParabens.classList.add('mostrar');

            if (!estadoJogo.niveisConcluidos) estadoJogo.niveisConcluidos = [];
            if (!estadoJogo.niveisConcluidos.includes(nivelAtual)) {
                estadoJogo.niveisConcluidos.push(nivelAtual);
                salvarProgresso();
            }
            setTimeout(() => {
                mostrarCardFinal();
            }, 3000);
            return;
        }

        const fraseAtual = palavrasNivel6[indiceAtual];
        palavraDisplay.textContent = fraseAtual;
        inputPalavra.value = '';
        inputPalavra.focus();
        corujaParabens.classList.remove('mostrar');

        respostasPossiveis = [];
        const dataDeHoje = new Date();
        const diasDaSemana = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];

        if (fraseAtual === "Que dia da semana é hoje?") {
            respostasPossiveis.push(diasDaSemana[dataDeHoje.getDay()]);
        } else if (fraseAtual === "Que data é hoje? XX/XX/XXXX") {
            const dia = String(dataDeHoje.getDate()).padStart(2, '0');
            const mes = String(dataDeHoje.getMonth() + 1).padStart(2, '0');
            const ano = dataDeHoje.getFullYear();
            respostasPossiveis.push(`${dia}/${mes}/${ano}`);
            respostasPossiveis.push(`${dia}.${mes}/${ano}`);
        } else if (fraseAtual === "Que horas são?") {
            const hora = String(dataDeHoje.getHours()).padStart(2, '0');
            const minuto = String(dataDeHoje.getMinutes()).padStart(2, '0');
            respostasPossiveis.push(`${hora}:${minuto}`);
            const proximoMinuto = new Date(dataDeHoje.getTime() + 60000);
            const proxHora = String(proximoMinuto.getHours()).padStart(2, '0');
            const proxMin = String(proximoMinuto.getMinutes()).padStart(2, '0');
            if (`${proxHora}:${proxMin}` !== `${hora}:${minuto}`) {
                respostasPossiveis.push(`${proxHora}:${proxMin}`);
            }
        } else {
            respostasPossiveis.push(fraseAtual);
        }
    }

    function feedbackAcerto() {
        const progresso = estadoJogo[progressoChave];
        progresso.acertos++;
        progresso.indice++;
        contadorAcertosSpan.textContent = progresso.acertos;
        progressoNivelSpan.textContent = `${progresso.acertos} / ${totalPalavrasNivel6}`;
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

    function verificarResposta(palavraDigitada) {
        const progresso = estadoJogo[progressoChave];
        if (!progresso || progresso.indice >= palavrasNivel6.length) return false;

        const fraseAtual = palavrasNivel6[progresso.indice];
        if (fraseAtual === "Que dia da semana é hoje?") {
            return respostasPossiveis.includes(palavraDigitada.toLowerCase());
        }
        return respostasPossiveis.includes(palavraDigitada);
    }

    // ======================================================
    // 5. EVENT LISTENERS E INICIALIZAÇÃO
    // ======================================================
    inputPalavra.addEventListener('input', () => {
        if (inputPalavra.disabled) return;
        if (verificarResposta(inputPalavra.value)) {
            feedbackAcerto();
        }
    });

    inputPalavra.addEventListener('keydown', (event) => {
        if (inputPalavra.disabled) return;
        if (event.key === 'Enter') {
            event.preventDefault();
            const palavraDigitada = inputPalavra.value;
            if (palavraDigitada === '') return;
            if (verificarResposta(palavraDigitada)) {
                feedbackAcerto();
            } else {
                feedbackErro();
            }
        }
    });

    document.addEventListener('keydown', (event) => {
        const card = document.getElementById('card-final');
        if (event.key === 'Enter' && card && card.classList.contains('mostrar')) {
            event.preventDefault();
            document.getElementById('btn-voltar-menu').click();
        }
    });

    themeToggleBtn.addEventListener('click', toggleTheme);

    carregarDadosIniciais();
});