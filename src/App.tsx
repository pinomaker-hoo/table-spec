import { Link } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import TablePreview from './components/TablePreview';
import DownloadButton from './components/DownloadButton';
import ERDDownloadButton from './components/ERDDownloadButton';
import ERDPreview from './components/ERDPreview';
import GoogleAd from './components/GoogleAd';
import Guide from './components/Guide';
import Footer from './components/Footer';
import { useFileUpload } from './hooks/useFileUpload';
import { useDDLParser } from './hooks/useDDLParser';
import { useLanguage } from './i18n/LanguageContext';

function App() {
  const { file, content, loading, error: fileError, handleFile, reset } = useFileUpload();
  const { tables, error: parseError } = useDDLParser(content);
  const { lang, setLang, t } = useLanguage();

  const translateError = (key: string | null): string | null => {
    if (!key) return null;
    if (key === 'fileReadError') return t.fileReadError;
    if (key === 'noCreateTable') return t.noCreateTable;
    if (key.startsWith('parseError:')) return t.parseError(key.slice('parseError:'.length));
    return key;
  };

  const error = translateError(fileError) || translateError(parseError);

  return (
    <div className="min-h-screen bg-[#1A202C] flex flex-col">
      {/* Header */}
      <header className="bg-[#2D3748] border-b border-[#4A5568]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="TableSpec" className="w-8 h-8 rounded" />
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">TableSpec</h1>
              <p className="text-xs text-[#A0AEC0]">{t.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* ERD Builder Link */}
            <Link
              to="/erd-builder"
              className="text-sm text-white px-4 py-1.5 rounded-lg bg-[#4DB8B0] hover:bg-[#45A89F] transition-colors"
            >
              {t.erdBuilderCTA}
            </Link>
            {/* Language Switcher */}
            <div className="flex items-center border border-[#4A5568] rounded-lg overflow-hidden text-sm">
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 transition-colors ${
                  lang === 'en'
                    ? 'bg-[#4DB8B0] text-white'
                    : 'text-[#A0AEC0] hover:text-white hover:bg-[#4A5568]'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('ko')}
                className={`px-3 py-1.5 transition-colors ${
                  lang === 'ko'
                    ? 'bg-[#4DB8B0] text-white'
                    : 'text-[#A0AEC0] hover:text-white hover:bg-[#4A5568]'
                }`}
              >
                KO
              </button>
            </div>
            {file && (
              <button
                onClick={reset}
                className="text-sm text-[#A0AEC0] hover:text-white px-4 py-2 rounded-lg border border-[#4A5568] hover:border-[#63B3ED] hover:bg-[#2A4365] transition-colors"
              >
                {t.resetUpload}
              </button>
            )}
          </div>
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
          <>
            <div className="max-w-2xl mx-auto">
              <FileUpload onFileSelect={handleFile} loading={loading} />
            </div>
            <Guide />
          </>
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
                <span
                  className="text-sm text-[#A0AEC0]"
                  dangerouslySetInnerHTML={{
                    __html: t.tableFound(file?.name || '', tables.length),
                  }}
                />
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

      <Footer />
    </div>
  );
}

export default App;
