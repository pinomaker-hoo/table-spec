import { useState } from 'react';
import type { ParsedTable } from '../types/ddl';
import { generateAndDownloadERD } from '../erd/erdGenerator';

interface ERDDownloadButtonProps {
  tables: ParsedTable[];
}

export default function ERDDownloadButton({ tables }: ERDDownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      await generateAndDownloadERD(tables);
    } catch (err) {
      console.error('ERD generation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4DB8B0] text-white font-medium rounded-lg hover:bg-[#45A89F] disabled:bg-[#4DB8B0]/50 transition-colors shadow-sm text-sm"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        />
      </svg>
      {loading ? 'ERD 생성 중...' : `ERD 다운로드 (${tables.length}개 테이블)`}
    </button>
  );
}
