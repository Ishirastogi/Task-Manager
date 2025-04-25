const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const filterSelect = document.getElementById("filter");
const sortBtn = document.getElementById("sort-btn");
const alertBox = document.getElementById("task-alert");

const deleteModal = document.getElementById("delete-modal");
const confirmDeleteBtn = document.getElementById("confirm-delete");
const cancelDeleteBtn = document.getElementById("cancel-delete");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let sortNewest = true;
let taskToDelete = null;

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const filter = filterSelect.value;
  let filteredTasks = [...tasks];

  if (filter === "completed") {
    filteredTasks = filteredTasks.filter(t => t.completed);
  } else if (filter === "pending") {
    filteredTasks = filteredTasks.filter(t => !t.completed);
  }

  if (sortNewest) {
    filteredTasks.reverse();
  }

  taskList.innerHTML = "";

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task" + (task.completed ? " completed" : "");
    li.setAttribute("data-id", task.id);

    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleComplete(task.id));

    const span = document.createElement("span");
    span.textContent = task.text;

    label.appendChild(checkbox);
    label.appendChild(span);
    li.appendChild(label);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.addEventListener("click", () => editTask(task.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑";
    deleteBtn.addEventListener("click", () => promptDelete(task.id));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    li.appendChild(actions);

    taskList.appendChild(li);
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.filter(t => !t.completed).length;
  alertBox.innerHTML = `✅ Completed: ${completedCount} task(s) &nbsp;&nbsp; | &nbsp;&nbsp; ⏳ Pending: ${pendingCount} task(s)`;
}

function addTask(e) {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (text !== "") {
    const newTask = {
      id: Date.now().toString(),
      text,
      completed: false
    };
    tasks.push(newTask);
    taskInput.value = "";
    saveTasks();
    renderTasks();
  }
}

function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  const newText = prompt("Edit your task:", task.text);
  if (newText !== null && newText.trim() !== "") {
    task.text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

function promptDelete(id) {
  taskToDelete = id;
  deleteModal.classList.remove("hidden");
}

confirmDeleteBtn.addEventListener("click", () => {
  tasks = tasks.filter(task => task.id !== taskToDelete);
  saveTasks();
  renderTasks();
  deleteModal.classList.add("hidden");
  taskToDelete = null;
});

cancelDeleteBtn.addEventListener("click", () => {
  deleteModal.classList.add("hidden");
  taskToDelete = null;
});

taskForm.addEventListener("submit", addTask);
filterSelect.addEventListener("change", renderTasks);
sortBtn.addEventListener("click", () => {
  sortNewest = !sortNewest;
  sortBtn.textContent = sortNewest ? "Sort by Newest" : "Sort by Oldest";
  renderTasks();
});

renderTasks();
