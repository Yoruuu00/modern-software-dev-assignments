import { Trash2, CreditCard as Edit2, Calendar } from 'lucide-react';
import { Task, TaskFormData } from '../types';
import { StatusBadge } from './StatusBadge';
import { formatDate, isOverdue } from '../utils/dateUtils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function TaskCard({ task, onEdit, onDelete, isDeleting = false }: TaskCardProps) {
  const isDue = isOverdue(task.due_date);

  return (
    <div className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{task.title}</h3>
          <StatusBadge status={task.status} />
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between">
        {task.due_date && (
          <div className={`flex items-center gap-1 text-sm ${isDue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
            <Calendar size={16} />
            {formatDate(task.due_date)}
            {isDue && <span className="ml-1">(Overdue)</span>}
          </div>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit task"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            disabled={isDeleting}
            className="p-2 text-red-600 hover:bg-red-50 disabled:opacity-50 rounded-lg transition-colors"
            title="Delete task"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
