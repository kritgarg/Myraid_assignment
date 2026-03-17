import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { getTasks } from '../services/taskService';
import { getMe } from '../services/authService';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination & Filtering
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [currentTask, setCurrentTask] = useState(null);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      await getMe();
      fetchTasks();
    } catch (err) {
      router.push('/login');
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: 5 };
      if (statusFilter) params.status = statusFilter;
      if (searchQuery) params.search = searchQuery;

      const response = await getTasks(params);
      setTasks(response.data.tasks);
      setTotalPages(response.data.pagination.totalPages);
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [page, statusFilter]);

  // Handle Search submit
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTasks();
  };

  const handleEdit = (task) => {
    setCurrentTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefresh = () => {
    setCurrentTask(null);
    fetchTasks();
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Dashboard</h1>
          
          <TaskForm 
            currentTask={currentTask} 
            onSave={handleRefresh} 
            onCancel={() => setCurrentTask(null)} 
          />

          <div className="bg-white p-4 shadow rounded-lg mb-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 text-sm">
            <div className="flex space-x-4 w-full sm:w-auto">
              <select
                className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <form onSubmit={handleSearch} className="flex w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search tasks..."
                className="border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="bg-indigo-600 border border-transparent rounded-r-md py-2 px-4 shadow-sm text-white hover:bg-indigo-700"
              >
                Search
              </button>
            </form>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <TaskList tasks={tasks} onEdit={handleEdit} onRefresh={handleRefresh} />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-1">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
