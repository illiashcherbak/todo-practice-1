import { doneSvg, pinnedSvg, delSvg, editSvg } from "./svg.js";

function renderTasks(tasks) {
    if (!tasks || !tasks.length) return;

    tasks.sort((a, b) => {
        if (a.done !== b.done) {
            return a.done ? 1 : -1;
        }
        if (a.pinned !== b.pinned) {
            return a.pinned ? -1 : 1;
        }
        return a.position - b.position;
    })
    .forEach((value, i) => {
        const { id, task, pinned, done } = value;
        const item = 
            `
            <div class="task ${done ? 'done' : ''} ${pinned ? 'pinned' : ''}" data-task-id="${id}" draggable="true">
                <p class="task__text">${task}</p>
                <span class="task__index ${done ? 'none' : ''}">${i + 1}</span>
                <div class="task__btns">
                    <button class="task__done ${done ? 'active' : ''}">${doneSvg}</button>
                    <button class="task__pinned ${pinned ? 'active' : ''}">${pinnedSvg}</button>
                    <button class="task__edit">${editSvg}</button>
                    <button class="task__del">${delSvg}</button>
                </div>
            </div>
            `
        document.querySelector('.output').insertAdjacentHTML('beforeend', item)
    });

    activationDrag();
}

