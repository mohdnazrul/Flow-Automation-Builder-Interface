import styles from '../../app-bar.module.css';

import { OptionalAppBarTools } from '@/features/plugins-core/components/app/optional-app-bar-toolbar';

import { OpenFolderButton } from '@/features/app-bar/components/open-folder-button/open-folder-button';
import { SaveButton } from '@/features/integration/components/save-button/save-button';
import { UndoRedoButtons } from '@/features/undo-redo/components/undo-redo-buttons';

import logo from '../../../../../assets/workflow-builder-logo.png';

export function Toolbar() {
  return (
    <div className={styles['toolbar']}>
      <img src={logo} alt="Nusarix logo" className={styles['logo']} />
      <div className={styles['nav-segment']}>
        <SaveButton />
        <OpenFolderButton />
        <UndoRedoButtons />
        <OptionalAppBarTools />
      </div>
    </div>
  );
}
