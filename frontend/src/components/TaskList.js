import { useState } from 'react';
import { deleteTask } from '../services/taskService';

export default function TaskList({ tasks, onEdit, onRefresh }) {
  const [loadingId, setLoadingId] = useState(null);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        setLoadingId(id);
        await deleteTask(id);
        if (onRefresh) onRefresh();
      } catch (err) {
        alert(err.message || 'Error deleting task');
      } finally {
        setLoadingId(null);
      }
    }
  };

  if (!tasks || tasks.length === 0) {
    return <p className="text-gray-500 mt-4">No tasks found. Create one above!</p>;
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full">Completed</span>;
      case 'in-progress':
        return <span className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">In Progress</span>;
      default:
        return <span className="px-2 py-1 text-xs text-yellow-800 bg-yellow-100 rounded-full">Pending</span>;
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {tasks.map((task) => (
          <li key={task.id}>
            <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600 truncate">{task.title}</p>
                  <div className="ml-2 flex-shrink-0 flex">
                    {getStatusBadge(task.status)}
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  <p>{task.description || 'No description provided'}</p>
                </div>
              </div>
              <div className="ml-5 flex-shrink-0 flex space-x-2">
                <button
                  onClick={() => onEdit(task)}
                  className="bg-white px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  disabled={loadingId === task.id}
                  className="bg-red-600 px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700 focus:outline-none disabled:opacity-50"
                >
                  {loadingId === task.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
