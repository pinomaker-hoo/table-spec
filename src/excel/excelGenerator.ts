import * as XLSX from 'xlsx-js-style';
import type { ParsedTable, ParsedColumn } from '../types/ddl';
import { STYLES } from './styles';

function setCellWithStyle(
  ws: XLSX.WorkSheet,
  row: number,
  col: number,
  value: string | number,
  style: Record<string, unknown>
): void {
  const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
  ws[cellRef] = {
    v: value,
    t: typeof value === 'number' ? 'n' : 's',
    s: style,
  };
}

function formatDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

function formatConstraints(col: ParsedColumn): string {
  const parts: string[] = [];
  if (col.isPrimaryKey) parts.push('PK');
  if (col.isForeignKey) parts.push('FK');
  if (col.isUnique) parts.push('UQ');
  if (col.isAutoIncrement) parts.push('AI');
  return parts.join(', ');
}

const TOTAL_COLS = 9; // no, 컬럼명, 데이터타입, NULL, 기본값, 제약조건, 정의/설명, 사용자, 비고

function buildWorksheet(table: ParsedTable): XLSX.WorkSheet {
  const ws: XLSX.WorkSheet = {};

  // Column widths
  ws['!cols'] = [
    { wch: 5 },   // no
    { wch: 25 },  // 컬럼명
    { wch: 20 },  // 데이터타입
    { wch: 10 },  // NULL
    { wch: 20 },  // 기본값
    { wch: 15 },  // 제약조건
    { wch: 50 },  // 정의/설명
    { wch: 10 },  // 사용자
    { wch: 15 },  // 비고
  ];

  // Merged cells
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: TOTAL_COLS - 1 } }, // Title
    { s: { r: 1, c: 1 }, e: { r: 1, c: TOTAL_COLS - 1 } }, // Date value
    { s: { r: 2, c: 1 }, e: { r: 2, c: TOTAL_COLS - 1 } }, // Table name value
    { s: { r: 3, c: 1 }, e: { r: 3, c: TOTAL_COLS - 1 } }, // Description value
  ];

  // Row 1 (r=0): Title
  setCellWithStyle(ws, 0, 0, 'Table Specification', STYLES.titleCell);
  for (let c = 1; c < TOTAL_COLS; c++) {
    setCellWithStyle(ws, 0, c, '', STYLES.titleCell);
  }

  // Row 2 (r=1): 작성일
  setCellWithStyle(ws, 1, 0, '작성일', STYLES.metaLabel);
  setCellWithStyle(ws, 1, 1, formatDate(), STYLES.metaValue);
  for (let c = 2; c < TOTAL_COLS; c++) {
    setCellWithStyle(ws, 1, c, '', STYLES.metaValue);
  }

  // Row 3 (r=2): 테이블명
  setCellWithStyle(ws, 2, 0, '테이블명', STYLES.metaLabel);
  setCellWithStyle(ws, 2, 1, table.name, STYLES.metaValue);
  for (let c = 2; c < TOTAL_COLS; c++) {
    setCellWithStyle(ws, 2, c, '', STYLES.metaValue);
  }

  // Row 4 (r=3): 상세설명
  setCellWithStyle(ws, 3, 0, '상세설명', STYLES.metaLabel);
  setCellWithStyle(ws, 3, 1, table.comment || '', STYLES.metaValue);
  for (let c = 2; c < TOTAL_COLS; c++) {
    setCellWithStyle(ws, 3, c, '', STYLES.metaValue);
  }

  // Row 5 (r=4): empty row - add thin borders for clean look
  for (let c = 0; c < TOTAL_COLS; c++) {
    setCellWithStyle(ws, 4, c, '', {});
  }

  // Row 6 (r=5): Column headers
  const headers = ['no', '컬럼명', '데이터타입', 'NULL', '기본값', '제약조건', '정의/설명', '사용자', '비고'];
  headers.forEach((header, c) => {
    setCellWithStyle(ws, 5, c, header, STYLES.columnHeader);
  });

  // Row 7+ (r=6+): Data rows
  table.columns.forEach((col, i) => {
    const r = 6 + i;
    setCellWithStyle(ws, r, 0, i + 1, STYLES.dataCellCentered);
    setCellWithStyle(ws, r, 1, col.name, STYLES.dataCell);
    setCellWithStyle(ws, r, 2, col.dataType, STYLES.dataCellCentered);
    setCellWithStyle(ws, r, 3, col.nullable ? 'NULL' : 'NOT NULL', STYLES.dataCellCentered);
    setCellWithStyle(ws, r, 4, col.defaultValue ?? '', STYLES.dataCellCentered);
    setCellWithStyle(ws, r, 5, formatConstraints(col), STYLES.dataCellCentered);
    setCellWithStyle(ws, r, 6, col.comment, STYLES.dataCell);
    setCellWithStyle(ws, r, 7, '', STYLES.dataCellCentered); // 사용자 (빈칸)
    setCellWithStyle(ws, r, 8, '', STYLES.dataCell);         // 비고 (빈칸)
  });

  // Set worksheet range
  const lastRow = 6 + table.columns.length - 1;
  ws['!ref'] = XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: Math.max(lastRow, 5), c: TOTAL_COLS - 1 },
  });

  // Row heights
  ws['!rows'] = [
    { hpt: 30 }, // Title row
  ];

  return ws;
}

/**
 * Build a bidirectional FK relationship map.
 * For each table, collect all FK-related tables (both directions, deduplicated).
 */
function buildFKRelationshipMap(tables: ParsedTable[]): Map<string, Set<string>> {
  const relMap = new Map<string, Set<string>>();

  for (const table of tables) {
    relMap.set(table.name, new Set<string>());
  }

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

const SUMMARY_COLS = 4;

function buildSummarySheet(tables: ParsedTable[], relMap: Map<string, Set<string>>): XLSX.WorkSheet {
  const ws: XLSX.WorkSheet = {};

  ws['!cols'] = [
    { wch: 5 },   // No
    { wch: 35 },  // 테이블명
    { wch: 50 },  // 테이블 설명
    { wch: 80 },  // FK 관련 테이블
  ];

  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: SUMMARY_COLS - 1 } },
    { s: { r: 1, c: 1 }, e: { r: 1, c: SUMMARY_COLS - 1 } },
    { s: { r: 2, c: 1 }, e: { r: 2, c: SUMMARY_COLS - 1 } },
  ];

  // Row 0: Title
  setCellWithStyle(ws, 0, 0, '테이블 목록', STYLES.titleCell);
  for (let c = 1; c < SUMMARY_COLS; c++) setCellWithStyle(ws, 0, c, '', STYLES.titleCell);

  // Row 1: 작성일
  setCellWithStyle(ws, 1, 0, '작성일', STYLES.metaLabel);
  setCellWithStyle(ws, 1, 1, formatDate(), STYLES.metaValue);
  for (let c = 2; c < SUMMARY_COLS; c++) setCellWithStyle(ws, 1, c, '', STYLES.metaValue);

  // Row 2: 총 테이블 수
  setCellWithStyle(ws, 2, 0, '총 테이블 수', STYLES.metaLabel);
  setCellWithStyle(ws, 2, 1, `${tables.length}개`, STYLES.metaValue);
  for (let c = 2; c < SUMMARY_COLS; c++) setCellWithStyle(ws, 2, c, '', STYLES.metaValue);

  // Row 3: empty spacer
  for (let c = 0; c < SUMMARY_COLS; c++) setCellWithStyle(ws, 3, c, '', {});

  // Row 4: Headers
  const headers = ['No', '테이블명', '테이블 설명', 'FK 관련 테이블'];
  headers.forEach((header, c) => setCellWithStyle(ws, 4, c, header, STYLES.columnHeader));

  // Row 5+: Data (sorted by table name ASC)
  const sortedTables = [...tables].sort((a, b) => a.name.localeCompare(b.name));
  sortedTables.forEach((table, i) => {
    const r = 5 + i;
    const related = relMap.get(table.name);
    const relatedStr = related && related.size > 0
      ? Array.from(related).sort().join(', ')
      : '';

    setCellWithStyle(ws, r, 0, i + 1, STYLES.dataCellCentered);
    setCellWithStyle(ws, r, 1, table.name, STYLES.dataCell);
    setCellWithStyle(ws, r, 2, table.comment || '', STYLES.dataCell);
    setCellWithStyle(ws, r, 3, relatedStr, STYLES.dataCell);
  });

  const lastRow = 5 + tables.length - 1;
  ws['!ref'] = XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: Math.max(lastRow, 4), c: SUMMARY_COLS - 1 },
  });

  ws['!rows'] = [{ hpt: 30 }];

  return ws;
}

export function generateAndDownloadExcel(tables: ParsedTable[], filename = 'table_specification.xlsx'): void {
  const wb = XLSX.utils.book_new();
  const usedNames = new Set<string>();

  // Summary sheet first
  const relMap = buildFKRelationshipMap(tables);
  const summaryWs = buildSummarySheet(tables, relMap);
  XLSX.utils.book_append_sheet(wb, summaryWs, '테이블 목록');
  usedNames.add('테이블 목록');

  const sortedTablesForSheets = [...tables].sort((a, b) => a.name.localeCompare(b.name));
  for (const table of sortedTablesForSheets) {
    let sheetName = table.name.substring(0, 31);

    // Handle duplicate sheet names
    if (usedNames.has(sheetName)) {
      let suffix = 2;
      while (usedNames.has(`${sheetName.substring(0, 28)}_${suffix}`)) {
        suffix++;
      }
      sheetName = `${sheetName.substring(0, 28)}_${suffix}`;
    }
    usedNames.add(sheetName);

    const ws = buildWorksheet(table);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  }

  XLSX.writeFile(wb, filename);
}
