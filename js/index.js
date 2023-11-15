'use strict';

import {
  getTasksLocalStorage,
  setTasksLocalStorage,
  generateUniqueId,
  //initSortableList,
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

//! All functions
function sendTask(event) {
  event.preventDefault();

  const task = textareaForm.value.trim().replace(/\s+/g, ' ');

  if (!task) {
    return alert(`This field shouldn't be empty`);
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

//sendTask(event);
