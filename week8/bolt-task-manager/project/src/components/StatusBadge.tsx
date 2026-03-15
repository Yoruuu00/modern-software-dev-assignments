import { TaskStatus } from '../types';

interface StatusBadgeProps {
  status: TaskStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    todo: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'To Do' },
    doing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Doing' },
    done: { bg: 'bg-green-100', text: 'text-green-800', label: 'Done' },
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}
