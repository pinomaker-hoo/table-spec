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

    // Guide - How to Use
    guideTitle: 'How to Use',
    guideStep1Title: 'Prepare DDL File',
    guideStep1Desc: 'Prepare your SQL DDL file (.sql, .ddl, .txt) containing CREATE TABLE statements.',
    guideStep2Title: 'Upload File',
    guideStep2Desc: 'Drag & drop or click the upload area above to select your file.',
    guideStep3Title: 'View & Download',
    guideStep3Desc: 'Review your table specification and ERD, then download as Excel or PNG.',

    // Guide - Features
    featuresTitle: 'Key Features',
    feature1Title: 'DDL Parsing',
    feature1Desc: 'Supports MySQL, PostgreSQL, Oracle and more SQL dialects.',
    feature2Title: 'Auto Specification',
    feature2Desc: 'Automatically generates table specifications with columns, types, and constraints.',
    feature3Title: 'ERD Visualization',
    feature3Desc: 'Visualizes entity relationships between tables as an interactive diagram.',
    feature4Title: 'Excel & PNG Export',
    feature4Desc: 'Download your specification as a styled Excel file or ERD as PNG image.',

    // Guide - Example
    exampleTitle: 'Live Example',
    exampleDDLLabel: 'Sample DDL Input',
    exampleResultLabel: 'Generated Table Specification',
    exampleCTA: 'Try it yourself — upload your DDL file above!',

    // About
    aboutTitle: 'About TableSpec',
    aboutDesc: 'TableSpec is a free, open-source web tool that converts DDL SQL files into clean table specifications and ERD diagrams. All processing happens entirely in your browser — your files are never uploaded to any server. Built for developers, DBAs, and anyone who works with databases and needs quick, readable documentation from their schema definitions.',

    // Footer
    footerAbout: 'A free web tool that converts DDL SQL into table specifications and ERD diagrams. All processing happens in your browser.',
    footerLinks: 'Legal',
    footerDeveloper: 'Developer',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',

    // Errors
    fileReadError: 'Failed to read the file.',
    noCreateTable: 'No CREATE TABLE statement found.',
    parseError: (msg: string) => `Parse error: ${msg}`,

    // ERD Builder
    erdBuilder: 'ERD Builder',
    erdBuilderSubtitle: 'Design your database schema visually',
    erdBuilderCTA: 'ERD Builder',
    addTable: 'Add Table',
    editTable: 'Edit Table',
    deleteTable: 'Delete Table',
    addColumn: 'Add Column',
    deleteColumn: 'Delete Column',
    columns: 'Columns',
    addRelationship: 'Add Relationship',
    deleteRelationship: 'Delete Relationship',
    editRelationship: 'Relationship',
    autoLayout: 'Auto Layout',
    fitToScreen: 'Fit to Screen',
    undo: 'Undo',
    redo: 'Redo',
    import_: 'Import',
    export_: 'Export',
    importDDL: 'DDL SQL',
    importProject: 'Project File',
    exportDDL: 'DDL SQL',
    exportProject: 'Project File',
    exportPNG: 'PNG Image',
    exportExcel: 'Excel',
    noTablesYet: 'No tables yet. Click + to add a table or import a DDL file.',
    addDefaultColumns: 'Add default columns (id, created_at, updated_at)',
    cancel: 'Cancel',
    create: 'Create',
    displaySettings: 'Display Settings',
    displayDataType: 'Data Type',
    displayConstraints: 'Constraints (PK, FK)',
    displayNullable: 'NULL / NOT NULL',
    displayDefault: 'Default Value',
    displayComment: 'Comment',
    displayUnique: 'UNIQUE',
    displayAutoIncrement: 'AUTO_INCREMENT',
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

    // Guide - How to Use
    guideTitle: '사용 방법',
    guideStep1Title: 'DDL 파일 준비',
    guideStep1Desc: 'CREATE TABLE 구문이 포함된 SQL DDL 파일(.sql, .ddl, .txt)을 준비하세요.',
    guideStep2Title: '파일 업로드',
    guideStep2Desc: '위 업로드 영역에 드래그 앤 드롭하거나 클릭하여 파일을 선택하세요.',
    guideStep3Title: '결과 확인 & 다운로드',
    guideStep3Desc: '테이블 명세서와 ERD를 확인한 후, Excel 또는 PNG로 다운로드하세요.',

    // Guide - Features
    featuresTitle: '주요 기능',
    feature1Title: 'DDL 파싱',
    feature1Desc: 'MySQL, PostgreSQL, Oracle 등 다양한 SQL 문법을 지원합니다.',
    feature2Title: '명세서 자동 생성',
    feature2Desc: '컬럼, 데이터 타입, 제약조건이 포함된 테이블 명세서를 자동으로 생성합니다.',
    feature3Title: 'ERD 시각화',
    feature3Desc: '테이블 간의 관계를 인터랙티브 다이어그램으로 시각화합니다.',
    feature4Title: 'Excel & PNG 내보내기',
    feature4Desc: '명세서를 스타일링된 Excel 파일로, ERD를 PNG 이미지로 다운로드할 수 있습니다.',

    // Guide - Example
    exampleTitle: '예시 미리보기',
    exampleDDLLabel: '샘플 DDL 입력',
    exampleResultLabel: '생성된 테이블 명세서',
    exampleCTA: '직접 해보세요 — 위에서 DDL 파일을 업로드하세요!',

    // About
    aboutTitle: 'TableSpec 소개',
    aboutDesc: 'TableSpec은 DDL SQL 파일을 깔끔한 테이블 명세서와 ERD 다이어그램으로 변환하는 무료 웹 도구입니다. 모든 처리가 브라우저에서 이루어지므로 파일이 서버로 전송되지 않습니다. 개발자, DBA, 그리고 데이터베이스 스키마에서 빠르고 읽기 쉬운 문서가 필요한 모든 분을 위해 만들었습니다.',

    // Footer
    footerAbout: 'DDL SQL을 테이블 명세서와 ERD 다이어그램으로 변환하는 무료 웹 도구입니다. 모든 처리가 브라우저에서 이루어집니다.',
    footerLinks: '법적 고지',
    footerDeveloper: '개발자',
    privacyPolicy: '개인정보처리방침',
    termsOfService: '이용약관',

    // Errors
    fileReadError: '파일을 읽는데 실패했습니다.',
    noCreateTable: 'CREATE TABLE 구문을 찾을 수 없습니다.',
    parseError: (msg: string) => `파싱 오류: ${msg}`,

    // ERD Builder
    erdBuilder: 'ERD 빌더',
    erdBuilderSubtitle: '데이터베이스 스키마를 시각적으로 설계',
    erdBuilderCTA: 'ERD 빌더',
    addTable: '테이블 추가',
    editTable: '테이블 편집',
    deleteTable: '테이블 삭제',
    addColumn: '컬럼 추가',
    deleteColumn: '컬럼 삭제',
    columns: '컬럼',
    addRelationship: '관계 추가',
    deleteRelationship: '관계 삭제',
    editRelationship: '관계',
    autoLayout: '자동 정렬',
    fitToScreen: '화면에 맞추기',
    undo: '되돌리기',
    redo: '다시 실행',
    import_: '가져오기',
    export_: '내보내기',
    importDDL: 'DDL SQL',
    importProject: '프로젝트 파일',
    exportDDL: 'DDL SQL',
    exportProject: '프로젝트 파일',
    exportPNG: 'PNG 이미지',
    exportExcel: 'Excel',
    noTablesYet: '테이블이 없습니다. +를 눌러 테이블을 추가하거나 DDL 파일을 가져오세요.',
    addDefaultColumns: '기본 컬럼 추가 (id, created_at, updated_at)',
    cancel: '취소',
    create: '생성',
    displaySettings: '표시 설정',
    displayDataType: '데이터 타입',
    displayConstraints: '제약조건 (PK, FK)',
    displayNullable: 'NULL / NOT NULL',
    displayDefault: '기본값',
    displayComment: '코멘트',
    displayUnique: 'UNIQUE',
    displayAutoIncrement: 'AUTO_INCREMENT',
  },
};

export type Translations = typeof translations.en;
export default translations;
