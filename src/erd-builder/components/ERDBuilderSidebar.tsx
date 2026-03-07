import { useERDBuilder } from '../context';
import TableEditPanel from './TableEditPanel';
import RelationshipEditPanel from './RelationshipEditPanel';
import { useLanguage } from '../../i18n/LanguageContext';

export default function ERDBuilderSidebar() {
  const { state } = useERDBuilder();
  const { t } = useLanguage();

  const selectedTable = state.selectedTableId
    ? state.tables.find((t) => t.id === state.selectedTableId)
    : null;

  const selectedRelationship = state.selectedRelationshipId
    ? state.relationships.find((r) => r.id === state.selectedRelationshipId)
    : null;

  const isOpen = !!(selectedTable || selectedRelationship);

  return (
    <div
      className={`bg-[#2D3748] border-l border-[#4A5568] overflow-y-auto transition-all duration-200 shrink-0 ${
        isOpen ? 'w-80' : 'w-0'
      }`}
    >
      <div className="w-80">
        {selectedTable && <TableEditPanel table={selectedTable} />}
        {selectedRelationship && <RelationshipEditPanel relationship={selectedRelationship} />}
        {!selectedTable && !selectedRelationship && (
          <div className="p-4 text-sm text-[#718096]">{t.noTablesYet}</div>
        )}
      </div>
    </div>
  );
}
