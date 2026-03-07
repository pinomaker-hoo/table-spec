import { useState } from 'react';
import { useERDBuilder } from '../context';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  onClose: () => void;
}

export default function AddTableModal({ onClose }: Props) {
  const { state, dispatch } = useERDBuilder();
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [addDefaults, setAddDefaults] = useState(true);

  const handleCreate = () => {
    if (!name.trim()) return;

    // Place in center of current viewport
    const viewW = window.innerWidth - 48;
    const viewH = window.innerHeight - 48;
    const x = Math.round((viewW / 2 - state.panX) / state.zoom - 110);
    const y = Math.round((viewH / 2 - state.panY) / state.zoom - 80);

    const columns = addDefaults
      ? [
          { name: 'id', dataType: 'BIGINT', nullable: false, defaultValue: null, comment: '', isPrimaryKey: true, isUnique: false, isAutoIncrement: true },
          { name: 'created_at', dataType: 'TIMESTAMP', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', comment: '', isPrimaryKey: false, isUnique: false, isAutoIncrement: false },
          { name: 'updated_at', dataType: 'TIMESTAMP', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', comment: '', isPrimaryKey: false, isUnique: false, isAutoIncrement: false },
        ]
      : undefined;

    dispatch({
      type: 'ADD_TABLE',
      payload: { name: name.trim(), comment, x, y, columns },
    });
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCreate();
    if (e.key === 'Escape') onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-[#2D3748] border border-[#4A5568] rounded-xl p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <h2 className="text-lg font-semibold text-white mb-4">{t.addTable}</h2>

        <div className="space-y-3">
          <label className="block">
            <span className="text-xs text-[#A0AEC0]">{t.tableName}</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              placeholder="users"
              className="mt-1 w-full bg-[#1A202C] border border-[#4A5568] text-white text-sm rounded-lg px-3 py-2 focus:border-[#4DB8B0] focus:ring-1 focus:ring-[#4DB8B0] outline-none transition-colors"
            />
          </label>

          <label className="block">
            <span className="text-xs text-[#A0AEC0]">Comment</span>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Table description..."
              className="mt-1 w-full bg-[#1A202C] border border-[#4A5568] text-white text-sm rounded-lg px-3 py-2 focus:border-[#4DB8B0] focus:ring-1 focus:ring-[#4DB8B0] outline-none transition-colors"
            />
          </label>

          <label className="flex items-center gap-2 text-sm text-[#A0AEC0] cursor-pointer">
            <input
              type="checkbox"
              checked={addDefaults}
              onChange={(e) => setAddDefaults(e.target.checked)}
              className="w-4 h-4 rounded border-[#4A5568] bg-[#1A202C] text-[#4DB8B0] focus:ring-[#4DB8B0]"
            />
            {t.addDefaultColumns}
          </label>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[#A0AEC0] border border-[#4A5568] rounded-lg hover:bg-[#4A5568] hover:text-white transition-colors"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="px-4 py-2 text-sm text-white bg-[#4DB8B0] rounded-lg hover:bg-[#45A89F] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {t.create}
          </button>
        </div>
      </div>
    </div>
  );
}
