import { useState, useEffect } from 'react';
import API from './api/axiosConfig';
import AuthForm from './components/AuthForm';
import TaskForm from './components/TaskForm';
import TaskCard from './components/TaskCard';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [tasks, setTasks] = useState([]);
  const [notification, setNotification] = useState({ text: '', type: '' });

  const showNotification = (text, type = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification({ text: '', type: '' }), 4000);
  };

    const fetchTasks = async () => {
    try {
      const { data } = await API.get('/tasks');
      if (data.success) setTasks(data.data);
    } catch (error) {
      showNotification('Failed to read workspace tasks', error);
    }
  };
  
  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  const handleAuthSuccess = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    setTasks([]);
    localStorage.clear();
    showNotification('Logged out cleanly');
  };



  const handleUpdateStatus = async (id, currentStatus) => {
    const nextStatus = { 'pending': 'in-progress', 'in-progress': 'completed', 'completed': 'pending' }[currentStatus];
    try {
      const { data } = await API.put(`/tasks/${id}`, { status: nextStatus });
      if (data.success) fetchTasks();
    } catch (error) {
      showNotification('Unauthorized action', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const { data } = await API.delete(`/tasks/${id}`);
      if (data.success) {
        showNotification('Task removed');
        fetchTasks();
      }
    } catch (error) {
      showNotification('Access denied to delete this resource', error);
    }
  };

  return (
    <div class="max-w-4xl mx-auto px-4 py-8">
      {/* Alert Notification System */}
      {notification.text && (
        <div class={`fixed top-5 right-5 px-5 py-3 rounded-xl shadow-lg text-white font-bold transition z-50 ${notification.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
          {notification.text}
        </div>
      )}

      {!token ? (
        <AuthForm onAuthSuccess={handleAuthSuccess} showNotification={showNotification} />
      ) : (
        <div>
          {/* Main Workspace Header Panel */}
          <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center mb-8">
            <div>
              <h1 class="text-xl font-black text-slate-900">PrimeTrade Workspace</h1>
              <p class="text-sm text-slate-500 flex items-center gap-2 mt-0.5">
                {user?.email} 
                <span class="text-xs uppercase font-extrabold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md tracking-wider">
                  {user?.role}
                </span>
              </p>
            </div>
            <button onClick={handleLogout} class="px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-900 transition">
              Log Out
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Hand Form Setup */}
            <div class="md:col-span-1">
              <TaskForm onTaskCreated={fetchTasks} showNotification={showNotification} />
            </div>

            {/* Right Hand Live Board Stream */}
            <div class="md:col-span-2 space-y-4">
              <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
                Active Sprint Items 
                <span class="bg-slate-200 text-slate-700 text-xs px-2 py-0.5 rounded-full">{tasks.length}</span>
              </h3>
              
              {tasks.length === 0 ? (
                <div class="text-center text-slate-400 py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                  No tasks active in this profile scope.
                </div>
              ) : (
                <div class="space-y-3">
                  {tasks.map(task => (
                    <TaskCard key={task._id} task={task} currentUser={user} onUpdate={handleUpdateStatus} onDelete={handleDeleteTask} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}