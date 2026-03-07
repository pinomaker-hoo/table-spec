import { useCallback } from 'react';
import type { BuilderTable, BuilderRelationship, NodeDisplayOptions } from '../types';
import { useERDBuilder } from '../context';
import { getColumnAnchor } from './ERDBuilderRelationshipLayer';
import { computeNodeWidth } from './ERDBuilderTableNode';

interface Props {
  relationship: BuilderRelationship;
  fromTable: BuilderTable;
  toTable: BuilderTable;
  isSelected: boolean;
  displayOptions: NodeDisplayOptions;
}

export default function ERDBuilderRelationshipLine({ relationship, fromTable, toTable, isSelected, displayOptions }: Props) {
  const { dispatch } = useERDBuilder();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch({ type: 'SELECT_RELATIONSHIP', payload: { relationshipId: relationship.id } });
    },
    [relationship.id, dispatch]
  );

  // Self-referencing
  if (relationship.fromTableId === relationship.toTableId) {
    const from = getColumnAnchor(fromTable, relationship.fromColumnId, 'right', displayOptions);
    const to = getColumnAnchor(fromTable, relationship.toColumnId, 'right', displayOptions);
    const loopOffset = 30;
    const d = `M ${from.x} ${from.y} C ${from.x + loopOffset} ${from.y}, ${to.x + loopOffset} ${to.y}, ${to.x} ${to.y}`;

    return (
      <g>
        {/* Hit area */}
        <path
          d={d}
          fill="none"
          stroke="transparent"
          strokeWidth="12"
          className="pointer-events-stroke cursor-pointer"
          onClick={handleClick}
        />
        <path
          d={d}
          fill="none"
          stroke={isSelected ? '#4DB8B0' : '#94A3B8'}
          strokeWidth={isSelected ? 1.5 : 1}
          opacity={isSelected ? 1 : 0.6}
          markerEnd={isSelected ? 'url(#arrowhead-selected)' : 'url(#arrowhead)'}
        />
      </g>
    );
  }

  const nodeWidth = computeNodeWidth(displayOptions);
  const fromCenterX = fromTable.x + nodeWidth / 2;
  const toCenterX = toTable.x + nodeWidth / 2;
  const fromSide: 'left' | 'right' = fromCenterX < toCenterX ? 'right' : 'left';
  const toSide: 'left' | 'right' = fromCenterX < toCenterX ? 'left' : 'right';

  const from = getColumnAnchor(fromTable, relationship.fromColumnId, fromSide, displayOptions);
  const to = getColumnAnchor(toTable, relationship.toColumnId, toSide, displayOptions);

  const cpOffset = Math.min(Math.abs(to.x - from.x) * 0.4, 80);
  const cp1x = fromSide === 'right' ? from.x + cpOffset : from.x - cpOffset;
  const cp2x = toSide === 'left' ? to.x - cpOffset : to.x + cpOffset;

  const d = `M ${from.x} ${from.y} C ${cp1x} ${from.y}, ${cp2x} ${to.y}, ${to.x} ${to.y}`;

  return (
    <g>
      {/* Wide transparent hit area for easier clicking */}
      <path
        d={d}
        fill="none"
        stroke="transparent"
        strokeWidth="12"
        className="pointer-events-stroke cursor-pointer"
        onClick={handleClick}
      />
      {/* Visible line */}
      <path
        d={d}
        fill="none"
        stroke={isSelected ? '#4DB8B0' : '#94A3B8'}
        strokeWidth={isSelected ? 1.5 : 1}
        opacity={isSelected ? 1 : 0.6}
        markerEnd={isSelected ? 'url(#arrowhead-selected)' : 'url(#arrowhead)'}
      />
    </g>
  );
}
