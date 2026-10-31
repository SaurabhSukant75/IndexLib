import React, { useState } from 'react';
import { ConceptNode, ConceptRelation } from '../../types';

interface ConceptGraphProps {
  concepts: ConceptNode[];
  relations: ConceptRelation[];
  selectedConceptId: string;
  onSelectConcept: (conceptId: string) => void;
}

const DEFAULT_POSITIONS = [
  { x: 110, y: 165, fill: "#d5ff58" },
  { x: 315, y: 78, fill: "#b9d7f6" },
  { x: 315, y: 252, fill: "#ffb99d" },
  { x: 535, y: 165, fill: "#ded7f5" },
  { x: 535, y: 275, fill: "#e7e3d4" }
];

export const ConceptGraph: React.FC<ConceptGraphProps> = ({
  concepts,
  relations,
  selectedConceptId,
  onSelectConcept,
}) => {
  const [hoveredConceptId, setHoveredConceptId] = useState<string | null>(null);

  const positionMap = new Map<string, { x: number; y: number; fill: string }>();
  concepts.forEach((concept, index) => {
    const pos = DEFAULT_POSITIONS[index % DEFAULT_POSITIONS.length];
    positionMap.set(concept.id, {
      x: concept.x || pos.x,
      y: concept.y || pos.y,
      fill: concept.fill || pos.fill,
    });
  });

  const activeId = hoveredConceptId || selectedConceptId;

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-line)',
        borderRadius: 'var(--radius-md)',
        padding: 20,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <svg
        viewBox="0 0 650 340"
        style={{ width: '100%', height: 'auto', maxHeight: 380, overflow: 'visible' }}
        role="group"
        aria-label="Interactive concept relationship graph"
      >
        <defs>
          <marker
            id="edge-arrow"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="3"
            orient="auto"
          >
            <path d="M0 0 L6 3 L0 6 Z" fill="#99998d" />
          </marker>
        </defs>

        {/* Directed Edges */}
        <g aria-hidden="true">
          {relations.map((rel, idx) => {
            const from = positionMap.get(rel.fromConceptId);
            const to = positionMap.get(rel.toConceptId);
            if (!from || !to) return null;

            const isConnected =
              !activeId ||
              rel.fromConceptId === activeId ||
              rel.toConceptId === activeId;

            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2 - 8;

            return (
              <g
                key={`rel-${idx}`}
                style={{
                  opacity: isConnected ? 1 : 0.25,
                  transition: 'opacity 0.2s ease',
                }}
              >
                <path
                  d={`M${from.x + 38} ${from.y} L${to.x - 45} ${to.y}`}
                  stroke={isConnected && activeId ? 'var(--color-ink)' : '#a29f95'}
                  strokeWidth={isConnected && activeId ? 2 : 1.5}
                  fill="none"
                  markerEnd="url(#edge-arrow)"
                />
                <text
                  x={midX}
                  y={midY}
                  textAnchor="middle"
                  style={{
                    fontSize: 11,
                    fill: isConnected ? 'var(--color-ink)' : 'var(--color-muted)',
                    fontWeight: 500,
                  }}
                >
                  {rel.type.replace(/_/g, ' ')}
                </text>
              </g>
            );
          })}
        </g>

        {/* Concept Nodes */}
        {concepts.map((concept, index) => {
          const pos = positionMap.get(concept.id);
          if (!pos) return null;
          const isSelected = selectedConceptId === concept.id;
          const isHovered = hoveredConceptId === concept.id;

          return (
            <g
              key={concept.id}
              role="button"
              tabIndex={0}
              aria-label={`Select ${concept.name}`}
              aria-pressed={isSelected}
              onClick={() => onSelectConcept(concept.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectConcept(concept.id);
                }
              }}
              onMouseEnter={() => setHoveredConceptId(concept.id)}
              onMouseLeave={() => setHoveredConceptId(null)}
              style={{
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r={index === 0 ? 44 : 41}
                fill={pos.fill}
                stroke={isSelected ? 'var(--color-ink)' : isHovered ? 'var(--color-ink)' : 'none'}
                strokeWidth={isSelected ? 3 : isHovered ? 2 : 0}
                style={{
                  transition: 'transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.18s ease',
                  transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                  transformOrigin: `${pos.x}px ${pos.y}px`,
                  filter: isHovered ? 'drop-shadow(0 4px 10px rgba(0,0,0,0.14))' : 'none',
                }}
              />
              <text
                x={pos.x}
                y={pos.y + 4}
                textAnchor="middle"
                style={{
                  fontSize: 13,
                  fontWeight: isSelected ? 700 : 600,
                  fill: 'var(--color-ink)',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >
                {concept.name}
              </text>
            </g>
          );
        })}
      </svg>
      <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', textAlign: 'center', marginTop: 12 }}>
        Select a concept node to view its definition, relationships, and linked visual books.
      </p>
    </div>
  );
};
