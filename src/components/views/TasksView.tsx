import React, { useState } from 'react';
import { CheckSquare, Plus, Check, Edit2, Trash2, X, AlertCircle } from 'lucide-react';
import { Task, WorkspaceConfig } from '../../types';
import { DeleteConfirmModal } from '../DeleteConfirmModal';

interface TasksViewProps {
  config: WorkspaceConfig;
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onToggleTask: (id: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  config,
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleTask,
}) => {
  const customLabel = config.modules.find((m) => m.id === 'tasks')?.label || 'Tasks';

  const [filter, setFilter] = useState<'pending' | 'completed' | 'all'>('pending');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    priority: 'medium' as Task['priority'],
    dueDate: new Date().toISOString().split('T')[0],
  });

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const handleOpenAdd = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      priority: task.priority,
      dueDate: task.dueDate || new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingTask) {
      onUpdateTask({
        ...editingTask,
        title: formData.title.trim(),
        priority: formData.priority,
        dueDate: formData.dueDate,
      });
    } else {
      onAddTask({
        id: `task-${Date.now()}`,
        title: formData.title.trim(),
        completed: false,
        priority: formData.priority,
        dueDate: formData.dueDate,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-white tracking-tight">{customLabel}</h2>
          <p className="text-xs text-neutral-400 font-medium">
            {tasks.filter((t) => !t.completed).length} pending to-do items
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          style={{ backgroundColor: config.accentColor || '#FF5722' }}
          className="text-white font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 shrink-0 uppercase tracking-wider"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New {customLabel.slice(0, -1)}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 p-1.5 bg-[#141417] border border-neutral-800 rounded-xl max-w-md">
        {(['pending', 'completed', 'all'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg transition ${
              filter === f ? 'bg-[#FF5722] text-white shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="py-12 text-center bg-[#141417] rounded-2xl border border-neutral-800 text-neutral-500 text-xs font-medium">
            No {customLabel.toLowerCase()} found in this view.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${
                task.completed
                  ? 'bg-neutral-900/50 border-neutral-800/60 opacity-60'
                  : 'bg-[#141417] border-neutral-800 shadow-md hover:border-neutral-700'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <button
                  onClick={() => onToggleTask(task.id)}
                  className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition shrink-0 ${
                    task.completed
                      ? 'bg-[#00FF9D] border-[#00FF9D] text-black'
                      : 'border-neutral-600 bg-neutral-900 hover:border-[#FF5722]'
                  }`}
                >
                  {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <div className="min-w-0">
                  <h3
                    className={`font-black text-sm sm:text-base font-heading ${
                      task.completed ? 'line-through text-neutral-500' : 'text-white'
                    }`}
                  >
                    {task.title}
                  </h3>
                  {task.dueDate && (
                    <span className="text-[11px] text-neutral-400 font-medium block mt-0.5">
                      Due: {task.dueDate}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${
                    task.priority === 'high'
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                      : task.priority === 'medium'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                  }`}
                >
                  {task.priority}
                </span>

                <button
                  onClick={() => handleOpenEdit(task)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeletingId(task.id)}
                  className="p-1.5 text-neutral-500 hover:text-rose-400 rounded-lg transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#18181B] rounded-2xl w-full max-w-sm shadow-2xl border border-neutral-700 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-[#121214]">
              <h3 className="font-black text-white text-base font-heading">
                {editingTask ? 'Edit Task' : 'Add Task'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Order extra supplies"
                  className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-black uppercase tracking-wider text-white bg-[#FF5722] hover:brightness-110 rounded-xl shadow-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      <DeleteConfirmModal
        isOpen={!!deletingId}
        title="Delete Task?"
        message="Are you sure you want to delete this task?"
        onConfirm={() => {
          if (deletingId) {
            onDeleteTask(deletingId);
            setDeletingId(null);
          }
        }}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
