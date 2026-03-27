import { MouseEvent } from 'react';

import { WorkflowBuilderOnSelectionChangeParams } from '@workflow-builder/types/common';
import { WorkflowBuilderEdge } from '@workflow-builder/types/node-data';

import { GetDiagramState, SetDiagramState } from '@/store/store';
import { getSystemEdgeBadge } from '@/features/diagram/edges/get-system-edge-badge';

export type DiagramSelectionState = {
  hoveredElement: string | null;
  selectedNodesIds: string[];
  selectedEdgesIds: string[];
  onEdgeMouseEnter: (_event: MouseEvent, edge: WorkflowBuilderEdge) => void;
  onEdgeMouseLeave: (_event: MouseEvent, edge: WorkflowBuilderEdge) => void;
  onSelectionChange: (event: WorkflowBuilderOnSelectionChangeParams) => void;
};

export function useDiagramSelectionSlice(set: SetDiagramState, get: GetDiagramState) {
  return {
    hoveredElement: null,
    selectedNodesIds: [],
    selectedEdgesIds: [],
    onSelectionChange: (event: WorkflowBuilderOnSelectionChangeParams) => {
      set({
        selectedNodesIds: event.nodes.map((x) => x.id),
        selectedEdgesIds: event.edges.filter((x) => !getSystemEdgeBadge(x.data?.label)).map((x) => x.id),
      });
    },
    onEdgeMouseEnter: (_event: React.MouseEvent, edge: WorkflowBuilderEdge) => {
      if (getSystemEdgeBadge(edge.data?.label)) {
        return;
      }

      set({
        hoveredElement: edge.id,
      });
    },
    onEdgeMouseLeave: (_event: React.MouseEvent, edge: WorkflowBuilderEdge) => {
      const current = get().hoveredElement;
      if (current === edge.id) {
        set({
          hoveredElement: null,
        });
      }
    },
  };
}
