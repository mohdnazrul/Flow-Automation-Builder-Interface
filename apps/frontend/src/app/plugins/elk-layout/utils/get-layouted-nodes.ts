import ELK, { ElkNode } from 'elkjs/lib/elk.bundled.js';

import { LayoutDirection } from '@workflow-builder/types/common';
import { WorkflowBuilderEdge, WorkflowBuilderNode } from '@workflow-builder/types/node-data';

import { getSystemEdgeBadge } from '@/features/diagram/edges/get-system-edge-badge';

const elk = new ELK();

const DEFAULT_NODE_WIDTH = 258;
const DEFAULT_NODE_HEIGHT = 63;
const LAYER_SPACING = 180;
const NODE_SPACING = 96;
const EDGE_SPACING = 48;
const COMPONENT_SPACING = 160;
const LAYOUT_PADDING = 48;

function getNodeWidth(node: WorkflowBuilderNode) {
  return node.measured?.width ?? node.width ?? DEFAULT_NODE_WIDTH;
}

function getNodeHeight(node: WorkflowBuilderNode) {
  return node.measured?.height ?? node.height ?? DEFAULT_NODE_HEIGHT;
}

function getEdgeSortRank(edge: WorkflowBuilderEdge) {
  const badge = getSystemEdgeBadge(edge.data?.label);

  if (badge === 'check') {
    return 0;
  }

  if (badge === 'x') {
    return 1;
  }

  return 2;
}

export async function getLayoutedNodes({
  nodes,
  edges,
  layoutDirection,
}: {
  nodes: WorkflowBuilderNode[];
  edges: WorkflowBuilderEdge[];
  layoutDirection: LayoutDirection;
}) {
  const elkGraph: ElkNode = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': layoutDirection,
      'elk.edgeRouting': 'ORTHOGONAL',
      'elk.layered.mergeEdges': 'true',
      'elk.layered.unnecessaryBendpoints': 'true',
      'elk.layered.nodePlacement.favorStraightEdges': 'true',
      'elk.layered.considerModelOrder.strategy': 'NODES_AND_EDGES',
      'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
      'elk.layered.spacing.nodeNodeBetweenLayers': String(LAYER_SPACING),
      'elk.spacing.nodeNode': String(NODE_SPACING),
      'elk.spacing.edgeNode': String(EDGE_SPACING),
      'elk.spacing.edgeEdge': String(EDGE_SPACING),
      'elk.spacing.componentComponent': String(COMPONENT_SPACING),
      'elk.padding': `[top=${LAYOUT_PADDING},left=${LAYOUT_PADDING},bottom=${LAYOUT_PADDING},right=${LAYOUT_PADDING}]`,
    },
    children: nodes.map((node) => ({
      height: getNodeHeight(node),
      id: node.id,
      width: getNodeWidth(node),
    })),
    // Self edges can stay rendered by React Flow after the node moves.
    edges: [...edges]
      .filter((edge) => edge.source !== edge.target)
      .sort((edgeA, edgeB) => {
        if (edgeA.source !== edgeB.source) {
          return edgeA.source.localeCompare(edgeB.source);
        }

        const rankDifference = getEdgeSortRank(edgeA) - getEdgeSortRank(edgeB);

        if (rankDifference !== 0) {
          return rankDifference;
        }

        return edgeA.id.localeCompare(edgeB.id);
      })
      .map((edge) => ({
        id: edge.id,
        sources: [edge.source],
        targets: [edge.target],
      })),
  };

  const layoutedGraph = await elk.layout(elkGraph);
  const positions = new Map(
    (layoutedGraph.children || []).map((node) => [
      node.id,
      {
        x: node.x ?? 0,
        y: node.y ?? 0,
      },
    ]),
  );

  return nodes.map((node) => {
    const nextPosition = positions.get(node.id);

    if (!nextPosition) {
      return node;
    }

    return {
      ...node,
      position: nextPosition,
    };
  });
}
