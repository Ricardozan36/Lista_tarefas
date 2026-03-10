// 1. Seleção de Elementos (IDs atualizados para Português)
const formulario = document.querySelector('#formulario-tarefa');
const listaTarefas = document.querySelector('#lista-tarefas');
const filtroPrioridade = document.querySelector('#prioridade-filtro');
const filtroStatus = document.querySelector('#status-filtro');

// 2. Estado da Aplicação
let tarefas = JSON.parse(localStorage.getItem('minhas-tarefas')) || [];

// 3. Funções de Suporte
function atualizarDados() {
    localStorage.setItem('minhas-tarefas', JSON.stringify(tarefas));
    renderizar();
}

function obterCorPrioridade(prioridade) {
    switch (prioridade) {
        case 'Alta': return '#dc3545';
        case 'Média': return '#ffc107';
        case 'Baixa': return '#198754';
        default: return '#333';
    }
}

// 4. Lógica de Renderização
function renderizar() {
    listaTarefas.innerHTML = '';

    const prioridadeSelecionada = filtroPrioridade.value;
    const statusSelecionado = filtroStatus.value;

    // Filtra as tarefas baseado nos dropdowns da Navbar
    const tarefasFiltradas = tarefas.filter(t => {
        const matchPrioridade = prioridadeSelecionada === 'Todas' || t.prioridade === prioridadeSelecionada;
        const matchStatus = statusSelecionado === 'Todos' || t.status === statusSelecionado;
        return matchPrioridade && matchStatus;
    });

    if (tarefasFiltradas.length === 0) {
        listaTarefas.innerHTML = `
            <div style="text-align:center; padding:40px; color:#666;">
                <p>Nenhuma tarefa encontrada.</p>
            </div>`;
        return;
    }

    

    tarefasFiltradas.forEach(t => {
        const item = document.createElement('div');
        // Classes CSS atualizadas: item-tarefa e concluida
        item.className = `item-tarefa ${t.prioridade} ${t.status === 'Concluída' ? 'concluida' : ''}`;

        item.innerHTML = `
            <div class="info-tarefa">
                <span style="font-weight:bold; color:${obterCorPrioridade(t.prioridade)}">${t.prioridade}</span>
                <h3>${t.titulo}</h3>
                <p>${t.descricao}</p>
            </div>
            <div class="meta-tarefa">
                <span>📅 ${t.dataCriacao}</span><br>
                <strong>${t.status}</strong>
            </div>
            <div class="acoes">
                <button class="btn-acao btn-concluir" onclick="alternarStatus(${t.id})" title="Marcar como concluída">
                    <i class="fa-solid ${t.status === 'Concluída' ? 'fa-circle-left' : 'fa-circle-check'}"></i>
                </button>
                <button class="btn-acao btn-excluir" onclick="excluirTarefa(${t.id})" title="Excluir">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
        listaTarefas.appendChild(item);
    });
}

// 5. Gerenciamento de Tarefas

// Adicionar Nova (IDs dos inputs atualizados)
formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    const novaTarefa = {
        id: Date.now(),
        titulo: document.getElementById('titulo-tarefa').value,
        descricao: document.getElementById('descricao-tarefa').value,
        prioridade: document.getElementById('prioridade-tarefa').value,
        dataCriacao: new Date().toLocaleDateString('pt-BR'),
        status: 'Pendente'
    };

    tarefas.push(novaTarefa);
    formulario.reset();
    atualizarDados();
});

// Alternar Status (Pendente / Concluída)
window.alternarStatus = (id) => {
    tarefas = tarefas.map(t => {
        if (t.id === id) {
            return { ...t, status: t.status === 'Pendente' ? 'Concluída' : 'Pendente' };
        }
        return t;
    });
    atualizarDados();
};

// Excluir
window.excluirTarefa = (id) => {
    if (confirm('Deseja excluir esta tarefa?')) {
        tarefas = tarefas.filter(t => t.id !== id);
        atualizarDados();
    }
};

// 6. Listeners para os Filtros
filtroPrioridade.addEventListener('change', renderizar);
filtroStatus.addEventListener('change', renderizar);

// Inicialização
renderizar();