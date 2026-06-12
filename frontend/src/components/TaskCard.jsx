
export default function TaskCard({ task, currentUser, onUpdate, onDelete }) {
  const statusColors = {
    'pending': 'bg-slate-100 text-slate-700',
    'in-progress': 'bg-amber-100 text-amber-800',
    'completed': 'bg-emerald-100 text-emerald-800'
  };

  return (
    <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex justify-between items-start gap-4">
      <div>
        <h4 class="text-base font-bold text-slate-900 mb-1">{task.title}</h4>
        <p class="text-sm text-slate-600 mb-3">{task.description}</p>
        
        {currentUser?.role === 'admin' && task.user && (
          <p class="text-xs text-slate-400 mb-2">
            Owner: <span class="font-medium text-slate-500">{task.user.email}</span>
          </p>
        )}
        <span class={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${statusColors[task.status] || 'bg-slate-100'}`}>
          {task.status}
        </span>
      </div>

      <div class="flex gap-2 shrink-0">
        <button onClick={() => onUpdate(task._id, task.status)} 
          class="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-md font-medium hover:bg-slate-100">
          Cycle Status
        </button>
        <button onClick={() => onDelete(task._id)} 
          class="text-xs px-3 py-1.5 bg-red-50 border border-red-100 text-red-600 rounded-md font-medium hover:bg-red-100">
          Delete
        </button>
      </div>
    </div>
  );
}