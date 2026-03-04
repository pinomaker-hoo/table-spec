import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import type { ParsedTable } from '../types/ddl';
import { computeERDLayout } from '../erd/erdLayout';
import { renderERDToCanvas } from '../erd/erdRenderer';
import { generateAndDownloadERD } from '../erd/erdGenerator';

interface ERDPreviewProps {
  tables: ParsedTable[];
}

export default function ERDPreview({ tables }: ERDPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(0.15);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [downloading, setDownloading] = useState(false);

  const layout = useMemo(() => computeERDLayout(tables), [tables]);

  // Render ERD to offscreen canvas once
  const erdCanvas = useMemo(() => renderERDToCanvas(layout, 1), [layout]);

  // Draw to visible canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Dark background
    ctx.fillStyle = '#1A202C';
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);
    ctx.drawImage(erdCanvas, 0, 0);
    ctx.restore();
  }, [erdCanvas, zoom, pan]);

  // Resize observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => {
      // trigger re-render by updating pan slightly
      setPan((p) => ({ ...p }));
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((z) => Math.min(2, Math.max(0.02, z * delta)));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  }, [dragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  const handleFitToScreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const scaleX = (rect.width - 40) / layout.canvasWidth;
    const scaleY = (rect.height - 40) / layout.canvasHeight;
    const fitZoom = Math.min(scaleX, scaleY);
    setZoom(fitZoom);
    setPan({ x: 20, y: 20 });
  }, [layout]);

  // Fit to screen on first render
  useEffect(() => {
    handleFitToScreen();
  }, [handleFitToScreen]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await generateAndDownloadERD(tables);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="border border-[#4A5568] rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#2D3748] border-b border-[#4A5568]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#E2E8F0]">ERD Diagram</span>
          <span className="text-xs text-[#718096]">
            {tables.length} Tables, {layout.relationships.length} Relationships
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.min(2, z * 1.3))}
            className="px-2 py-1 text-xs text-[#A0AEC0] bg-[#1A202C] border border-[#4A5568] rounded hover:bg-[#4A5568] hover:text-white transition-colors"
          >
            +
          </button>
          <span className="text-xs text-[#718096] w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom((z) => Math.max(0.02, z * 0.7))}
            className="px-2 py-1 text-xs text-[#A0AEC0] bg-[#1A202C] border border-[#4A5568] rounded hover:bg-[#4A5568] hover:text-white transition-colors"
          >
            -
          </button>
          <button
            onClick={handleFitToScreen}
            className="px-2 py-1 text-xs text-[#A0AEC0] bg-[#1A202C] border border-[#4A5568] rounded hover:bg-[#4A5568] hover:text-white transition-colors"
          >
            Fit
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="px-3 py-1 text-xs bg-[#4DB8B0] text-white rounded hover:bg-[#45A89F] disabled:bg-[#4DB8B0]/50 transition-colors"
          >
            {downloading ? '...' : 'PNG'}
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div
        ref={containerRef}
        className="relative"
        style={{ height: '600px', cursor: dragging ? 'grabbing' : 'grab' }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas ref={canvasRef} className="absolute inset-0" />
      </div>
    </div>
  );
}
