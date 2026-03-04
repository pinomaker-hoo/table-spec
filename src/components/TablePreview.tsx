import { useState, useMemo } from 'react';
import type { ParsedTable } from '../types/ddl';

interface TablePreviewProps {
  tables: ParsedTable[];
}

function buildFKRelationshipMap(tables: ParsedTable[]): Map<string, Set<string>> {
  const relMap = new Map<string, Set<string>>();
  for (const table of tables) relMap.set(table.name, new Set<string>());
  for (const table of tables) {
    for (const col of table.columns) {
      if (col.isForeignKey && col.foreignKeyRef) {
        const ref = col.foreignKeyRef.table;
        if (ref !== table.name) {
          relMap.get(table.name)?.add(ref);
          if (!relMap.has(ref)) relMap.set(ref, new Set<string>());
          relMap.get(ref)?.add(table.name);
        }
      }
    }
  }
  return relMap;
}

function formatConstraints(col: {
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  isUnique: boolean;
  isAutoIncrement: boolean;
}): string {
  const parts: string[] = [];
  if (col.isPrimaryKey) parts.push('PK');
  if (col.isForeignKey) parts.push('FK');
  if (col.isUnique) parts.push('UQ');
  if (col.isAutoIncrement) parts.push('AI');
  return parts.join(', ');
}

function ConstraintBadge({ label }: { label: string }) {
  const colors: Record<string, string> = {
    PK: 'bg-blue-500/20 text-blue-300',
    FK: 'bg-emerald-500/20 text-emerald-300',
    UQ: 'bg-purple-500/20 text-purple-300',
    AI: 'bg-orange-500/20 text-orange-300',
  };
  return (
    <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${colors[label] || 'bg-[#4A5568] text-[#A0AEC0]'}`}>
      {label}
    </span>
  );
}

export default function TablePreview({ tables }: TablePreviewProps) {
  const [activeTab, setActiveTab] = useState(-1); // -1 = summary tab
  const relMap = useMemo(() => buildFKRelationshipMap(tables), [tables]);
  const sortedTables = useMemo(
    () => [...tables].sort((a, b) => a.name.localeCompare(b.name)),
    [tables]
  );

  const isSummary = activeTab === -1;
  const table = !isSummary ? sortedTables[activeTab] : null;

  return (
    <div className="border border-[#4A5568] rounded-xl overflow-hidden">
      {/* Tab bar */}
      <div className="flex overflow-x-auto bg-[#2D3748] border-b border-[#4A5568]">
        <button
          onClick={() => setActiveTab(-1)}
          className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
            isSummary
              ? 'border-[#4DB8B0] text-[#4DB8B0] bg-[#1A202C]'
              : 'border-transparent text-[#A0AEC0] hover:text-[#E2E8F0] hover:bg-[#4A5568]/50'
          }`}
        >
          테이블 목록
        </button>
        {sortedTables.map((t, i) => (
          <button
            key={t.name}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              i === activeTab
                ? 'border-[#4DB8B0] text-[#4DB8B0] bg-[#1A202C]'
                : 'border-transparent text-[#A0AEC0] hover:text-[#E2E8F0] hover:bg-[#4A5568]/50'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {isSummary ? (
        <>
          {/* Summary info */}
          <div className="p-4 bg-[#2D3748] border-b border-[#4A5568]">
            <div className="flex items-center gap-4 text-sm">
              <span className="font-semibold text-[#E2E8F0]">테이블 목록</span>
              <span className="ml-auto text-[#718096]">{tables.length}개 테이블</span>
            </div>
          </div>

          {/* Summary table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1A202C] text-[#A0AEC0]">
                  <th className="px-3 py-2 text-center w-12">#</th>
                  <th className="px-3 py-2 text-left">테이블명</th>
                  <th className="px-3 py-2 text-left">테이블 설명</th>
                  <th className="px-3 py-2 text-left">FK 관련 테이블</th>
                </tr>
              </thead>
              <tbody>
                {sortedTables.map((t, i) => {
                  const related = relMap.get(t.name);
                  const relatedStr = related && related.size > 0
                    ? Array.from(related).sort().join(', ')
                    : '-';
                  return (
                    <tr
                      key={t.name}
                      className={`${i % 2 === 0 ? 'bg-[#2D3748]' : 'bg-[#2D3748]/60'} cursor-pointer hover:bg-[#4DB8B0]/10 transition-colors`}
                      onClick={() => setActiveTab(i)}
                    >
                      <td className="px-3 py-2 text-center text-[#718096]">{i + 1}</td>
                      <td className="px-3 py-2 font-mono text-[#4DB8B0] hover:underline">{t.name}</td>
                      <td className="px-3 py-2 text-[#A0AEC0]">{t.comment || '-'}</td>
                      <td className="px-3 py-2 text-[#718096] text-xs font-mono">{relatedStr}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : table && (
        <>
          {/* Table info */}
          <div className="p-4 bg-[#2D3748] border-b border-[#4A5568]">
            <div className="flex items-center gap-4 text-sm">
              <span className="font-semibold text-[#E2E8F0]">{table.name}</span>
              {table.comment && (
                <span className="text-[#718096]">— {table.comment}</span>
              )}
              <span className="ml-auto text-[#718096]">{table.columns.length}개 컬럼</span>
            </div>
          </div>

          {/* Column table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1A202C] text-[#A0AEC0]">
                  <th className="px-3 py-2 text-center w-12">#</th>
                  <th className="px-3 py-2 text-left">컬럼명</th>
                  <th className="px-3 py-2 text-center">데이터타입</th>
                  <th className="px-3 py-2 text-center w-20">NULL</th>
                  <th className="px-3 py-2 text-center">기본값</th>
                  <th className="px-3 py-2 text-center">제약조건</th>
                  <th className="px-3 py-2 text-left">정의/설명</th>
                </tr>
              </thead>
              <tbody>
                {table.columns.map((col, i) => {
                  const constraints = formatConstraints(col);
                  return (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? 'bg-[#2D3748]' : 'bg-[#2D3748]/60'}
                    >
                      <td className="px-3 py-2 text-center text-[#718096]">{i + 1}</td>
                      <td className="px-3 py-2 font-mono text-[#E2E8F0]">{col.name}</td>
                      <td className="px-3 py-2 text-center font-mono text-xs text-[#A0AEC0]">
                        {col.dataType}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span
                          className={`text-xs ${
                            col.nullable ? 'text-[#718096]' : 'text-red-400 font-medium'
                          }`}
                        >
                          {col.nullable ? 'NULL' : 'NOT NULL'}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center text-xs text-[#718096]">
                        {col.defaultValue ?? '-'}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <div className="flex gap-1 justify-center">
                          {constraints
                            ? constraints.split(', ').map((c) => (
                                <ConstraintBadge key={c} label={c} />
                              ))
                            : <span className="text-[#4A5568]">-</span>}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-[#A0AEC0]">{col.comment || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
