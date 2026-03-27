import { NavButton } from '@synergycodes/overflow-ui';

import { Icon } from '@workflow-builder/icons';

import { redoDiagramState, undoDiagramState, useUndoRedoStore } from '../stores/use-undo-redo-store';

export function UndoRedoButtons() {
  const canUndo = useUndoRedoStore((store) => store.past.length > 0);
  const canRedo = useUndoRedoStore((store) => store.future.length > 0);

  return (
    <>
      <NavButton disabled={!canUndo} onClick={undoDiagramState} tooltip="Undo">
        <Icon name="ArrowUUpLeft" />
      </NavButton>
      <NavButton disabled={!canRedo} onClick={redoDiagramState} tooltip="Redo">
        <Icon name="ArrowUUpRight" />
      </NavButton>
    </>
  );
}
