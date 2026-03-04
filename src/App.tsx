import FileUpload from './components/FileUpload';
import TablePreview from './components/TablePreview';
import DownloadButton from './components/DownloadButton';
import ERDDownloadButton from './components/ERDDownloadButton';
import ERDPreview from './components/ERDPreview';
import GoogleAd from './components/GoogleAd';
import { useFileUpload } from './hooks/useFileUpload';
import { useDDLParser } from './hooks/useDDLParser';

function App() {
  const { file, content, loading, error: fileError, handleFile, reset } = useFileUpload();
  const { tables, error: parseError } = useDDLParser(content);

  const error = fileError || parseError;

  return (
    <div className="min-h-screen bg-[#1A202C]">
      {/* Header */}
      <header className="bg-[#2D3748] border-b border-[#4A5568]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="TableSpec" className="w-8 h-8 rounded" />
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">TableSpec</h1>
              <p className="text-xs text-[#A0AEC0]">DDL SQL to Table Specification</p>
            </div>
          </div>
          {file && (
            <button
              onClick={reset}
              className="text-sm text-[#A0AEC0] hover:text-white px-4 py-2 rounded-lg border border-[#4A5568] hover:border-[#63B3ED] hover:bg-[#2A4365] transition-colors"
            >
              다시 업로드
            </button>
          )}
        </div>
      </header>

      {/* Ad - Top Banner */}
      <div className="max-w-7xl mx-auto px-6 pt-4">
        <GoogleAd slot="YOUR_AD_SLOT_1" />
      </div>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* File Upload */}
        {!file && (
          <div className="max-w-2xl mx-auto">
            <FileUpload onFileSelect={handleFile} loading={loading} />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Results */}
        {tables.length > 0 && (
          <div className="space-y-6">
            {/* Info bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#A0AEC0]">
                  <strong className="text-white">{file?.name}</strong>에서{' '}
                  <strong className="text-[#4DB8B0]">{tables.length}개</strong> 테이블을 찾았습니다
                </span>
              </div>
              <div className="flex items-center gap-3">
                <ERDDownloadButton tables={tables} />
                <DownloadButton tables={tables} />
              </div>
            </div>

            {/* ERD Preview */}
            <ERDPreview tables={tables} />

            {/* Table Preview */}
            <TablePreview tables={tables} />

            {/* Ad - Bottom */}
            <GoogleAd slot="YOUR_AD_SLOT_2" />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
