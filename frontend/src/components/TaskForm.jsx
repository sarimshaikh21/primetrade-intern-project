import { useState } from 'react';
import API from '../api/axiosConfig';

export default function TaskForm({ onTaskCreated, showNotification }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/tasks', { title, description });
      if (data.success) {
        showNotification('Task successfully initialized!');
        setTitle('');
        setDescription('');
        onTaskCreated();
      }
    } catch (error) {
      showNotification('Failed to build task record', error);
    }
  };

  return (
    <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6">
      <h3 class="text-lg font-bold text-slate-900 mb-3">Add New Task</h3>
      <form onSubmit={handleSubmit} class="space-y-3">
        <input type="text" placeholder="Task Title" value={title} onChange={e => setTitle(e.target.value)} required
          class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        <textarea placeholder="Task description constraints..." value={description} onChange={e => setDescription(e.target.value)} required rows={2}
          class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        <button type="submit" class="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition text-sm">
          Create Task
        </button>
      </form>
    </div>
  );
}