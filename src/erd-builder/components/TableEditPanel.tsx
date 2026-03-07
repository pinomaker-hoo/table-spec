import { useState, useMemo } from 'react';
import type { BuilderTable } from '../types';
import { useERDBuilder } from '../context';
import ColumnEditRow from './ColumnEditRow';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  table: BuilderTable;
}

export default function TableEditPanel({ table }: Props) {
  const { dispatch } = useERDBuilder();
  const { t } = useLanguage();
  const [name, setName] = useState(table.name);
  const [comment, setComment] = useState(table.comment);

  // Sync local state when table changes
  if (name !== table.name && !document.activeElement?.closest('[data-table-name]')) {
    setName(table.name);
  }
  if (comment !== table.comment && !document.activeElement?.closest('[data-table-comment]')) {
    setComment(table.comment);
  }

  const handleNameBlur = () => {
    if (name.trim() && name !== table.name) {
      dispatch({ type: 'UPDATE_TABLE', payload: { tableId: table.id, name: name.trim(), comment: table.comment } });
    }
  };

  const handleCommentBlur = () => {
    if (comment !== table.comment) {
      dispatch({ type: 'UPDATE_TABLE', payload: { tableId: table.id, name: table.name, comment } });
    }
  };

  const handleAddColumn = () => {
    dispatch({
      type: 'ADD_COLUMN',
      payload: {
        tableId: table.id,
        column: {
          name: '',
          dataType: 'VARCHAR(255)',
          nullable: true,
          defaultValue: null,
          comment: '',
          isPrimaryKey: false,
          isUnique: false,
          isAutoIncrement: false,
        },
      },
    });
  };

  const handleAddDefaultColumns = () => {
    const defaultColumns = [
      { name: 'id', dataType: 'BIGINT', nullable: false, defaultValue: null, comment: '', isPrimaryKey: true, isUnique: false, isAutoIncrement: true },
      { name: 'created_at', dataType: 'TIMESTAMP', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', comment: '', isPrimaryKey: false, isUnique: false, isAutoIncrement: false },
      { name: 'updated_at', dataType: 'TIMESTAMP', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', comment: '', isPrimaryKey: false, isUnique: false, isAutoIncrement: false },
    ];
    for (const col of defaultColumns) {
      dispatch({ type: 'ADD_COLUMN', payload: { tableId: table.id, column: col } });
    }
  };

  const handleDeleteTable = () => {
    dispatch({ type: 'DELETE_TABLE', payload: { tableId: table.id } });
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#E2E8F0]">{t.editTable}</h3>
        <button
          onClick={handleDeleteTable}
          className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-900/30 transition-colors"
        >
          {t.deleteTable}
        </button>
      </div>

      {/* Table Info */}
      <div className="space-y-2">
        <label className="block">
          <span className="text-[10px] text-[#718096] uppercase tracking-wider">{t.tableName}</span>
          <input
            data-table-name
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleNameBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleNameBlur()}
            className="mt-1 w-full bg-[#1A202C] border border-[#4A5568] text-white text-sm rounded px-3 py-1.5 focus:border-[#4DB8B0] focus:ring-1 focus:ring-[#4DB8B0] outline-none transition-colors"
          />
        </label>
        <label className="block">
          <span className="text-[10px] text-[#718096] uppercase tracking-wider">Comment</span>
          <input
            data-table-comment
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onBlur={handleCommentBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleCommentBlur()}
            className="mt-1 w-full bg-[#1A202C] border border-[#4A5568] text-white text-sm rounded px-3 py-1.5 focus:border-[#4DB8B0] focus:ring-1 focus:ring-[#4DB8B0] outline-none transition-colors"
            placeholder="Table description..."
          />
        </label>
      </div>

      {/* Columns */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-[#718096] uppercase tracking-wider">{t.columns}</span>
          <span className="text-[10px] text-[#4A5568]">{table.columns.length}</span>
        </div>

        <div className="space-y-1">
          {table.columns.map((col) => (
            <ColumnEditRow key={col.id} tableId={table.id} column={col} />
          ))}
        </div>

        <div className="flex gap-2 mt-3">
          <button
            onClick={handleAddColumn}
            className="flex-1 py-1.5 text-xs text-[#4DB8B0] border border-[#4DB8B0]/30 rounded hover:bg-[#4DB8B0]/10 transition-colors"
          >
            + {t.addColumn}
          </button>
          {table.columns.length === 0 && (
            <button
              onClick={handleAddDefaultColumns}
              className="flex-1 py-1.5 text-xs text-[#A0AEC0] border border-[#4A5568] rounded hover:bg-[#4A5568]/50 transition-colors"
            >
              + Default
            </button>
          )}
        </div>
      </div>

      {/* Relationships */}
      <RelationshipSection table={table} />
    </div>
  );
}

function RelationshipSection({ table }: { table: BuilderTable }) {
  const { state, dispatch } = useERDBuilder();
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [fromColumnId, setFromColumnId] = useState('');
  const [toTableId, setToTableId] = useState('');
  const [toColumnId, setToColumnId] = useState('');

  const tableRelationships = useMemo(
    () => state.relationships.filter((r) => r.fromTableId === table.id || r.toTableId === table.id),
    [state.relationships, table.id]
  );

  const otherTables = useMemo(
    () => state.tables.filter((t) => t.id !== table.id),
    [state.tables, table.id]
  );

  const targetTable = state.tables.find((t) => t.id === toTableId);

  const handleAdd = () => {
    if (fromColumnId && toTableId && toColumnId) {
      dispatch({
        type: 'ADD_RELATIONSHIP',
        payload: { fromTableId: table.id, fromColumnId, toTableId, toColumnId },
      });
      setShowForm(false);
      setFromColumnId('');
      setToTableId('');
      setToColumnId('');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-[#718096] uppercase tracking-wider">FK Relations</span>
        <span className="text-[10px] text-[#4A5568]">{tableRelationships.length}</span>
      </div>

      {/* Existing relationships */}
      {tableRelationships.map((rel) => {
        const fromTbl = state.tables.find((t) => t.id === rel.fromTableId);
        const toTbl = state.tables.find((t) => t.id === rel.toTableId);
        const fromCol = fromTbl?.columns.find((c) => c.id === rel.fromColumnId);
        const toCol = toTbl?.columns.find((c) => c.id === rel.toColumnId);
        const isOutgoing = rel.fromTableId === table.id;
        return (
          <div key={rel.id} className="flex items-center justify-between bg-[#1A202C] rounded px-2 py-1.5 mb-1 border border-[#4A5568]/30">
            <div className="text-[10px] text-[#A0AEC0] truncate flex-1">
              {isOutgoing ? (
                <><span className="text-[#E2E8F0]">{fromCol?.name}</span> → <span className="text-[#4DB8B0]">{toTbl?.name}</span>.{toCol?.name}</>
              ) : (
                <><span className="text-[#4DB8B0]">{fromTbl?.name}</span>.{fromCol?.name} → <span className="text-[#E2E8F0]">{toCol?.name}</span></>
              )}
            </div>
            <button
              onClick={() => dispatch({ type: 'DELETE_RELATIONSHIP', payload: { relationshipId: rel.id } })}
              className="text-[#4A5568] hover:text-red-400 ml-2 shrink-0 transition-colors"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        );
      })}

      {/* Add form */}
      {showForm ? (
        <div className="bg-[#1A202C] rounded p-2 border border-[#4A5568]/50 mt-2 space-y-2">
          <select
            value={fromColumnId}
            onChange={(e) => setFromColumnId(e.target.value)}
            className="w-full bg-[#2D3748] border border-[#4A5568]/50 text-[10px] text-[#A0AEC0] rounded px-2 py-1 outline-none"
          >
            <option value="">From column...</option>
            {table.columns.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            value={toTableId}
            onChange={(e) => { setToTableId(e.target.value); setToColumnId(''); }}
            className="w-full bg-[#2D3748] border border-[#4A5568]/50 text-[10px] text-[#A0AEC0] rounded px-2 py-1 outline-none"
          >
            <option value="">To table...</option>
            {otherTables.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          {targetTable && (
            <select
              value={toColumnId}
              onChange={(e) => setToColumnId(e.target.value)}
              className="w-full bg-[#2D3748] border border-[#4A5568]/50 text-[10px] text-[#A0AEC0] rounded px-2 py-1 outline-none"
            >
              <option value="">To column...</option>
              {targetTable.columns.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
          <div className="flex gap-1">
            <button
              onClick={handleAdd}
              disabled={!fromColumnId || !toTableId || !toColumnId}
              className="flex-1 py-1 text-[10px] text-white bg-[#4DB8B0] rounded hover:bg-[#45A89F] disabled:opacity-40 transition-colors"
            >
              {t.addRelationship}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-2 py-1 text-[10px] text-[#A0AEC0] border border-[#4A5568] rounded hover:bg-[#4A5568] transition-colors"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          disabled={table.columns.length === 0 || otherTables.length === 0}
          className="w-full mt-2 py-1.5 text-xs text-[#4DB8B0] border border-[#4DB8B0]/30 rounded hover:bg-[#4DB8B0]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          + {t.addRelationship}
        </button>
      )}
    </div>
  );
}
