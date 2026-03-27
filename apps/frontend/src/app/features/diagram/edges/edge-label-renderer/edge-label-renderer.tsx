import clsx from 'clsx';
import { Check, X } from '@phosphor-icons/react';
import { EdgeLabel as Label } from '@synergycodes/overflow-ui';
import { EdgeLabelRenderer } from '@xyflow/react';
import { CSSProperties } from 'react';

import styles from './edge-label-renderer.module.css';

import { SystemEdgeBadge } from '../get-system-edge-badge';

type EdgeLabelProps = {
  id: string;
  labelX: number;
  labelY: number;
  content: React.ReactNode;
  hovered: boolean;
  selected?: boolean;
  icon?: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  centeringTransform?: string;
  isStaticBadge?: boolean;
  badgeIcon?: SystemEdgeBadge | null;
};

export function EdgeLabel({
  id,
  labelX,
  labelY,
  content,
  hovered,
  selected,
  onMouseEnter,
  onMouseLeave,
  centeringTransform = 'translate(-50%, -50%)',
  isStaticBadge = false,
  badgeIcon = null,
}: EdgeLabelProps) {
  const style: CSSProperties = {
    transform: `${centeringTransform} translate(${labelX}px,${labelY}px)`,
  };

  if (isStaticBadge) {
    return (
      <EdgeLabelRenderer>
        <span
          data-edge-label-id={id}
          className={clsx(styles['system-badge'])}
          style={style}
          aria-hidden="true"
        >
          {badgeIcon === 'check' ? <Check size={12} weight="bold" /> : <X size={12} weight="bold" />}
        </span>
      </EdgeLabelRenderer>
    );
  }

  // For layout that require label to determine position of the label
  if (!content) {
    return (
      <EdgeLabelRenderer>
        <span
          style={{
            ...style,
            display: 'inline-block',
            height: '2rem', // Height of label in WB
          }}
          data-edge-label-id={id}
        ></span>
      </EdgeLabelRenderer>
    );
  }

  return (
    <EdgeLabelRenderer>
      <Label
        data-edge-label-id={id}
        style={style}
        isHovered={hovered}
        state={selected ? 'selected' : 'default'}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {content}
      </Label>
    </EdgeLabelRenderer>
  );
}
