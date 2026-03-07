import { useState } from 'react';
import { useERDBuilder } from '../context';
import { useLanguage } from '../../i18n/LanguageContext';
import { serializeProject } from '../utils/projectSerializer';
import { generateDDL } from '../utils/ddlGenerator';
import { builderToLayout } from '../utils/builderToLayout';
import { builderToParsedTables } from '../utils/builderToParsedTables';
import { renderERDToCanvas } from '../../erd/erdRenderer';
import { generateAndDownloadExcel } from '../../excel/excelGenerator';

interface Props {
  onClose: () => void;
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function ExportModal({ onClose }: Props) {
  const { state } = useERDBuilder();
  const { t } = useLanguage();
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExportJSON = () => {
    const json = serializeProject(state.tables, state.relationships);
    downloadFile(json, 'erd_project.tablespec.json', 'application/json');
    onClose();
  };

  const handleExportDDL = () => {
    const sql = generateDDL(state.tables, state.relationships);
    downloadFile(sql, 'schema.sql', 'text/sql');
    onClose();
  };

  const handleExportPNG = async () => {
    setExporting('png');
    try {
      const layout = builderToLayout(state.tables, state.relationships);
      const canvas = renderERDToCanvas(layout, 3);
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error('Failed to create image'))),
          'image/png',
          1.0
        );
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'erd_diagram.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onClose();
    } catch {
      // silently fail
    } finally {
      setExporting(null);
    }
  };

  const handleExportExcel = () => {
    setExporting('excel');
    try {
      const parsed = builderToParsedTables(state.tables, state.relationships);
      generateAndDownloadExcel(parsed);
      onClose();
    } catch {
      // silently fail
    } finally {
      setExporting(null);
    }
  };

  const disabled = state.tables.length === 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-[#2D3748] border border-[#4A5568] rounded-xl p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-white mb-4">{t.export_}</h2>

        {disabled && (
          <p className="text-sm text-[#718096] mb-4">{t.noTablesYet}</p>
        )}

        <div className="grid grid-cols-2 gap-3">
          {/* Project JSON */}
          <button
            onClick={handleExportJSON}
            disabled={disabled}
            className="p-4 bg-[#1A202C] border border-[#4A5568] rounded-lg text-left hover:border-[#4DB8B0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors group"
          >
            <div className="text-sm font-medium text-[#E2E8F0] group-hover:text-[#4DB8B0] transition-colors">
              {t.exportProject}
            </div>
            <div className="text-[10px] text-[#718096] mt-1">.tablespec.json</div>
          </button>

          {/* DDL SQL */}
          <button
            onClick={handleExportDDL}
            disabled={disabled}
            className="p-4 bg-[#1A202C] border border-[#4A5568] rounded-lg text-left hover:border-[#4DB8B0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors group"
          >
            <div className="text-sm font-medium text-[#E2E8F0] group-hover:text-[#4DB8B0] transition-colors">
              {t.exportDDL}
            </div>
            <div className="text-[10px] text-[#718096] mt-1">.sql</div>
          </button>

          {/* PNG */}
          <button
            onClick={handleExportPNG}
            disabled={disabled || exporting === 'png'}
            className="p-4 bg-[#1A202C] border border-[#4A5568] rounded-lg text-left hover:border-[#4DB8B0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors group"
          >
            <div className="text-sm font-medium text-[#E2E8F0] group-hover:text-[#4DB8B0] transition-colors">
              {exporting === 'png' ? '...' : t.exportPNG}
            </div>
            <div className="text-[10px] text-[#718096] mt-1">.png</div>
          </button>

          {/* Excel */}
          <button
            onClick={handleExportExcel}
            disabled={disabled || exporting === 'excel'}
            className="p-4 bg-[#1A202C] border border-[#4A5568] rounded-lg text-left hover:border-[#4DB8B0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors group"
          >
            <div className="text-sm font-medium text-[#E2E8F0] group-hover:text-[#4DB8B0] transition-colors">
              {exporting === 'excel' ? '...' : t.exportExcel}
            </div>
            <div className="text-[10px] text-[#718096] mt-1">.xlsx</div>
          </button>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[#A0AEC0] border border-[#4A5568] rounded-lg hover:bg-[#4A5568] hover:text-white transition-colors"
          >
            {t.cancel}
          </button>
        </div>
      </div>
    </div>
  );
}
