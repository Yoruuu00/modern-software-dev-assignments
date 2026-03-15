const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

const db = new sqlite3.Database("./tasks.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'todo',
      due_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/api/tasks", (req, res) => {
  db.all(
    "SELECT id, title, description, status, due_date, created_at FROM tasks ORDER BY id DESC",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Failed to fetch tasks." });
      }
      res.json(rows);
    }
  );
});

app.post("/api/tasks", (req, res) => {
  const { title, description = "", status = "todo", dueDate = "" } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required." });
  }

  if (!["todo", "doing", "done"].includes(status)) {
    return res.status(400).json({ error: "Invalid status." });
  }

  db.run(
    "INSERT INTO tasks (title, description, status, due_date) VALUES (?, ?, ?, ?)",
    [title.trim(), description.trim(), status, dueDate || null],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Failed to create task." });
      }

      db.get(
        "SELECT id, title, description, status, due_date, created_at FROM tasks WHERE id = ?",
        [this.lastID],
        (err2, row) => {
          if (err2) {
            return res.status(500).json({ error: "Failed to fetch created task." });
          }
          res.status(201).json(row);
        }
      );
    }
  );
});

app.put("/api/tasks/:id", (req, res) => {
  const { title, description = "", status = "todo", dueDate = "" } = req.body;
  const { id } = req.params;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required." });
  }

  if (!["todo", "doing", "done"].includes(status)) {
    return res.status(400).json({ error: "Invalid status." });
  }

  db.get("SELECT id FROM tasks WHERE id = ?", [id], (err, existing) => {
    if (err) {
      return res.status(500).json({ error: "Failed to check task." });
    }

    if (!existing) {
      return res.status(404).json({ error: "Task not found." });
    }

    db.run(
      "UPDATE tasks SET title = ?, description = ?, status = ?, due_date = ? WHERE id = ?",
      [title.trim(), description.trim(), status, dueDate || null, id],
      function (err2) {
        if (err2) {
          return res.status(500).json({ error: "Failed to update task." });
        }

        db.get(
          "SELECT id, title, description, status, due_date, created_at FROM tasks WHERE id = ?",
          [id],
          (err3, row) => {
            if (err3) {
              return res.status(500).json({ error: "Failed to fetch updated task." });
            }
            res.json(row);
          }
        );
      }
    );
  });
});

app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;

  db.get("SELECT id FROM tasks WHERE id = ?", [id], (err, existing) => {
    if (err) {
      return res.status(500).json({ error: "Failed to check task." });
    }

    if (!existing) {
      return res.status(404).json({ error: "Task not found." });
    }

    db.run("DELETE FROM tasks WHERE id = ?", [id], function (err2) {
      if (err2) {
        return res.status(500).json({ error: "Failed to delete task." });
      }

      res.json({ message: "Task deleted successfully." });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});