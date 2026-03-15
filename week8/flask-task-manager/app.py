from flask import Flask, render_template, request, jsonify
import sqlite3
from pathlib import Path

app = Flask(__name__)
BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "tasks.db"


def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT NOT NULL DEFAULT 'todo',
            due_date TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    conn = get_db_connection()
    rows = conn.execute("""
        SELECT id, title, description, status, due_date, created_at
        FROM tasks
        ORDER BY id DESC
    """).fetchall()
    conn.close()

    tasks = [dict(row) for row in rows]
    return jsonify(tasks), 200


@app.route("/api/tasks", methods=["POST"])
def create_task():
    data = request.get_json() or {}

    title = (data.get("title") or "").strip()
    description = (data.get("description") or "").strip()
    status = (data.get("status") or "todo").strip()
    due_date = (data.get("dueDate") or "").strip()

    if not title:
        return jsonify({"error": "Title is required."}), 400

    if status not in ["todo", "doing", "done"]:
        return jsonify({"error": "Invalid status."}), 400

    conn = get_db_connection()
    cursor = conn.execute("""
        INSERT INTO tasks (title, description, status, due_date)
        VALUES (?, ?, ?, ?)
    """, (title, description, status, due_date or None))
    conn.commit()

    task_id = cursor.lastrowid
    row = conn.execute("""
        SELECT id, title, description, status, due_date, created_at
        FROM tasks
        WHERE id = ?
    """, (task_id,)).fetchone()
    conn.close()

    return jsonify(dict(row)), 201


@app.route("/api/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    data = request.get_json() or {}

    title = (data.get("title") or "").strip()
    description = (data.get("description") or "").strip()
    status = (data.get("status") or "todo").strip()
    due_date = (data.get("dueDate") or "").strip()

    if not title:
        return jsonify({"error": "Title is required."}), 400

    if status not in ["todo", "doing", "done"]:
        return jsonify({"error": "Invalid status."}), 400

    conn = get_db_connection()
    existing = conn.execute("SELECT id FROM tasks WHERE id = ?", (task_id,)).fetchone()

    if not existing:
        conn.close()
        return jsonify({"error": "Task not found."}), 404

    conn.execute("""
        UPDATE tasks
        SET title = ?, description = ?, status = ?, due_date = ?
        WHERE id = ?
    """, (title, description, status, due_date or None, task_id))
    conn.commit()

    row = conn.execute("""
        SELECT id, title, description, status, due_date, created_at
        FROM tasks
        WHERE id = ?
    """, (task_id,)).fetchone()
    conn.close()

    return jsonify(dict(row)), 200


@app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    conn = get_db_connection()
    existing = conn.execute("SELECT id FROM tasks WHERE id = ?", (task_id,)).fetchone()

    if not existing:
        conn.close()
        return jsonify({"error": "Task not found."}), 404

    conn.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Task deleted successfully."}), 200


if __name__ == "__main__":
    init_db()
    app.run(debug=True)