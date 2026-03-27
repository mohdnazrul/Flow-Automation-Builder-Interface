import { NavButton } from '@synergycodes/overflow-ui';
import { useTranslation } from 'react-i18next';

import { Icon } from '@workflow-builder/icons';

import { openImportModal } from '@/features/integration/components/import-export/import-modal/open-import-modal';

export function OpenFolderButton() {
  const { t } = useTranslation();

  return (
    <NavButton onClick={openImportModal} tooltip={t('tooltips.open')}>
      <Icon name="FolderOpen" />
    </NavButton>
  );
}
