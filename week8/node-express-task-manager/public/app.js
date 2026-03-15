const taskForm = document.getElementById("task-form");
const taskIdInput = document.getElementById("task-id");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const statusInput = document.getElementById("status");
const dueDateInput = document.getElementById("dueDate");
const taskList = document.getElementById("task-list");
const errorMessage = document.getElementById("error-message");
const cancelEditBtn = document.getElementById("cancel-edit");
const formTitle = document.getElementById("form-title");

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
}

function clearError() {
  errorMessage.textContent = "";
  errorMessage.classList.add("hidden");
}

function resetForm() {
  taskIdInput.value = "";
  titleInput.value = "";
  descriptionInput.value = "";
  statusInput.value = "todo";
  dueDateInput.value = "";
  formTitle.textContent = "Create Task";
  cancelEditBtn.classList.add("hidden");
  clearError();
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, function (m) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[m];
  });
}

function renderTasks(tasks) {
  if (!tasks.length) {
    taskList.innerHTML = `<p class="empty">No tasks yet.</p>`;
    return;
  }

  taskList.innerHTML = tasks.map(task => `
    <div class="task-card">
      <h3>${escapeHtml(task.title)}</h3>
      <p>${escapeHtml(task.description || "-")}</p>
      <p><strong>Status:</strong> ${escapeHtml(task.status)}</p>
      <p><strong>Due Date:</strong> ${escapeHtml(task.due_date || "-")}</p>
      <div class="actions">
        <button data-action="edit" data-id="${task.id}">Edit</button>
        <button class="danger" data-action="delete" data-id="${task.id}">Delete</button>
      </div>
    </div>
  `).join("");
}

async function loadTasks() {
  const res = await fetch("/api/tasks");
  const data = await res.json();
  renderTasks(data);
}

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearError();

  const payload = {
    title: titleInput.value.trim(),
    description: descriptionInput.value.trim(),
    status: statusInput.value,
    dueDate: dueDateInput.value
  };

  const taskId = taskIdInput.value;
  const method = taskId ? "PUT" : "POST";
  const url = taskId ? `/api/tasks/${taskId}` : "/api/tasks";

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if (!res.ok) {
    showError(data.error || "Something went wrong.");
    return;
  }

  resetForm();
  loadTasks();
});

taskList.addEventListener("click", async (e) => {
  const button = e.target.closest("button");
  if (!button) return;

  const action = button.dataset.action;
  const id = button.dataset.id;

  if (action === "delete") {
    const confirmed = confirm("Delete this task?");
    if (!confirmed) return;

    const res = await fetch(`/api/tasks/${id}`, {
      method: "DELETE"
    });

    if (res.ok) {
      loadTasks();
    } else {
      showError("Failed to delete task.");
    }
  }

  if (action === "edit") {
    const res = await fetch("/api/tasks");
    const tasks = await res.json();
    const task = tasks.find(t => String(t.id) === String(id));

    if (!task) {
      showError("Task not found.");
      return;
    }

    taskIdInput.value = task.id;
    titleInput.value = task.title || "";
    descriptionInput.value = task.description || "";
    statusInput.value = task.status || "todo";
    dueDateInput.value = task.due_date || "";
    formTitle.textContent = "Edit Task";
    cancelEditBtn.classList.remove("hidden");
    clearError();
  }
});

cancelEditBtn.addEventListener("click", resetForm);

loadTasks();