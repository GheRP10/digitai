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
    const totalPalavrasNivel2 = palavrasNivel2.length;
    const progressoChave = 'progressoNivel2';
    const nivelAtual = 2;

    // ======================================================
    // 3. FUNÇÕES DE PROGRESSO
    // ======================================================
    function salvarProgresso() {
        localStorage.setItem('digitaiProgresso', JSON.stringify(estadoJogo));
    }

    function carregarDadosIniciais() {
        const urlParams = new URLSearchParams(window.location.search);
        const reiniciar = urlParams.get('reiniciar');

        const progressoSalvo = localStorage.getItem('digitaiProgresso');
        if (progressoSalvo) {
            estadoJogo = JSON.parse(progressoSalvo);
            if (!estadoJogo[progressoChave]) {
                estadoJogo[progressoChave] = { indice: 0, acertos: 0 };
            }

            if (reiniciar === 'true') {
                estadoJogo[progressoChave].indice = 0;
                estadoJogo[progressoChave].acertos = 0;
                salvarProgresso();
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
        progressoNivelSpan.textContent = `${progresso.acertos} / ${totalPalavrasNivel2}`;
        inputPalavra.disabled = false;
        inputPalavra.value = '';
        corujaParabens.classList.remove('mostrar');
        document.body.classList.remove('card-ativo');
        apresentarNovaPalavra();
        inputPalavra.focus();
    }

    function mostrarCardProximoNivel() {
        const cardContainer = document.createElement('div');
        cardContainer.id = 'card-proximo-nivel';
        cardContainer.className = 'intro-card';

        cardContainer.innerHTML = `
            <div class="card text-center">
                <button id="btn-fechar-card" class="btn-close position-absolute top-0 end-0 m-2" aria-label="Fechar"></button>
                <div class="card-body">
                    <h3 class="card-title">Nível 2 Concluído!</h3>
                    <p class="card-text">Você foi incrível! Que tal um novo desafio?</p>
                    <hr>
                    <h5 class="card-title">Próximo: Nível 3 - Acentuação</h5>
                    <p class="card-text">Domine palavras com acentos e 'ç'.</p>
                    <a href="nivel3.html" id="btn-proximo-nivel" class="btn btn-success btn-lg">Vamos lá!</a>
                </div>
            </div>
        `;

        document.body.appendChild(cardContainer);
        document.body.classList.add('card-ativo');

        setTimeout(() => {
            cardContainer.classList.add('mostrar');
            document.getElementById('btn-proximo-nivel').focus();
        }, 10);


        const btnFechar = document.getElementById('btn-fechar-card');
        btnFechar.addEventListener('click', () => {
            cardContainer.remove();
            document.body.classList.remove('card-ativo');
        });
    }

    function apresentarNovaPalavra() {
        const progresso = estadoJogo[progressoChave];
        const indiceAtual = progresso.indice;

        if (indiceAtual >= totalPalavrasNivel2) {
            palavraDisplay.textContent = "Nível 2 COMPLETO!";
            inputPalavra.value = 'PARABÉNS!';
            inputPalavra.disabled = true;
            corujaParabens.classList.add('mostrar');

            if (!estadoJogo.niveisConcluidos) estadoJogo.niveisConcluidos = [];
            if (!estadoJogo.niveisConcluidos.includes(nivelAtual)) {
                estadoJogo.niveisConcluidos.push(nivelAtual);
                salvarProgresso();
            }

            setTimeout(() => {
                mostrarCardProximoNivel();
            }, 2500);

            return;
        }
        const palavraAtual = palavrasNivel2[indiceAtual];
        palavraDisplay.textContent = palavraAtual;
        inputPalavra.value = '';
        inputPalavra.focus();
        corujaParabens.classList.remove('mostrar');
    }

    function feedbackAcerto() {
        const progresso = estadoJogo[progressoChave];
        progresso.acertos++;
        progresso.indice++;
        contadorAcertosSpan.textContent = progresso.acertos;
        progressoNivelSpan.textContent = `${progresso.acertos} / ${totalPalavrasNivel2}`;
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
        const palavraDigitada = inputPalavra.value.toUpperCase();
        const palavraAtual = palavrasNivel2[estadoJogo[progressoChave].indice];
        if (palavraDigitada === palavraAtual) {
            feedbackAcerto();
        }
    });

    inputPalavra.addEventListener('keydown', (event) => {
        if (inputPalavra.disabled) return;
        if (event.key === 'Enter') {
            event.preventDefault();
            const palavraDigitada = inputPalavra.value.toUpperCase();
            const palavraAtual = palavrasNivel2[estadoJogo[progressoChave].indice];
            if (palavraDigitada === '') return;
            if (palavraDigitada === palavraAtual) {
                feedbackAcerto();
            } else {
                feedbackErro();
            }
        }
    });

    document.addEventListener('keydown', (event) => {
        const card = document.getElementById('card-proximo-nivel');
        if (event.key === 'Enter' && card && card.classList.contains('mostrar')) {
            event.preventDefault();
            document.getElementById('btn-proximo-nivel').click();
        }
    });

    themeToggleBtn.addEventListener('click', toggleTheme);

    carregarDadosIniciais();
});