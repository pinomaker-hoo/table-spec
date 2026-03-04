import type { ERDLayout, TableBox, FKRelationship } from '../types/erd';
import { ERD_COLORS } from './erdColors';

const MAX_COLUMNS_SHOWN = 15;
const MAX_CANVAS_DIMENSION = 16384;

const FONTS = {
  tableHeader: 'bold 11px "SF Mono", Consolas, Monaco, monospace',
  columnName: '10px "SF Mono", Consolas, Monaco, monospace',
  columnType: '9px "SF Mono", Consolas, Monaco, monospace',
  badge: 'bold 7px "SF Mono", Consolas, Monaco, monospace',
  overflow: 'italic 9px "SF Mono", Consolas, Monaco, monospace',
  title: 'bold 20px -apple-system, "Segoe UI", sans-serif',
  subtitle: '13px -apple-system, "Segoe UI", sans-serif',
};

function truncateText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let truncated = text;
  while (truncated.length > 0 && ctx.measureText(truncated + '…').width > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return truncated + '…';
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawTableBox(ctx: CanvasRenderingContext2D, box: TableBox) {
  const { x, y, width, height, headerHeight, rowHeight, columns, totalColumns } = box;

  // Shadow
  ctx.shadowColor = 'rgba(0,0,0,0.08)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;

  // Background
  drawRoundedRect(ctx, x, y, width, height, 4);
  ctx.fillStyle = ERD_COLORS.normalRowBg;
  ctx.fill();

  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Header
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + 4, y);
  ctx.lineTo(x + width - 4, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + 4);
  ctx.lineTo(x + width, y + headerHeight);
  ctx.lineTo(x, y + headerHeight);
  ctx.lineTo(x, y + 4);
  ctx.quadraticCurveTo(x, y, x + 4, y);
  ctx.closePath();
  ctx.fillStyle = ERD_COLORS.headerBg;
  ctx.fill();
  ctx.restore();

  // Header text
  ctx.font = FONTS.tableHeader;
  ctx.fillStyle = ERD_COLORS.headerText;
  ctx.textBaseline = 'middle';
  const headerText = truncateText(ctx, box.tableName, width - 12);
  ctx.fillText(headerText, x + 6, y + headerHeight / 2);

  // Column rows
  const bodyY = y + headerHeight;
  for (let i = 0; i < columns.length; i++) {
    const col = columns[i];
    const rowY = bodyY + i * rowHeight;

    // Row background
    if (col.isPrimaryKey) {
      ctx.fillStyle = ERD_COLORS.pkRowBg;
    } else if (col.isForeignKey) {
      ctx.fillStyle = ERD_COLORS.fkRowBg;
    } else {
      ctx.fillStyle = i % 2 === 0 ? ERD_COLORS.normalRowBg : ERD_COLORS.alternateRowBg;
    }
    ctx.fillRect(x + 1, rowY, width - 2, rowHeight);

    // Badge
    let badgeWidth = 0;
    if (col.isPrimaryKey || col.isForeignKey) {
      const label = col.isPrimaryKey ? 'PK' : 'FK';
      const bgColor = col.isPrimaryKey ? ERD_COLORS.pkBadgeBg : ERD_COLORS.fkBadgeBg;
      const textColor = col.isPrimaryKey ? ERD_COLORS.pkBadgeText : ERD_COLORS.fkBadgeText;

      ctx.font = FONTS.badge;
      const bw = ctx.measureText(label).width + 6;
      const bh = 11;
      const bx = x + 4;
      const by = rowY + (rowHeight - bh) / 2;

      drawRoundedRect(ctx, bx, by, bw, bh, 2);
      ctx.fillStyle = bgColor;
      ctx.fill();

      ctx.fillStyle = textColor;
      ctx.textBaseline = 'middle';
      ctx.fillText(label, bx + 3, rowY + rowHeight / 2);
      badgeWidth = bw + 4;
    }

    // Column name
    ctx.font = FONTS.columnName;
    ctx.fillStyle = ERD_COLORS.columnName;
    ctx.textBaseline = 'middle';
    const nameX = x + 4 + badgeWidth;
    const typeWidth = 65;
    const nameMaxWidth = width - 8 - badgeWidth - typeWidth;
    const colName = truncateText(ctx, col.name, nameMaxWidth);
    ctx.fillText(colName, nameX, rowY + rowHeight / 2);

    // Data type (right-aligned)
    ctx.font = FONTS.columnType;
    ctx.fillStyle = ERD_COLORS.columnType;
    const typeText = truncateText(ctx, col.dataType, typeWidth - 4);
    const typeMetrics = ctx.measureText(typeText);
    ctx.fillText(typeText, x + width - 4 - typeMetrics.width, rowY + rowHeight / 2);
  }

  // Overflow indicator
  if (totalColumns > MAX_COLUMNS_SHOWN) {
    const overflowY = bodyY + columns.length * rowHeight;
    ctx.fillStyle = ERD_COLORS.alternateRowBg;
    ctx.fillRect(x + 1, overflowY, width - 2, rowHeight);
    ctx.font = FONTS.overflow;
    ctx.fillStyle = ERD_COLORS.overflowText;
    ctx.textBaseline = 'middle';
    ctx.fillText(`... +${totalColumns - MAX_COLUMNS_SHOWN} more`, x + 6, overflowY + rowHeight / 2);
  }

  // Border
  drawRoundedRect(ctx, x, y, width, height, 4);
  ctx.strokeStyle = ERD_COLORS.borderColor;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function getColumnAnchor(
  box: TableBox, columnName: string, side: 'left' | 'right'
): { x: number; y: number } {
  const colIndex = box.columns.findIndex((c) => c.name === columnName);
  const xPos = side === 'left' ? box.x : box.x + box.width;

  if (colIndex === -1 || colIndex >= MAX_COLUMNS_SHOWN) {
    return { x: xPos, y: box.y + box.height - box.rowHeight / 2 };
  }
  return {
    x: xPos,
    y: box.y + box.headerHeight + colIndex * box.rowHeight + box.rowHeight / 2,
  };
}

function drawArrowhead(ctx: CanvasRenderingContext2D, from: { x: number; y: number }, to: { x: number; y: number }, size: number) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  ctx.beginPath();
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(to.x - size * Math.cos(angle - Math.PI / 6), to.y - size * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(to.x - size * Math.cos(angle + Math.PI / 6), to.y - size * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
}

function drawFKLine(
  ctx: CanvasRenderingContext2D,
  layout: ERDLayout,
  rel: FKRelationship
) {
  const fromBox = layout.tableBoxes.get(rel.fromTable);
  const toBox = layout.tableBoxes.get(rel.toTable);
  if (!fromBox || !toBox) return;

  // Self-referencing
  if (rel.fromTable === rel.toTable) {
    const fromAnchor = getColumnAnchor(fromBox, rel.fromColumn, 'right');
    const toAnchor = getColumnAnchor(fromBox, rel.toColumn, 'right');
    const loopOffset = 25;

    ctx.beginPath();
    ctx.moveTo(fromAnchor.x, fromAnchor.y);
    ctx.bezierCurveTo(
      fromAnchor.x + loopOffset, fromAnchor.y,
      toAnchor.x + loopOffset, toAnchor.y,
      toAnchor.x, toAnchor.y
    );
    ctx.strokeStyle = ERD_COLORS.fkLineColor;
    ctx.lineWidth = 0.8;
    ctx.globalAlpha = 0.5;
    ctx.stroke();
    ctx.globalAlpha = 1.0;
    return;
  }

  const fromCenterX = fromBox.x + fromBox.width / 2;
  const toCenterX = toBox.x + toBox.width / 2;
  const fromSide: 'left' | 'right' = fromCenterX < toCenterX ? 'right' : 'left';
  const toSide: 'left' | 'right' = fromCenterX < toCenterX ? 'left' : 'right';

  const from = getColumnAnchor(fromBox, rel.fromColumn, fromSide);
  const to = getColumnAnchor(toBox, rel.toColumn, toSide);

  const cpOffset = Math.min(Math.abs(to.x - from.x) * 0.4, 80);
  const cp1x = fromSide === 'right' ? from.x + cpOffset : from.x - cpOffset;
  const cp2x = toSide === 'left' ? to.x - cpOffset : to.x + cpOffset;

  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.bezierCurveTo(cp1x, from.y, cp2x, to.y, to.x, to.y);
  ctx.strokeStyle = ERD_COLORS.fkLineColor;
  ctx.lineWidth = 0.8;
  ctx.globalAlpha = 0.5;
  ctx.stroke();
  ctx.globalAlpha = 1.0;

  // Arrowhead
  ctx.fillStyle = ERD_COLORS.fkLineColor;
  ctx.globalAlpha = 0.5;
  drawArrowhead(ctx, { x: cp2x, y: to.y }, to, 5);
  ctx.globalAlpha = 1.0;
}

export function renderERDToCanvas(layout: ERDLayout, dpiScale = 3): HTMLCanvasElement {
  const scale = Math.min(
    dpiScale,
    Math.floor(MAX_CANVAS_DIMENSION / layout.canvasWidth),
    Math.floor(MAX_CANVAS_DIMENSION / layout.canvasHeight)
  );
  const effectiveScale = Math.max(1, scale);

  const canvas = document.createElement('canvas');
  canvas.width = layout.canvasWidth * effectiveScale;
  canvas.height = layout.canvasHeight * effectiveScale;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  ctx.scale(effectiveScale, effectiveScale);

  // Background
  ctx.fillStyle = ERD_COLORS.background;
  ctx.fillRect(0, 0, layout.canvasWidth, layout.canvasHeight);

  // Title
  const tableCount = layout.tableBoxes.size;
  const relCount = layout.relationships.length;
  ctx.font = FONTS.title;
  ctx.fillStyle = ERD_COLORS.titleText;
  ctx.textBaseline = 'top';
  ctx.fillText('ERD Diagram', 80, 25);

  ctx.font = FONTS.subtitle;
  ctx.fillStyle = ERD_COLORS.subtitleText;
  ctx.fillText(`${tableCount} Tables, ${relCount} Relationships`, 80, 50);

  // FK lines (draw behind tables)
  for (const rel of layout.relationships) {
    drawFKLine(ctx, layout, rel);
  }

  // Table boxes (draw on top)
  for (const box of layout.tableBoxes.values()) {
    drawTableBox(ctx, box);
  }

  return canvas;
}
