import type { ParsedTable } from '../types/ddl';
import { computeERDLayout } from './erdLayout';
import { renderERDToCanvas } from './erdRenderer';

export async function generateAndDownloadERD(
  tables: ParsedTable[],
  filename = 'erd_diagram.png'
): Promise<void> {
  const layout = computeERDLayout(tables);
  const canvas = renderERDToCanvas(layout);

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
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
