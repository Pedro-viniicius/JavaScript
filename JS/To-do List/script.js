// Carregar tarefas salvas ao iniciar
window.onload = function() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(function(task) {
        const li = createTaskElement(task.text, task.completed);
        document.getElementById('taskList').appendChild(li);
    });
};

// Função para criar elemento de tarefa
function createTaskElement(text, completed = false) {
    const li = document.createElement('li');
    li.textContent = text;
    if (completed) {
        li.classList.add('completed');
    }

    // Adicionar funcionalidade de marcação de tarefa concluída
    li.addEventListener('click', function() {
        li.classList.toggle('completed');
        updateTaskInLocalStorage(text, { completed: li.classList.contains('completed') });
    });

    // Adicionar funcionalidade de remoção ou edição de tarefa
    li.addEventListener('dblclick', function() {
        // Verificar se o item está em modo de edição
        if (!li.classList.contains('editing')) {
            // Iniciar edição
            const input = document.createElement('input');
            input.value = li.textContent;
            li.textContent = '';  // Limpar o conteúdo atual da tarefa
            li.appendChild(input);
            input.focus();
            li.classList.add('editing');

            // Salvar a tarefa ao pressionar Enter ou ao sair do campo (blur)
            input.addEventListener('blur', function() {
                const newText = input.value.trim();
                if (newText !== '') {
                    li.textContent = newText;
                    updateTaskInLocalStorage(text, { text: newText });
                } else {
                    li.textContent = text; // Caso o usuário não insira texto, manter o original
                }
                li.classList.remove('editing');
            });

            // Cancelar a edição se o usuário pressionar Esc
            input.addEventListener('keydown', function(event) {
                if (event.key === 'Escape') {
                    li.textContent = text; // Cancelar a edição
                    li.classList.remove('editing');
                }
            });
        }
    });

    return li;
}

// Atualizar tarefa no localStorage
function updateTaskInLocalStorage(oldText, updates) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(task => task.text === oldText);
    if (taskIndex !== -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

// Remover tarefa do localStorage
function removeTaskFromLocalStorage(text) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.filter(task => task.text !== text);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

// Adicionar nova tarefa ao clicar no botão
document.getElementById('addTaskButton').addEventListener('click', function() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value;

    if (taskText !== '') {
        const li = createTaskElement(taskText);
        document.getElementById('taskList').appendChild(li);
        taskInput.value = ''; // Limpar o campo de entrada

        // Salvar tarefa no localStorage
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push({ text: taskText, completed: false });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});



