import React, { useState } from 'react';
import { FileText, Search, Plus, User, Tag, Edit2, Trash2, X, Lock } from 'lucide-react';
import { Customer, Note, WorkspaceConfig } from '../../types';
import { DeleteConfirmModal } from '../DeleteConfirmModal';

interface NotesViewProps {
  config: WorkspaceConfig;
  notes: Note[];
  customers: Customer[];
  onAddNote: (note: Note) => void;
  onUpdateNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  config,
  notes,
  customers,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}) => {
  const customLabel = config.modules.find((m) => m.id === 'notes')?.label || 'Notes';

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    customerId: '',
    tags: '',
  });

  const filteredNotes = notes.filter((note) => {
    const cust = customers.find((c) => c.id === note.customerId);
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cust && cust.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingNote(null);
    setFormData({
      title: '',
      content: '',
      customerId: customers[0]?.id || '',
      tags: 'Access, Gate Code',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (note: Note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      customerId: note.customerId || '',
      tags: note.tags ? note.tags.join(', ') : '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const parsedTags = formData.tags
      ? formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    const now = new Date().toISOString().split('T')[0];

    if (editingNote) {
      onUpdateNote({
        ...editingNote,
        title: formData.title.trim(),
        content: formData.content.trim(),
        customerId: formData.customerId || undefined,
        tags: parsedTags,
        updatedAt: now,
      });
    } else {
      onAddNote({
        id: `note-${Date.now()}`,
        title: formData.title.trim(),
        content: formData.content.trim(),
        customerId: formData.customerId || undefined,
        tags: parsedTags,
        createdAt: now,
        updatedAt: now,
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
          <p className="text-xs text-neutral-400 font-medium">Site notes, key codes, and client preferences</p>
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

      {/* Search */}
      <div className="bg-[#141417] p-3 rounded-2xl border border-neutral-800 shadow-md">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${customLabel.toLowerCase()} by key code, title, or client...`}
            className="w-full pl-9 pr-4 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
          />
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredNotes.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-[#141417] rounded-2xl border border-neutral-800 text-neutral-500 text-xs font-medium">
            No site notes found.
          </div>
        ) : (
          filteredNotes.map((note) => {
            const cust = customers.find((c) => c.id === note.customerId);

            return (
              <div
                key={note.id}
                className="bg-[#141417] rounded-2xl border border-neutral-800 p-4 sm:p-5 shadow-md hover:border-neutral-700 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-black text-white text-sm sm:text-base font-heading flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{note.title}</span>
                    </h3>

                    {cust && (
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#00FF9D] bg-[#00FF9D]/10 border border-[#00FF9D]/30 px-2 py-0.5 rounded-lg shrink-0">
                        {cust.name}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-neutral-200 font-medium whitespace-pre-wrap bg-neutral-900 p-3 rounded-xl border border-neutral-800 mb-3 leading-relaxed">
                    {note.content}
                  </p>

                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {note.tags.map((t) => (
                        <span
                          key={t}
                          className="bg-neutral-800 border border-neutral-700 text-neutral-300 text-[10px] font-bold px-2 py-0.5 rounded-md"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400 font-medium">
                  <span>Updated: {note.updatedAt || note.createdAt}</span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(note)}
                      className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingId(note.id)}
                      className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#18181B] rounded-2xl w-full max-w-md shadow-2xl border border-neutral-700 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-[#121214]">
              <h3 className="font-black text-white text-base font-heading">
                {editingNote ? 'Edit Note' : 'Add Note'}
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
                  placeholder="e.g. Side Gate Key Safe Code"
                  className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Client Link</label>
                <select
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                >
                  <option value="">-- General Note --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Content</label>
                <textarea
                  rows={4}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write access code, alarm PIN, or site instructions..."
                  className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">Tags</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Access, Alarm, Keys"
                  className="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3.5 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingId}
        title="Delete Note?"
        message="Are you sure you want to delete this note?"
        onConfirm={() => {
          if (deletingId) {
            onDeleteNote(deletingId);
            setDeletingId(null);
          }
        }}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
