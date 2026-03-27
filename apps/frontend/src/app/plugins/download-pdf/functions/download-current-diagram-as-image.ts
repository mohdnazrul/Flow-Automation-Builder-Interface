import { getNodesBounds, getViewportForBounds } from '@xyflow/react';
import { toPng } from 'html-to-image';

import { getStoreDataForIntegration } from '@/store/slices/diagram-slice/actions';
import useStore from '@/store/store';

const EXPORT_PADDING = 0.2;
const EXPORT_MIN_ZOOM = 0.1;
const EXPORT_MAX_ZOOM = 1.5;
const EXPORT_MARGIN = 200;

function getDiagramFileName(extension: 'pdf' | 'png') {
  const { name } = getStoreDataForIntegration();
  const baseName = name.trim() || 'workflow-diagram';
  const sanitizedName = baseName.replace(/[<>:"/\\|?*\u0000-\u001F]/g, '-');

  return `${sanitizedName}.${extension}`;
}

function downloadDataUrl(dataUrl: string, fileName: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;
  link.click();
}

export async function getCurrentDiagramDataUrl() {
  const { nodes, reactFlowInstance } = useStore.getState();
  const viewport = document.querySelector('.react-flow__viewport') as HTMLElement | null;

  if (!reactFlowInstance || !viewport || nodes.length === 0) {
    return null;
  }

  const bounds = getNodesBounds(nodes);
  const imageWidth = Math.max(Math.round(bounds.width + EXPORT_MARGIN), 800);
  const imageHeight = Math.max(Math.round(bounds.height + EXPORT_MARGIN), 600);
  const viewportTransform = getViewportForBounds(
    bounds,
    imageWidth,
    imageHeight,
    EXPORT_MIN_ZOOM,
    EXPORT_MAX_ZOOM,
    EXPORT_PADDING,
  );

  return toPng(viewport, {
    backgroundColor: '#ffffff',
    cacheBust: true,
    height: imageHeight,
    pixelRatio: 2,
    style: {
      height: `${imageHeight}px`,
      transform: `translate(${viewportTransform.x}px, ${viewportTransform.y}px) scale(${viewportTransform.zoom})`,
      width: `${imageWidth}px`,
    },
    width: imageWidth,
  });
}

export async function downloadCurrentDiagramAsImage() {
  const dataUrl = await getCurrentDiagramDataUrl();

  if (!dataUrl) {
    return;
  }

  downloadDataUrl(dataUrl, getDiagramFileName('png'));
}
