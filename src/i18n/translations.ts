export type Language = 'en' | 'ko';

const translations = {
  en: {
    // App
    subtitle: 'DDL SQL to Table Specification',
    resetUpload: 'Re-upload',
    tableFound: (fileName: string, count: number) =>
      `Found <strong>${count}</strong> tables from <strong>${fileName}</strong>`,

    // FileUpload
    readingFile: 'Reading file...',
    dragPrompt: 'Drag & drop your DDL SQL file here',
    selectFile: 'or click to select a file (.sql, .ddl, .txt)',

    // TablePreview
    tableList: 'Table List',
    tableCount: (count: number) => `${count} tables`,
    columnCount: (count: number) => `${count} columns`,
    tableName: 'Table Name',
    tableDesc: 'Description',
    fkRelation: 'FK Relations',
    columnName: 'Column',
    dataType: 'Data Type',
    nullable: 'NULL',
    notNull: 'NOT NULL',
    defaultValue: 'Default',
    constraints: 'Constraints',
    definition: 'Definition',

    // DownloadButton
    excelDownload: (count: number) => `Excel Download (${count} tables)`,

    // ERDDownloadButton
    erdGenerating: 'Generating ERD...',
    erdDownload: (count: number) => `ERD Download (${count} tables)`,

    // ERDPreview
    erdDiagram: 'ERD Diagram',
    tablesRelationships: (tables: number, rels: number) =>
      `${tables} Tables, ${rels} Relationships`,
    fit: 'Fit',

    // Errors
    fileReadError: 'Failed to read the file.',
    noCreateTable: 'No CREATE TABLE statement found.',
    parseError: (msg: string) => `Parse error: ${msg}`,
  },
  ko: {
    // App
    subtitle: 'DDL SQL을 테이블 명세서로 변환',
    resetUpload: '다시 업로드',
    tableFound: (fileName: string, count: number) =>
      `<strong>${fileName}</strong>에서 <strong>${count}개</strong> 테이블을 찾았습니다`,

    // FileUpload
    readingFile: '파일을 읽는 중...',
    dragPrompt: 'DDL SQL 파일을 여기에 드래그하세요',
    selectFile: '또는 클릭하여 파일을 선택하세요 (.sql, .ddl, .txt)',

    // TablePreview
    tableList: '테이블 목록',
    tableCount: (count: number) => `${count}개 테이블`,
    columnCount: (count: number) => `${count}개 컬럼`,
    tableName: '테이블명',
    tableDesc: '테이블 설명',
    fkRelation: 'FK 관련 테이블',
    columnName: '컬럼명',
    dataType: '데이터타입',
    nullable: 'NULL',
    notNull: 'NOT NULL',
    defaultValue: '기본값',
    constraints: '제약조건',
    definition: '정의/설명',

    // DownloadButton
    excelDownload: (count: number) => `Excel 다운로드 (${count}개 테이블)`,

    // ERDDownloadButton
    erdGenerating: 'ERD 생성 중...',
    erdDownload: (count: number) => `ERD 다운로드 (${count}개 테이블)`,

    // ERDPreview
    erdDiagram: 'ERD Diagram',
    tablesRelationships: (tables: number, rels: number) =>
      `${tables} Tables, ${rels} Relationships`,
    fit: 'Fit',

    // Errors
    fileReadError: '파일을 읽는데 실패했습니다.',
    noCreateTable: 'CREATE TABLE 구문을 찾을 수 없습니다.',
    parseError: (msg: string) => `파싱 오류: ${msg}`,
  },
};

export type Translations = typeof translations.en;
export default translations;
