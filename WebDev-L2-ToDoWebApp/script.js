const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const pendingList = document.getElementById("pendingList");
const completedList = document.getElementById("completedList");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

let tasks = JSON.parse(localStorage.getItem("taskFlowTasks")) || [];

function saveTasks() {
    localStorage.setItem("taskFlowTasks", JSON.stringify(tasks));
}

function formatDate(date) {
    return new Date(date).toLocaleString();
}

function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
    };

    tasks.push(task);
    saveTasks();

    taskInput.value = "";
    taskInput.focus();

    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            task.completed = !task.completed;
            task.completedAt = task.completed
                ? new Date().toISOString()
                : null;
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

function editTask(id) {
    const task = tasks.find(task => task.id === id);

    if (!task) {
        return;
    }

    const taskItem = document.querySelector(`[data-id="${id}"]`);
    const textElement = taskItem.querySelector(".task-text");

    const input = document.createElement("input");
    input.type = "text";
    input.value = task.text;
    input.className = "edit-input";

    textElement.replaceWith(input);
    input.focus();

    input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            updateTask(id, input.value);
        }

        if (event.key === "Escape") {
            renderTasks();
        }
    });

    input.addEventListener("blur", () => {
        updateTask(id, input.value);
    });
}

function updateTask(id, newText) {
    const text = newText.trim();

    if (text === "") {
        renderTasks();
        return;
    }

    tasks = tasks.map(task => {
        if (task.id === id) {
            task.text = text;
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

function createTaskElement(task) {
    const taskItem = document.createElement("div");
    taskItem.className = `task-item ${task.completed ? "completed-task" : ""}`;
    taskItem.dataset.id = task.id;

    const content = document.createElement("div");
    content.className = "task-content";

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    content.appendChild(text);

    const createdTime = document.createElement("div");
    createdTime.className = "task-time";
    createdTime.textContent = `Added: ${formatDate(task.createdAt)}`;

    if (task.completed && task.completedAt) {
        createdTime.textContent += ` • Completed: ${formatDate(task.completedAt)}`;
    }

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const completeButton = document.createElement("button");
    completeButton.className = "complete-btn";
    completeButton.textContent = task.completed ? "Mark Pending" : "Mark Complete";
    completeButton.addEventListener("click", () => toggleTask(task.id));

    const editButton = document.createElement("button");
    editButton.className = "edit-btn";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => editTask(task.id));

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    actions.appendChild(completeButton);
    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    taskItem.appendChild(content);
    taskItem.appendChild(createdTime);
    taskItem.appendChild(actions);

    return taskItem;
}

function renderTasks() {
    pendingList.innerHTML = "";
    completedList.innerHTML = "";

    const pendingTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);

    pendingCount.textContent = `${pendingTasks.length} pending`;
    completedCount.textContent = `${completedTasks.length} completed`;

    if (pendingTasks.length === 0) {
        const message = document.createElement("p");
        message.className = "empty-message";
        message.textContent = "No pending tasks. You're all caught up! 🎉";
        pendingList.appendChild(message);
    } else {
        pendingTasks.forEach(task => {
            pendingList.appendChild(createTaskElement(task));
        });
    }

    if (completedTasks.length === 0) {
        const message = document.createElement("p");
        message.className = "empty-message";
        message.textContent = "No completed tasks yet.";
        completedList.appendChild(message);
    } else {
        completedTasks.forEach(task => {
            completedList.appendChild(createTaskElement(task));
        });
    }
}

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addTask();
    }
});

renderTasks();