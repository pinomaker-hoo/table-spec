import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useERDBuilder } from '../context';
import { useLanguage } from '../../i18n/LanguageContext';
import DisplaySettingsPopover from './DisplaySettingsPopover';

interface Props {
  onImport: () => void;
  onExport: () => void;
}

export default function ERDBuilderHeader({ onImport, onExport }: Props) {
  const { state, dispatch } = useERDBuilder();
  const { lang, setLang, t } = useLanguage();
  const [showDisplaySettings, setShowDisplaySettings] = useState(false);

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  return (
    <header className="bg-[#2D3748] border-b border-[#4A5568] px-4 py-2 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src="/logo.png" alt="TableSpec" className="w-7 h-7 rounded" />
          <span className="text-sm font-bold text-white">TableSpec</span>
        </Link>
        <div className="w-px h-5 bg-[#4A5568]" />
        <span className="text-sm font-semibold text-[#4DB8B0]">{t.erdBuilder}</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Undo / Redo */}
        <button
          onClick={() => dispatch({ type: 'UNDO' })}
          disabled={!canUndo}
          className="px-2.5 py-1.5 text-xs text-[#A0AEC0] border border-[#4A5568] rounded hover:bg-[#4A5568] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title={`${t.undo} (Ctrl+Z)`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
        </button>
        <button
          onClick={() => dispatch({ type: 'REDO' })}
          disabled={!canRedo}
          className="px-2.5 py-1.5 text-xs text-[#A0AEC0] border border-[#4A5568] rounded hover:bg-[#4A5568] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title={`${t.redo} (Ctrl+Shift+Z)`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10" />
          </svg>
        </button>

        <div className="w-px h-5 bg-[#4A5568]" />

        {/* Display Settings */}
        <div className="relative">
          <button
            onClick={() => setShowDisplaySettings(!showDisplaySettings)}
            className={`px-2.5 py-1.5 text-xs border rounded transition-colors ${
              showDisplaySettings
                ? 'text-[#4DB8B0] border-[#4DB8B0] bg-[#4DB8B0]/10'
                : 'text-[#A0AEC0] border-[#4A5568] hover:bg-[#4A5568] hover:text-white'
            }`}
            title={t.displaySettings}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
              <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
            </svg>
          </button>
          {showDisplaySettings && (
            <DisplaySettingsPopover onClose={() => setShowDisplaySettings(false)} />
          )}
        </div>

        <div className="w-px h-5 bg-[#4A5568]" />

        {/* Import / Export */}
        <button
          onClick={onImport}
          className="px-3 py-1.5 text-xs text-[#A0AEC0] border border-[#4A5568] rounded hover:bg-[#4A5568] hover:text-white transition-colors"
        >
          {t.import_}
        </button>
        <button
          onClick={onExport}
          className="px-3 py-1.5 text-xs text-white bg-[#4DB8B0] rounded hover:bg-[#45A89F] transition-colors"
        >
          {t.export_}
        </button>

        <div className="w-px h-5 bg-[#4A5568]" />

        {/* Language Switcher */}
        <div className="flex items-center border border-[#4A5568] rounded overflow-hidden text-xs">
          <button
            onClick={() => setLang('en')}
            className={`px-2 py-1 transition-colors ${
              lang === 'en' ? 'bg-[#4DB8B0] text-white' : 'text-[#A0AEC0] hover:text-white hover:bg-[#4A5568]'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLang('ko')}
            className={`px-2 py-1 transition-colors ${
              lang === 'ko' ? 'bg-[#4DB8B0] text-white' : 'text-[#A0AEC0] hover:text-white hover:bg-[#4A5568]'
            }`}
          >
            KO
          </button>
        </div>
      </div>
    </header>
  );
}
