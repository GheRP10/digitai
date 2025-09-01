document.addEventListener('DOMContentLoaded', () => {
    const telaInicial = document.getElementById('tela-inicial');
    const telaNiveis = document.getElementById('tela-niveis');
    const formNome = document.getElementById('form-nome');
    const inputNome = document.getElementById('input-nome');
    const spanNomeUsuario = document.getElementById('nome-usuario');
    const listaNiveisDiv = document.getElementById('lista-niveis');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const btnDesbloquearTudo = document.getElementById('btn-desbloquear-tudo');

    let estadoJogo = {};

    function carregarMenu() {
        const progressoSalvo = localStorage.getItem('digitaiProgresso');
        if (progressoSalvo) {
            estadoJogo = JSON.parse(progressoSalvo);
            spanNomeUsuario.textContent = estadoJogo.nomeUsuario;

            if (estadoJogo.temaPreferido === 'dark') {
                document.body.classList.add('dark-mode');
                themeToggleBtn.textContent = 'Mudar Tema ☀️';
            } else {
                document.body.classList.remove('dark-mode');
                themeToggleBtn.textContent = 'Mudar Tema 🌙';
            }

            telaInicial.classList.add('d-none');
            telaNiveis.classList.remove('d-none');

            mostrarNiveis(estadoJogo);
        }
    }

    function mostrarNiveis(estadoJogo) {
        listaNiveisDiv.innerHTML = '';
        const niveisConcluidos = estadoJogo.niveisConcluidos || [];

        listaNiveisDiv.appendChild(criarCardElemento(1, "Básico", "Aprenda a localização das letras.", true, niveisConcluidos.includes(1)));
        listaNiveisDiv.appendChild(criarCardElemento(2, "Diferentes formatos", "Treine o uso das teclas Shift e Caps Lock.", niveisConcluidos.includes(1), niveisConcluidos.includes(2)));
        listaNiveisDiv.appendChild(criarCardElemento(3, "Acentuação", "Domine palavras com acentos e 'ç'.", niveisConcluidos.includes(2), niveisConcluidos.includes(3)));
        listaNiveisDiv.appendChild(criarCardElemento(4, "Ditados", "Teste sua precisão com frases e ditados.", niveisConcluidos.includes(3), niveisConcluidos.includes(4)));
        listaNiveisDiv.appendChild(criarCardElemento(5, "Números", "Trabalhe o uso de números e operações básicas.", niveisConcluidos.includes(4), niveisConcluidos.includes(5)));
        listaNiveisDiv.appendChild(criarCardElemento(6, "Mensagens", "Pratique a escrita de frases do dia a dia.", niveisConcluidos.includes(5), niveisConcluidos.includes(6)));
    }

    function criarCardElemento(numeroNivel, titulo, descricao, desbloqueado, concluido) {
        const cardElemento = document.createElement('div');
        cardElemento.className = 'col-md-4';

        let cardHTML = `
            <div class="card text-center h-100 ${!desbloqueado ? 'bg-light text-muted' : ''}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">Nível ${numeroNivel} - ${titulo}</h5>
        `;

        if (concluido) {
            cardHTML += `
                    <p class="card-text text-success fw-bold">Nível Concluído!</p>
                    <a href="nivel${numeroNivel}.html?reiniciar=true" class="btn btn-outline-success mt-auto">Jogar Novamente</a>
            `;
        } else if (desbloqueado) {
            cardHTML += `
                    <p class="card-text">${descricao}</p>
                    <a href="nivel${numeroNivel}.html" class="btn btn-success mt-auto">Jogar Nível ${numeroNivel}</a>
            `;
        } else {
            cardHTML += `
                    <p class="card-text">Conclua o Nível ${numeroNivel - 1} para desbloquear.</p>
                    <a href="#" class="btn btn-secondary disabled mt-auto" aria-disabled="true">Bloqueado</a>
            `;
        }
        cardHTML += `</div></div>`;
        cardElemento.innerHTML = cardHTML;
        return cardElemento;
    }

    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        estadoJogo.temaPreferido = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('digitaiProgresso', JSON.stringify(estadoJogo));

        if (estadoJogo.temaPreferido === 'dark') {
            themeToggleBtn.textContent = 'Mudar Tema ☀️';
        } else {
            themeToggleBtn.textContent = 'Mudar Tema 🌙';
        }
    }

    formNome.addEventListener('submit', (event) => {
        event.preventDefault();
        const nome = inputNome.value.trim();
        if (nome) {
            const novoEstado = {
                nomeUsuario: nome,
                temaPreferido: 'light',
                progressoNivel1: { indice: 0, acertos: 0 },
                progressoNivel2: { indice: 0, acertos: 0 },
                progressoNivel3: { indice: 0, acertos: 0 },
                progressoNivel4: { indice: 0, acertos: 0 },
                progressoNivel5: { indice: 0, acertos: 0 },
                progressoNivel6: { indice: 0, acertos: 0 },
                niveisConcluidos: []
            };
            localStorage.setItem('digitaiProgresso', JSON.stringify(novoEstado));
            carregarMenu();
        }
    });

    themeToggleBtn.addEventListener('click', toggleTheme);

    btnDesbloquearTudo.addEventListener('click', () => {
        if (confirm('Isso irá desbloquear todos os níveis apenas para teste. Deseja continuar?')) {
            estadoJogo.niveisConcluidos = [1, 2, 3, 4, 5];
            localStorage.setItem('digitaiProgresso', JSON.stringify(estadoJogo));
            // Recarregar o menu para mostrar a mudança
            mostrarNiveis(estadoJogo);
            alert('Todos os níveis foram desbloqueados!');
        }
    });

    carregarMenu();
});