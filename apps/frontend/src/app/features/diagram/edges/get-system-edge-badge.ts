export type SystemEdgeBadge = 'check' | 'x';

export function getSystemEdgeBadge(label: unknown): SystemEdgeBadge | null {
  if (typeof label === 'boolean') {
    return label ? 'check' : 'x';
  }

  if (typeof label !== 'string') {
    return null;
  }

  const normalizedLabel = label.trim().toLowerCase();

  if (POSITIVE_EDGE_LABELS.has(normalizedLabel)) {
    return 'check';
  }

  if (NEGATIVE_EDGE_LABELS.has(normalizedLabel)) {
    return 'x';
  }

  return null;
}

const POSITIVE_EDGE_LABELS = new Set(['true', 'yes', 'y', '1', 'ok', '\u2714', '\u2714\ufe0f', '\u2713']);
const NEGATIVE_EDGE_LABELS = new Set(['false', 'no', 'x', 'n', '0', '\u2716', '\u2716\ufe0f', '\u2715']);
