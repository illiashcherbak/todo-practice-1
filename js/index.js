'use strict';

import {
  getTasksLocalStorage,
  setTasksLocalStorage,
  generateUniqueId,
  initSortableList,
  updateListTasks,
} from './utils.js';

const form = document.querySelector('.form');
const textareaForm = document.querySelector('.form__textarea');
const buttonSendForm = document.querySelector('.form__send-btn');
const buttonCancel = document.querySelector('.form__cancel-btn');
const output = document.querySelector('.output');
let editId = null;
let isEditTask = false;

updateListTasks();

//! All listeners
form.addEventListener('submit', sendTask);
buttonCancel.addEventListener('click', resetSendForm);

output.addEventListener('dragover', initSortableList);
output.addEventListener('dragenter', (event) => event.preventDefault());

output.addEventListener('click', (event) => {
  const taskElement = event.target.closest('.task__btns');

  if (!taskElement) return;

  if (event.target.closest('.task__pinned')) {
    pinnedTask(event);
  } else if (event.target.closest('.task__edit')) {
    editTask(event);
  } else if (event.target.closest('.task__del')) {
    delTask(event);
  } else if (event.target.closest('.task__done')) {
    doneTask(event);
  }
});

//! All functions
function sendTask(event) {
  event.preventDefault();

  const task = textareaForm.value.trim().replace(/\s+/g, ' ');

  if (!task) {
    return alert(`This field shouldn't be empty`);
  }

  if (isEditTask) {
    saveEditedTask(task);
    return;
  }

  const arrayTasksLS = getTasksLocalStorage();

  arrayTasksLS.push({
    id: generateUniqueId(),
    task,
    done: false,
    pinned: false,
    position: 1000,
  });

  setTasksLocalStorage(arrayTasksLS);
  updateListTasks();

  form.reset();
}

function doneTask(event) {
  const task = event.target.closest('.task');
  const id = Number(task.dataset.taskId);

  const arrayTasksLS = getTasksLocalStorage();
  const index = arrayTasksLS.findIndex((task) => task.id === id);

  if (index === -1) {
    return alert(`Task not found`);
  }

  if (!arrayTasksLS[index].done && arrayTasksLS[index].pinned) {
    arrayTasksLS[index].pinned = false;
  }

  if (arrayTasksLS[index].done) {
    arrayTasksLS[index].done = false;
  } else {
    arrayTasksLS[index].done = true;
  }

  setTasksLocalStorage(arrayTasksLS);
  updateListTasks();
}

function pinnedTask(event) {
  const task = event.target.closest('.task');
  const id = Number(task.dataset.taskId);

  const arrayTasksLS = getTasksLocalStorage();
  const index = arrayTasksLS.findIndex((task) => task.id === id);

  if (index === -1) {
    return alert('Task not found!');
  }

  if (!arrayTasksLS[index].pinned && arrayTasksLS[index].done) {
    return alert('Remove the done mark to pin the task!');
  }

  if (arrayTasksLS[index].pinned) {
    arrayTasksLS[index].pinned = false;
  } else {
    arrayTasksLS[index].pinned = true;
  }

  setTasksLocalStorage(arrayTasksLS);
  updateListTasks();
}

function delTask(event) {
  const task = event.target.closest('.task');
  const id = Number(task.dataset.taskId);

  const arrayTasksLS = getTasksLocalStorage();
  const newTaskArr = arrayTasksLS.filter((task) => task.id !== id);

  setTasksLocalStorage(newTaskArr);
  updateListTasks();
}

function editTask(event) {
  const task = event.target.closest('.task');
  const text = task.querySelector('.task__text');
  editId = Number(task.dataset.taskId);

  textareaForm.value = text.textContent;
  isEditTask = true;
  buttonSendForm.textContent = 'Save';
  buttonCancel.classList.remove('none');
  form.scrollIntoView({ behavior: 'smooth' });
}

function saveEditedTask(task) {
  const arrayTasksLS = getTasksLocalStorage();
  const editedTaskIndex = arrayTasksLS.findIndex((task) => task.id === editId);

  if (editedTaskIndex !== -1) {
    arrayTasksLS[editedTaskIndex].task = task;

    setTasksLocalStorage(arrayTasksLS);
    updateListTasks();
  } else {
    alert('Task not found!');
  }

  resetSendForm();
}

function resetSendForm() {
  editId = null;
  isEditTask = false;
  buttonCancel.classList.add('none');
  buttonSendForm.textContent = 'Add';
  form.reset();
}
