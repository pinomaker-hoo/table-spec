import type { BuilderRelationship } from '../types';
import { useERDBuilder } from '../context';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  relationship: BuilderRelationship;
}

export default function RelationshipEditPanel({ relationship }: Props) {
  const { state, dispatch } = useERDBuilder();
  const { t } = useLanguage();

  const fromTable = state.tables.find((t) => t.id === relationship.fromTableId);
  const toTable = state.tables.find((t) => t.id === relationship.toTableId);
  const fromColumn = fromTable?.columns.find((c) => c.id === relationship.fromColumnId);
  const toColumn = toTable?.columns.find((c) => c.id === relationship.toColumnId);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#E2E8F0]">{t.editRelationship}</h3>
        <button
          onClick={() => dispatch({ type: 'DELETE_RELATIONSHIP', payload: { relationshipId: relationship.id } })}
          className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-900/30 transition-colors"
        >
          {t.deleteRelationship}
        </button>
      </div>

      <div className="space-y-3">
        {/* From */}
        <div className="bg-[#1A202C] rounded p-3 border border-[#4A5568]/50">
          <span className="text-[9px] text-[#4A5568] uppercase tracking-wider">From</span>
          <div className="mt-1 text-sm text-[#E2E8F0]">
            <span className="text-[#4DB8B0]">{fromTable?.name || '?'}</span>
            <span className="text-[#4A5568] mx-1">.</span>
            <span>{fromColumn?.name || '?'}</span>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A5568" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </div>

        {/* To */}
        <div className="bg-[#1A202C] rounded p-3 border border-[#4A5568]/50">
          <span className="text-[9px] text-[#4A5568] uppercase tracking-wider">To (Referenced)</span>
          <div className="mt-1 text-sm text-[#E2E8F0]">
            <span className="text-[#4DB8B0]">{toTable?.name || '?'}</span>
            <span className="text-[#4A5568] mx-1">.</span>
            <span>{toColumn?.name || '?'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
