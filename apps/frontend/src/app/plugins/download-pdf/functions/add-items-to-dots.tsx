import { MenuItemProps } from '@synergycodes/overflow-ui';
import i18n from 'i18next';

import { Icon } from '@workflow-builder/icons';

import { archiveCurrentDiagram } from './archive-current-diagram';
import { downloadCurrentDiagramAsImage } from './download-current-diagram-as-image';
import { downloadCurrentDiagramAsPdf } from './download-current-diagram-as-pdf';

export function addItemsToDots({ returnValue }: { returnValue: unknown }) {
  if (!Array.isArray(returnValue)) {
    return;
  }

  const items = returnValue as MenuItemProps[];
  const newItems: MenuItemProps[] = [
    {
      label: i18n.t('header.controls.saveAsImage'),
      icon: <Icon name="Image" />,
      onClick: downloadCurrentDiagramAsImage,
    },
    {
      label: 'Save as PDF',
      icon: <Icon name="FilePdf" />,
      onClick: downloadCurrentDiagramAsPdf,
    },
    {
      label: i18n.t('header.controls.archive'),
      icon: <Icon name="Archive" />,
      destructive: true,
      onClick: archiveCurrentDiagram,
    },
  ];

  return {
    replacedReturn: [...items, ...newItems],
  };
}
