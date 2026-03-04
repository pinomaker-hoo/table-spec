import { useState, useEffect } from 'react';
import type { ParsedTable } from '../types/ddl';
import { parseDDL } from '../parser/ddlParser';

export function useDDLParser(sqlContent: string | null) {
  const [tables, setTables] = useState<ParsedTable[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sqlContent) {
      setTables([]);
      setError(null);
      return;
    }
    try {
      const parsed = parseDDL(sqlContent);
      if (parsed.length === 0) {
        setError('CREATE TABLE 구문을 찾을 수 없습니다.');
        setTables([]);
      } else {
        setTables(parsed);
        setError(null);
      }
    } catch (e) {
      setError(`파싱 오류: ${(e as Error).message}`);
      setTables([]);
    }
  }, [sqlContent]);

  return { tables, error };
}
