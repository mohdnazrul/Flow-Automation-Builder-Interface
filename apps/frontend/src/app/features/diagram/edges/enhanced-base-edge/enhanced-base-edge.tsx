import { BaseEdge, BaseEdgeProps } from '@xyflow/react';

import styles from './enhanced-base-edge.module.css';

type EnhancedBaseEdgeProps = BaseEdgeProps & {
  isInteractive?: boolean;
};

export function EnhancedBaseEdge({ id, path, isInteractive = true, style, ...rest }: EnhancedBaseEdgeProps) {
  const nextStyle = isInteractive ? style : { ...style, pointerEvents: 'none' as const };

  return (
    <>
      {isInteractive && <BaseEdge data-path-border-for={id} className={styles['clickable-transparent-border']} path={path} />}
      <BaseEdge id={id} data-edge-id={id} path={path} style={nextStyle} {...rest} />
    </>
  );
}
