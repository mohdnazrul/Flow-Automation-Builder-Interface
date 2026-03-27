import { jsPDF } from 'jspdf';

import { getStoreDataForIntegration } from '@/store/slices/diagram-slice/actions';

import { getCurrentDiagramDataUrl } from './download-current-diagram-as-image';

function getDiagramPdfFileName() {
  const { name } = getStoreDataForIntegration();
  const baseName = name.trim() || 'workflow-diagram';
  const sanitizedName = baseName.replace(/[<>:"/\\|?*\u0000-\u001F]/g, '-');

  return `${sanitizedName}.pdf`;
}

function getImageSize(dataUrl: string) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve({ height: image.height, width: image.width });
    image.onerror = reject;
    image.src = dataUrl;
  });
}

export async function downloadCurrentDiagramAsPdf() {
  const dataUrl = await getCurrentDiagramDataUrl();

  if (!dataUrl) {
    return;
  }

  const { width, height } = await getImageSize(dataUrl);
  const pdf = new jsPDF({
    format: [width, height],
    orientation: width > height ? 'landscape' : 'portrait',
    unit: 'px',
  });

  pdf.addImage(dataUrl, 'PNG', 0, 0, width, height);
  pdf.save(getDiagramPdfFileName());
}
