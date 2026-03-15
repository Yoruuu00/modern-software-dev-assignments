import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useTasks } from './hooks/useTasks';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { ErrorAlert } from './components/ErrorAlert';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Task, TaskFormData } from './types';
import { formatDateForInput } from './utils/dateUtils';

function App() {
  const { tasks, loading, error, createTask, updateTask, deleteTask, setError } = useTasks();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreateTask = async (formData: TaskFormData) => {
    try {
      await createTask(formData);
      setEditingTask(null);
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleEditTask = async (formData: TaskFormData) => {
    if (!editingTask) return;
    try {
      await updateTask(editingTask.id, formData);
      setEditingTask(null);
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteTask(id);
    } catch (err) {
      console.error('Failed to delete task:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const editFormData = editingTask
    ? {
        title: editingTask.title,
        description: editingTask.description || '',
        status: editingTask.status,
        due_date: formatDateForInput(editingTask.due_date),
      }
    : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={32} className="text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
              <p className="text-gray-600 text-sm mt-1">Stay organized and track your tasks</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <ErrorAlert message={error} onClose={() => setError(null)} />
        )}

        {editingTask ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit Task</h2>
            <TaskForm
              onSubmit={handleEditTask}
              initialData={editFormData}
              onCancel={handleCancelEdit}
              isLoading={loading}
            />
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Task</h2>
            <TaskForm onSubmit={handleCreateTask} isLoading={loading} />
          </>
        )}

        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Tasks</h2>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <TaskList
              tasks={tasks}
              onEdit={handleEditClick}
              onDelete={handleDeleteTask}
              deletingId={deletingId || undefined}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
