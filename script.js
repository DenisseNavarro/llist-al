const date = document.querySelector('#profileContainer__date');
const list = document.querySelector('#list');
const input = document.querySelector('#input');
const buttonEnter = document.querySelector('#enter');
const check = 'fa-check-circle';
const uncheck = 'fa-circle';
const lineTrough = 'line-trought';
let id;
let LIST;

const DATE = new Date();
profileContainer__date.innerHTML = DATE.toLocaleDateString('es', { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

function addTask(task, id, done, removed) {
    if (removed) {
        return;
    }

    const DONE = done ? check : uncheck;
    const LINE = done ? lineTrough : '';

    const element = `
        <li class="taskListContainer__item" id="${id}">
            <i class="far ${DONE}" data="done"></i>
            <p class="taskListContainer__text ${LINE}" contenteditable="false">${task}</p>
            <div class="icons">
            <i class="fas fa-trash de"  id ="trash"data="removed"></i>
            <i class="fas fa-edit edit" id="edit" data="edit"></i></div>
        </li>
    `;
    list.insertAdjacentHTML('beforeend', element);
}

function taskDone(element) {
    element.classList.toggle(check);
    element.classList.toggle(uncheck);
    element.parentNode.querySelector('.taskListContainer__text').classList.toggle(lineTrough);
    const taskId = element.parentNode.id;
    LIST[taskId].done = !LIST[taskId].done;
    localStorage.setItem('TODO', JSON.stringify(LIST));
}

function taskRemoved(element) {
    const taskId = element.closest('.taskListContainer__item').id;
    element.closest('.taskListContainer__item').remove();
    LIST[taskId].removed = true;
    localStorage.setItem('TODO', JSON.stringify(LIST));
    bindEditButtons();
}

function editTask(element) {
    const taskId = element.closest('.taskListContainer__item').id;
    const textElement = element.closest('.taskListContainer__item').querySelector('.taskListContainer__text');
    textElement.contentEditable = true;
    textElement.focus();

    textElement.addEventListener('blur', () => {
        textElement.contentEditable = false;
        LIST[taskId].nombre = textElement.innerText;
        localStorage.setItem('TODO', JSON.stringify(LIST));
    });
}


buttonEnter.addEventListener('click', () => {
    const task = input.value.trim();
    if (task) {
        addTask(task, id, false, false);
        LIST.push({
            nombre: task,
            done: false,
            removed: false
        });
        bindEditButtons();
        localStorage.setItem('TODO', JSON.stringify(LIST));
        input.value = '';
        id++;
    }
});

document.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        const task = input.value.trim();
        if (task) {
            addTask(task, id, false, false);
            LIST.push({
                nombre: task,
                done: false,
                removed: false
            });
            bindEditButtons();
            localStorage.setItem('TODO', JSON.stringify(LIST));
            input.value = '';
            id++;
        }
    }
});

function bindEditButtons() {
    const editButtons = document.querySelectorAll('.edit');
    editButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            editTask(event.target);
        });
    });
}

list.addEventListener('click', function (event) {
    const element = event.target;
    const elementData = element.getAttribute('data');
    if (elementData === 'done') {
        taskDone(element);
    } else if (elementData === 'removed') {
        taskRemoved(element);
    } else if (elementData === 'edit') {
        editTask(element);
    }
});

function loadList(DATA) {
    DATA.forEach(function (task, index) {
        addTask(task.nombre, index, task.done, task.removed);
    });
    bindEditButtons();
}

let data = localStorage.getItem('TODO');
if (data) {
    LIST = JSON.parse(data);
    id = LIST.length;
    loadList(LIST);
} else {
    LIST = [];
    id = 0;
}
