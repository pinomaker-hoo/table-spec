import { useState } from 'react';
import type { BuilderColumn } from '../types';
import { useERDBuilder } from '../context';

interface Props {
  tableId: string;
  column: BuilderColumn;
}

const COMMON_TYPES = [
  'BIGINT', 'INT', 'SMALLINT', 'TINYINT',
  'VARCHAR(255)', 'VARCHAR(100)', 'VARCHAR(50)',
  'TEXT', 'LONGTEXT',
  'BOOLEAN',
  'DECIMAL(10,2)', 'FLOAT', 'DOUBLE',
  'DATE', 'DATETIME', 'TIMESTAMP',
  'JSON', 'BLOB', 'UUID',
];

export default function ColumnEditRow({ tableId, column }: Props) {
  const { dispatch } = useERDBuilder();
  const [expanded, setExpanded] = useState(false);
  const [name, setName] = useState(column.name);
  const [dataType, setDataType] = useState(column.dataType);

  // Sync from props
  if (name !== column.name && !document.activeElement?.closest(`[data-col-name="${column.id}"]`)) {
    setName(column.name);
  }
  if (dataType !== column.dataType && !document.activeElement?.closest(`[data-col-type="${column.id}"]`)) {
    setDataType(column.dataType);
  }

  const update = (updates: Partial<BuilderColumn>) => {
    dispatch({ type: 'UPDATE_COLUMN', payload: { tableId, columnId: column.id, updates } });
  };

  const handleNameBlur = () => {
    if (name !== column.name) update({ name });
  };

  const handleTypeBlur = () => {
    if (dataType !== column.dataType) update({ dataType });
  };

  const handleDelete = () => {
    dispatch({ type: 'DELETE_COLUMN', payload: { tableId, columnId: column.id } });
  };

  return (
    <div className="bg-[#1A202C] rounded border border-[#4A5568]/50 overflow-hidden">
      {/* Main row */}
      <div className="flex items-center gap-1 px-2 py-1.5">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[#4A5568] hover:text-[#A0AEC0] transition-colors shrink-0"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`transform transition-transform ${expanded ? 'rotate-90' : ''}`}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        <input
          data-col-name={column.id}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleNameBlur}
          onKeyDown={(e) => e.key === 'Enter' && handleNameBlur()}
          placeholder="column_name"
          className="flex-1 min-w-0 bg-transparent text-[11px] text-[#E2E8F0] outline-none placeholder:text-[#4A5568]"
        />

        <input
          data-col-type={column.id}
          type="text"
          value={dataType}
          onChange={(e) => setDataType(e.target.value)}
          onBlur={handleTypeBlur}
          onKeyDown={(e) => e.key === 'Enter' && handleTypeBlur()}
          placeholder="type"
          list={`types-${column.id}`}
          className="w-24 bg-transparent text-[10px] text-[#64748B] outline-none placeholder:text-[#4A5568] text-right"
        />
        <datalist id={`types-${column.id}`}>
          {COMMON_TYPES.map((t) => (
            <option key={t} value={t} />
          ))}
        </datalist>

        {/* PK badge */}
        <button
          onClick={() => update({ isPrimaryKey: !column.isPrimaryKey })}
          className={`text-[8px] font-bold px-1 rounded shrink-0 transition-colors ${
            column.isPrimaryKey
              ? 'text-blue-400 bg-blue-900/40'
              : 'text-[#4A5568] hover:text-blue-400/50'
          }`}
          title="Primary Key"
        >
          PK
        </button>

        {/* Delete */}
        <button
          onClick={handleDelete}
          className="text-[#4A5568] hover:text-red-400 transition-colors shrink-0"
          title="Delete column"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-2 pb-2 pt-1 border-t border-[#4A5568]/30 grid grid-cols-2 gap-x-2 gap-y-1.5">
          <label className="flex items-center gap-1.5 text-[10px] text-[#A0AEC0]">
            <input
              type="checkbox"
              checked={!column.nullable}
              onChange={(e) => update({ nullable: !e.target.checked })}
              className="w-3 h-3 rounded border-[#4A5568] bg-[#1A202C] text-[#4DB8B0] focus:ring-[#4DB8B0] focus:ring-1"
            />
            NOT NULL
          </label>
          <label className="flex items-center gap-1.5 text-[10px] text-[#A0AEC0]">
            <input
              type="checkbox"
              checked={column.isUnique}
              onChange={(e) => update({ isUnique: e.target.checked })}
              className="w-3 h-3 rounded border-[#4A5568] bg-[#1A202C] text-[#4DB8B0] focus:ring-[#4DB8B0] focus:ring-1"
            />
            UNIQUE
          </label>
          <label className="flex items-center gap-1.5 text-[10px] text-[#A0AEC0]">
            <input
              type="checkbox"
              checked={column.isAutoIncrement}
              onChange={(e) => update({ isAutoIncrement: e.target.checked })}
              className="w-3 h-3 rounded border-[#4A5568] bg-[#1A202C] text-[#4DB8B0] focus:ring-[#4DB8B0] focus:ring-1"
            />
            AUTO_INC
          </label>
          <div />
          <label className="col-span-2">
            <span className="text-[9px] text-[#4A5568]">Default</span>
            <input
              type="text"
              value={column.defaultValue || ''}
              onChange={(e) => update({ defaultValue: e.target.value || null })}
              placeholder="NULL"
              className="mt-0.5 w-full bg-[#2D3748] border border-[#4A5568]/50 text-[10px] text-[#A0AEC0] rounded px-2 py-1 outline-none focus:border-[#4DB8B0] transition-colors"
            />
          </label>
          <label className="col-span-2">
            <span className="text-[9px] text-[#4A5568]">Comment</span>
            <input
              type="text"
              value={column.comment}
              onChange={(e) => update({ comment: e.target.value })}
              placeholder="Description..."
              className="mt-0.5 w-full bg-[#2D3748] border border-[#4A5568]/50 text-[10px] text-[#A0AEC0] rounded px-2 py-1 outline-none focus:border-[#4DB8B0] transition-colors"
            />
          </label>
        </div>
      )}
    </div>
  );
}
