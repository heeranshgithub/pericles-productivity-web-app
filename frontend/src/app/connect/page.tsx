'use client';

import { useState, useMemo, type ReactNode } from 'react';
import { X, MessageSquare, Users, Zap } from 'lucide-react';

import connectionData from './data.json';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Person {
  person_name: string;
  last_interaction_timestamp: string;
  recency_days: number;
  interaction_count_30d: number;
  activity_heat: number;
  relationship_strength_score: number;
  trust_level: string;
  emotional_closeness: string;
  primary_relationship_type: string;
  relationship_layers: string[];
  professional_vs_personal: string;
  formation_context: string;
  recent_topics: string[];
  dominant_conversation_theme: string;
  inference_confidence: string;
}

const people = connectionData as Person[];

// ─── Layout constants ─────────────────────────────────────────────────────────

const CX = 340;
const CY = 350;
// Three concentric rings; closest contacts are innermost
const RING_RADII = [135, 225, 305] as const;
const RING_LABELS = ['INNER CIRCLE', 'CLOSE CIRCLE', 'ORBIT'] as const;

// ─── Utility functions ────────────────────────────────────────────────────────

const MAX_MSGS = Math.max(...people.map(p => p.interaction_count_30d));

function getNodeRadius(msgCount: number): number {
  return 12 + Math.round((msgCount / MAX_MSGS) * 16);
}

function typeColor(type: string): string {
  if (type === 'family') return '#10b981';
  if (type === 'colleague') return '#f59e0b';
  return '#14b8a6';
}

function levelPct(level: string): number {
  if (level === 'high') return 100;
  if (level === 'medium') return 60;
  return 30;
}

function formatContext(ctx: string): string {
  const labels: Record<string, string> = {
    unknown: '—',
    family: 'FAMILY',
    school: 'SCHOOL / COLLEGE',
    worked_together: 'WORKED TOGETHER',
  };
  return labels[ctx] ?? ctx.replace(/_/g, ' ').toUpperCase();
}

function computePositions(
  persons: Person[]
): Map<string, { x: number; y: number; ring: number }> {
  const sorted = [...persons].sort(
    (a, b) => b.relationship_strength_score - a.relationship_strength_score
  );
  // Top 3 → ring 0, next 5 → ring 1, remaining → ring 2
  const rings: Person[][] = [
    sorted.slice(0, 3),
    sorted.slice(3, 8),
    sorted.slice(8),
  ];
  const map = new Map<string, { x: number; y: number; ring: number }>();
  rings.forEach((group, ri) => {
    const r = RING_RADII[ri];
    group.forEach((p, i) => {
      const angle = (2 * Math.PI * i) / group.length - Math.PI / 2;
      map.set(p.person_name, {
        x: CX + r * Math.cos(angle),
        y: CY + r * Math.sin(angle),
        ring: ri,
      });
    });
  });
  return map;
}

// ─── Animation styles ─────────────────────────────────────────────────────────

function Styles() {
  return (
    <style>{`
      @keyframes nodeAppear {
        from { opacity: 0; transform: translateY(6px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes connAppear {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      @keyframes centerAura {
        0%,100% { opacity: 0.75; }
        50%     { opacity: 0.35; }
      }
      @keyframes centerRing {
        0%,100% { stroke-opacity: 0.22; }
        50%     { stroke-opacity: 0.55; }
      }
      @keyframes dashTravel {
        from { stroke-dashoffset: 0; }
        to   { stroke-dashoffset: -32; }
      }
      @keyframes panelIn {
        from { opacity: 0; transform: translateX(16px); }
        to   { opacity: 1; transform: translateX(0); }
      }
      @keyframes haloIn {
        from { opacity: 0; transform: scale(0.6); }
        to   { opacity: 1; transform: scale(1); }
      }
      .node-group  { animation: nodeAppear 0.55s cubic-bezier(0.16,1,0.3,1) both; }
      .conn-line   { animation: connAppear 1s ease-out both; }
      .center-aura { animation: centerAura 4s ease-in-out infinite; }
      .center-ring { animation: centerRing 3s ease-in-out infinite; }
      .node-halo   { animation: haloIn 0.2s ease-out both; }
      .panel-in    { animation: panelIn 0.3s cubic-bezier(0.16,1,0.3,1) both; }
      .conn-selected { animation: dashTravel 2s linear infinite; }
    `}</style>
  );
}

// ─── Shared small components ──────────────────────────────────────────────────

function HeaderStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-col items-end gap-0.5">
      <div className="flex items-center gap-1.5 text-white/30 text-[10px] tracking-[0.18em] uppercase">
        {icon}
        <span>{label}</span>
      </div>
      <span className="text-base font-bold tabular-nums">{value}</span>
    </div>
  );
}

function ScoreBar({
  value,
  color = '#14b8a6',
}: {
  value: number;
  color?: string;
}) {
  return (
    <div className="relative h-[4px] bg-white/[0.06] rounded-full overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
        style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color }}
      />
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  const color = typeColor(type);
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold tracking-[0.12em] uppercase rounded border"
      style={{
        color,
        borderColor: `${color}50`,
        backgroundColor: `${color}12`,
      }}
    >
      {type}
    </span>
  );
}

function MetricRow({
  label,
  value,
  pct,
  color,
}: {
  label: string;
  value: string;
  pct: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[9px] tracking-[0.15em] text-white/30 uppercase">
          {label}
        </span>
        <span className="text-[9px] font-bold tracking-wide" style={{ color }}>
          {value}
        </span>
      </div>
      <ScoreBar value={pct} color={color} />
    </div>
  );
}

// ─── Orbital SVG map ──────────────────────────────────────────────────────────

interface OrbitalMapProps {
  people: Person[];
  positions: Map<string, { x: number; y: number; ring: number }>;
  selected: Person | null;
  onSelect: (p: Person) => void;
}

function OrbitalMap({
  people: persons,
  positions,
  selected,
  onSelect,
}: OrbitalMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <svg
      viewBox="0 0 660 680"
      className="w-full max-w-[560px]"
      style={{ overflow: 'visible' }}
      role="img"
      aria-label="Relationship orbit map"
    >
      <defs>
        <filter id="glow-sm" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="aura-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Radial aura behind center */}
      <circle
        cx={CX}
        cy={CY}
        r={75}
        fill="url(#aura-grad)"
        className="center-aura"
      />

      {/* Orbital rings */}
      {RING_RADII.map((r, i) => (
        <circle
          key={r}
          cx={CX}
          cy={CY}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1"
          strokeDasharray={i === 0 ? undefined : i === 1 ? '5 12' : '2 9'}
        />
      ))}

      {/* Connection lines from center to each node */}
      {persons.map((p, idx) => {
        const pos = positions.get(p.person_name);
        if (!pos) return null;
        const isSelected = selected?.person_name === p.person_name;
        const isHovered = hovered === p.person_name;
        const color = typeColor(p.primary_relationship_type);
        return (
          <line
            key={`ln-${p.person_name}`}
            x1={CX}
            y1={CY}
            x2={pos.x}
            y2={pos.y}
            stroke={color}
            strokeWidth={isSelected ? 1.5 : isHovered ? 1 : 0.6}
            strokeOpacity={isSelected ? 0.8 : isHovered ? 0.4 : 0.1}
            strokeDasharray={isSelected ? '6 10' : '3 8'}
            className={isSelected ? 'conn-selected' : 'conn-line'}
            style={{ animationDelay: `${idx * 55}ms` }}
          />
        );
      })}

      {/* Person nodes */}
      {persons.map((p, idx) => {
        const pos = positions.get(p.person_name);
        if (!pos) return null;
        const r = getNodeRadius(p.interaction_count_30d);
        const color = typeColor(p.primary_relationship_type);
        const isSelected = selected?.person_name === p.person_name;
        const isHovered = hovered === p.person_name;
        const isActive = isSelected || isHovered;

        return (
          <g
            key={p.person_name}
            className="node-group"
            style={{ animationDelay: `${180 + idx * 80}ms`, cursor: 'pointer' }}
            onClick={() => onSelect(p)}
            onMouseEnter={() => setHovered(p.person_name)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Outer glow halo on active */}
            {isActive && (
              <circle
                cx={pos.x}
                cy={pos.y}
                r={r + 13}
                fill={color}
                fillOpacity={0.13}
                className="node-halo"
              />
            )}

            {/* Outer orbit ring */}
            <circle
              cx={pos.x}
              cy={pos.y}
              r={r + 5}
              fill="none"
              stroke={color}
              strokeWidth="0.75"
              strokeOpacity={isActive ? 0.5 : 0.14}
            />

            {/* Main filled node */}
            <circle
              cx={pos.x}
              cy={pos.y}
              r={r}
              fill={isActive ? color : '#0c0c0c'}
              stroke={color}
              strokeWidth={isSelected ? 2 : 1.5}
              filter={isActive ? 'url(#glow-sm)' : undefined}
            />

            {/* Score inside node */}
            <text
              x={pos.x}
              y={pos.y + 0.5}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={isActive ? '#000' : color}
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
            >
              {Math.round(p.relationship_strength_score * 100)}
            </text>

            {/* Name label below node */}
            <text
              x={pos.x}
              y={pos.y + r + 15}
              textAnchor="middle"
              fill={isActive ? '#ffffff' : 'rgba(255,255,255,0.38)'}
              fontSize="11"
              fontFamily="monospace"
              fontWeight={isActive ? 'bold' : 'normal'}
              letterSpacing="1.4"
            >
              {p.person_name.toUpperCase()}
            </text>
          </g>
        );
      })}

      {/* YOU — center node */}
      <g>
        <circle
          cx={CX}
          cy={CY}
          r={37}
          fill="none"
          stroke="#14b8a6"
          strokeWidth="0.75"
          strokeOpacity="0.2"
          className="center-ring"
        />
        <circle
          cx={CX}
          cy={CY}
          r={28}
          fill="#080808"
          stroke="#14b8a6"
          strokeWidth="1.5"
          filter="url(#glow-sm)"
        />
        <text
          x={CX}
          y={CY}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#14b8a6"
          fontSize="11"
          fontFamily="monospace"
          fontWeight="bold"
          letterSpacing="1.5"
        >
          YOU
        </text>
      </g>

      {/* Ring distance labels (drawn last so they stay visible) */}
      {RING_LABELS.map((label, i) => {
        const angle = -0.7; // top-right quadrant, avoids the vertical node stack
        const lx = CX + (RING_RADII[i] + 8) * Math.cos(angle);
        const ly = CY + (RING_RADII[i] + 8) * Math.sin(angle);
        return (
          <text
            key={label}
            x={lx}
            y={ly}
            textAnchor="middle"
            fill="rgba(255,255,255,0.18)"
            fontSize="9"
            fontFamily="monospace"
            letterSpacing="1.4"
            stroke="#060606"
            strokeWidth="2"
            paintOrder="stroke"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

// ─── Detail panel (selected person) ──────────────────────────────────────────

function DetailPanel({
  person,
  onClose,
}: {
  person: Person;
  onClose: () => void;
}) {
  const color = typeColor(person.primary_relationship_type);

  return (
    <div className="flex flex-col h-full panel-in">
      {/* Header row */}
      <div className="flex items-start justify-between p-5 border-b border-white/[0.06] flex-shrink-0">
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            {person.person_name.toUpperCase()}
          </h2>
          <div className="flex items-center gap-1.5 mt-1.5">
            {person.relationship_layers.map(l => (
              <TypeBadge key={l} type={l} />
            ))}
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 flex items-center justify-center h-7 w-7 rounded border border-white/10 hover:border-white/25 hover:bg-white/5 transition-colors duration-150 text-white/40 hover:text-white ml-3 mt-0.5"
          aria-label="Close"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-[13px]">
        {/* Strength score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] tracking-[0.2em] text-white/40 uppercase">
              Relationship Strength
            </span>
            <span
              className="font-bold tabular-nums text-base"
              style={{ color }}
            >
              {Math.round(person.relationship_strength_score * 100)}
            </span>
          </div>
          <ScoreBar
            value={Math.round(person.relationship_strength_score * 100)}
            color={color}
          />
        </div>

        {/* Trust, emotional, confidence */}
        <div className="space-y-3">
          <MetricRow
            label="Trust Level"
            value={person.trust_level.toUpperCase()}
            pct={levelPct(person.trust_level)}
            color={color}
          />
          <MetricRow
            label="Emotional Closeness"
            value={person.emotional_closeness.toUpperCase()}
            pct={levelPct(person.emotional_closeness)}
            color={color}
          />
          <MetricRow
            label="Inference Confidence"
            value={person.inference_confidence.toUpperCase()}
            pct={levelPct(person.inference_confidence)}
            color="rgba(255,255,255,0.35)"
          />
        </div>

        <div className="h-px bg-white/[0.05]" />

        {/* Activity stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="border border-white/[0.06] p-3 rounded-lg">
            <div className="text-[10px] tracking-[0.16em] text-white/30 uppercase mb-1">
              Msgs / 30d
            </div>
            <div className="text-xl font-bold tabular-nums">
              {person.interaction_count_30d}
            </div>
          </div>
          <div className="border border-white/[0.06] p-3 rounded-lg">
            <div className="text-[10px] tracking-[0.16em] text-white/30 uppercase mb-1">
              Last Seen
            </div>
            <div className="text-xl font-bold tabular-nums">
              {person.recency_days}
              <span className="text-xs font-normal text-white/30 ml-1">
                d ago
              </span>
            </div>
          </div>
        </div>

        <div className="h-px bg-white/[0.05]" />

        {/* Context */}
        <div>
          <div className="text-[10px] tracking-[0.2em] text-white/40 uppercase mb-2">
            Context
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-white/50">
            <span>{person.professional_vs_personal.toUpperCase()}</span>
            <span className="text-white/20">·</span>
            <span>FORMED VIA {formatContext(person.formation_context)}</span>
          </div>
        </div>

        {/* Dominant theme */}
        <div>
          <div className="text-[10px] tracking-[0.2em] text-white/40 uppercase mb-2">
            Dominant Theme
          </div>
          <p className="text-white/65 leading-relaxed capitalize">
            {person.dominant_conversation_theme}
          </p>
        </div>

        <div className="h-px bg-white/[0.05]" />

        {/* Recent topics */}
        <div>
          <div className="text-[10px] tracking-[0.2em] text-white/40 uppercase mb-2.5">
            Recent Topics
          </div>
          <div className="space-y-2">
            {person.recent_topics.map(topic => (
              <div key={topic} className="flex items-start gap-2">
                <div
                  className="mt-1.5 h-1 w-1 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-white/55 leading-relaxed capitalize">
                  {topic}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Leaderboard (left rail) ──────────────────────────────────────────────────

function Leaderboard({
  people: persons,
  selected,
  onSelect,
}: {
  people: Person[];
  selected: Person | null;
  onSelect: (p: Person) => void;
}) {
  const ranked = useMemo(
    () =>
      [...persons].sort(
        (a, b) => b.relationship_strength_score - a.relationship_strength_score
      ),
    [persons]
  );

  return (
    <div className="hidden lg:flex flex-col w-[260px] flex-shrink-0 border-r border-white/[0.06] px-4 py-5 gap-4 overflow-y-auto text-[13px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div>
        <h2 className="text-[11px] font-bold tracking-[0.22em] text-white/35 uppercase">
          Leaderboard
        </h2>
        <p className="text-[10px] text-white/18 mt-1">
          Ranked by relationship strength.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        {ranked.slice(0, 9).map((person, index) => {
          const color = typeColor(person.primary_relationship_type);
          const score = Math.round(person.relationship_strength_score * 100);
          const isSelected = selected?.person_name === person.person_name;

          return (
            <button
              key={person.person_name}
              type="button"
              onClick={() => onSelect(person)}
              className={`w-full flex items-center justify-between gap-3 px-2.5 py-2 text-left border border-transparent transition-colors duration-150 ${
                isSelected
                  ? 'bg-white/[0.08] border-white/[0.18]'
                  : 'hover:bg-white/[0.04] border-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="text-[11px] font-bold tabular-nums text-white/40 w-6">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] font-semibold truncate">
                      {person.person_name}
                    </span>
                    <span
                      className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-white/35 tracking-[0.12em] uppercase">
                      {person.primary_relationship_type}
                    </span>
                    <span className="text-[10px] text-white/25">·</span>
                    <span className="text-[10px] text-white/35 tabular-nums">
                      {person.interaction_count_30d} msgs
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-0.5 flex-shrink-0 w-16">
                <span className="text-[10px] text-white/35 tracking-[0.12em] uppercase">
                  {score}
                </span>
                <ScoreBar value={score} color={color} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Overview panel (no selection) ───────────────────────────────────────────

function OverviewPanel({ people: persons }: { people: Person[] }) {
  const typeCount = useMemo(() => {
    const counts: Record<string, number> = {};
    persons.forEach(p => {
      counts[p.primary_relationship_type] =
        (counts[p.primary_relationship_type] ?? 0) + 1;
    });
    return Object.entries(counts).sort(([, a], [, b]) => b - a);
  }, [persons]);

  const avgStrength = (
    persons.reduce((s, p) => s + p.relationship_strength_score, 0) /
    persons.length
  ).toFixed(2);
  const totalMsgs = persons.reduce((s, p) => s + p.interaction_count_30d, 0);
  const highTrust = persons.filter(p => p.trust_level === 'high').length;
  const highEmotional = persons.filter(
    p => p.emotional_closeness === 'high'
  ).length;

  return (
    <div className="flex flex-col h-full p-5 overflow-y-auto space-y-6 text-[13px]">
      {/* Title */}
      <div>
        <h2 className="text-sm font-bold tracking-[0.2em] text-white/25 uppercase">
          Network Overview
        </h2>
        <p className="text-[11px] text-white/15 mt-1">Tap a node to explore.</p>
      </div>

      {/* Type breakdown bars */}
      <div>
        <div className="text-[10px] tracking-[0.2em] text-white/30 uppercase mb-3">
          Relationship Types
        </div>
        <div className="space-y-3">
          {typeCount.map(([type, count]) => {
            const color = typeColor(type);
            const pct = Math.round((count / persons.length) * 100);
            return (
              <div key={type}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-[10px] tracking-[0.12em] uppercase text-white/45">
                      {type}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold tabular-nums text-white/35">
                    {count}
                  </span>
                </div>
                <ScoreBar value={pct} color={color} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-white/[0.05]" />

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'AVG STRENGTH', value: avgStrength },
          { label: 'TOTAL MSGS / 30D', value: totalMsgs.toLocaleString() },
          { label: 'HIGH TRUST', value: `${highTrust} / ${persons.length}` },
          {
            label: 'EMOTIONALLY CLOSE',
            value: `${highEmotional} / ${persons.length}`,
          },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="border border-white/[0.06] p-3 rounded-lg"
          >
            <div className="text-[10px] tracking-[0.1em] text-white/20 uppercase mb-1">
              {label}
            </div>
            <div className="text-base font-bold tabular-nums">{value}</div>
          </div>
        ))}
      </div>

      <div className="h-px bg-white/[0.05]" />

      {/* Color legend */}
      <div>
        <div className="text-[10px] tracking-[0.2em] text-white/30 uppercase mb-2.5">
          Color Key
        </div>
        <div className="space-y-2">
          {(['friend', 'colleague', 'family'] as const).map(type => (
            <div key={type} className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: typeColor(type) }}
              />
              <span className="text-[10px] text-white/35 tracking-[0.1em] uppercase">
                {type}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[10px] text-white/18 leading-relaxed">
          Node size = message volume · Position = relationship strength rank
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ConnectPage() {
  const [selected, setSelected] = useState<Person | null>(null);

  const positions = useMemo(() => computePositions(people), []);

  const totalMsgs = people.reduce((s, p) => s + p.interaction_count_30d, 0);
  const avgStrength = (
    people.reduce((s, p) => s + p.relationship_strength_score, 0) /
    people.length
  ).toFixed(2);

  function handleSelect(p: Person) {
    setSelected(prev => (prev?.person_name === p.person_name ? null : p));
  }

  return (
    <div className="h-screen bg-[#060606] text-white font-mono overflow-hidden relative flex flex-col text-[14px]">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex-shrink-0 border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">YOUR ORBIT</h1>
          <p className="text-[11px] text-white/20 mt-0.5 tracking-[0.22em] uppercase">
            Relationship Intelligence Map
          </p>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <HeaderStat
            icon={<Users className="h-3 w-3" />}
            label="Connections"
            value={people.length}
          />
          <HeaderStat
            icon={<MessageSquare className="h-3 w-3" />}
            label="Msgs / 30d"
            value={totalMsgs.toLocaleString()}
          />
          <HeaderStat
            icon={<Zap className="h-3 w-3" />}
            label="Avg Strength"
            value={avgStrength}
          />
        </div>
      </header>

      {/* Main area */}
      <div className="relative z-10 flex flex-1 min-h-0">
        {/* Leaderboard (left rail) */}
        <Leaderboard
          people={people}
          selected={selected}
          onSelect={handleSelect}
        />

        {/* Orbital map */}
        <div className="flex-1 flex items-center justify-center p-4 min-w-0">
          <OrbitalMap
            people={people}
            positions={positions}
            selected={selected}
            onSelect={handleSelect}
          />
        </div>

        {/* Side panel */}
        <aside className="w-[340px] flex-shrink-0 border-l border-white/[0.06] overflow-hidden">
          {selected ? (
            <DetailPanel
              key={selected.person_name}
              person={selected}
              onClose={() => setSelected(null)}
            />
          ) : (
            <OverviewPanel people={people} />
          )}
        </aside>
      </div>

      <Styles />
    </div>
  );
}
