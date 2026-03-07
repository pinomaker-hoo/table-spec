import { useState, useRef } from 'react';
import { useERDBuilder } from '../context';
import { useLanguage } from '../../i18n/LanguageContext';
import { importFromDDL } from '../utils/importDDL';
import { deserializeProject } from '../utils/projectSerializer';

interface Props {
  onClose: () => void;
}

type Tab = 'ddl' | 'json';

export default function ImportModal({ onClose }: Props) {
  const { dispatch } = useERDBuilder();
  const { t } = useLanguage();
  const [tab, setTab] = useState<Tab>('ddl');
  const [ddlText, setDdlText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImportDDL = () => {
    if (!ddlText.trim()) return;
    try {
      const result = importFromDDL(ddlText);
      if (result.tables.length === 0) {
        setError(t.noCreateTable);
        return;
      }
      dispatch({ type: 'LOAD_STATE', payload: result });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Import failed');
    }
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        if (tab === 'ddl') {
          const result = importFromDDL(content);
          if (result.tables.length === 0) {
            setError(t.noCreateTable);
            return;
          }
          dispatch({ type: 'LOAD_STATE', payload: result });
        } else {
          const result = deserializeProject(content);
          dispatch({ type: 'LOAD_STATE', payload: result });
        }
        onClose();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Import failed');
      }
    };
    reader.onerror = () => setError(t.fileReadError);
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-[#2D3748] border border-[#4A5568] rounded-xl p-6 w-full max-w-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-white mb-4">{t.import_}</h2>

        {/* Tabs */}
        <div className="flex border-b border-[#4A5568] mb-4">
          <button
            onClick={() => { setTab('ddl'); setError(null); }}
            className={`px-4 py-2 text-sm transition-colors ${
              tab === 'ddl'
                ? 'text-[#4DB8B0] border-b-2 border-[#4DB8B0]'
                : 'text-[#A0AEC0] hover:text-white'
            }`}
          >
            {t.importDDL}
          </button>
          <button
            onClick={() => { setTab('json'); setError(null); }}
            className={`px-4 py-2 text-sm transition-colors ${
              tab === 'json'
                ? 'text-[#4DB8B0] border-b-2 border-[#4DB8B0]'
                : 'text-[#A0AEC0] hover:text-white'
            }`}
          >
            {t.importProject}
          </button>
        </div>

        {error && (
          <div className="mb-3 p-2 bg-red-900/30 border border-red-700/50 rounded text-red-300 text-xs">
            {error}
          </div>
        )}

        {tab === 'ddl' && (
          <div className="space-y-3">
            <textarea
              value={ddlText}
              onChange={(e) => setDdlText(e.target.value)}
              placeholder="CREATE TABLE users (&#10;  id BIGINT NOT NULL AUTO_INCREMENT,&#10;  name VARCHAR(255),&#10;  PRIMARY KEY (id)&#10;);"
              className="w-full h-48 bg-[#1A202C] border border-[#4A5568] text-white text-sm rounded-lg px-3 py-2 font-mono resize-none focus:border-[#4DB8B0] focus:ring-1 focus:ring-[#4DB8B0] outline-none"
            />
            <div
              className="border-2 border-dashed border-[#4A5568] rounded-lg p-4 text-center text-sm text-[#718096] cursor-pointer hover:border-[#4DB8B0] hover:text-[#A0AEC0] transition-colors"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              {t.dragPrompt} (.sql, .ddl, .txt)
              <input
                ref={fileRef}
                type="file"
                accept=".sql,.ddl,.txt"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              />
            </div>
          </div>
        )}

        {tab === 'json' && (
          <div
            className="border-2 border-dashed border-[#4A5568] rounded-lg p-8 text-center text-sm text-[#718096] cursor-pointer hover:border-[#4DB8B0] hover:text-[#A0AEC0] transition-colors"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {t.dragPrompt} (.tablespec.json)
            <input
              ref={fileRef}
              type="file"
              accept=".json,.tablespec.json"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            />
          </div>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[#A0AEC0] border border-[#4A5568] rounded-lg hover:bg-[#4A5568] hover:text-white transition-colors"
          >
            {t.cancel}
          </button>
          {tab === 'ddl' && (
            <button
              onClick={handleImportDDL}
              disabled={!ddlText.trim()}
              className="px-4 py-2 text-sm text-white bg-[#4DB8B0] rounded-lg hover:bg-[#45A89F] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {t.import_}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
