import { useEffect } from 'react';

import { getStoreDataForIntegration } from '@/store/slices/diagram-slice/actions';

import { useChangesTrackerStore } from '@/features/changes-tracker/stores/use-changes-tracker-store';

import { pushUndoSnapshot } from '../stores/use-undo-redo-store';

const ignoredChangeNames = new Set(['nodeDragChange', 'nodeDragStop']);

export function UndoRedoTracker() {
  useEffect(() => {
    return useChangesTrackerStore.subscribe((state, previousState) => {
      if (state.lastChangeTimestamp === previousState.lastChangeTimestamp) {
        return;
      }

      if (ignoredChangeNames.has(state.lastChangeName)) {
        return;
      }

      pushUndoSnapshot(getStoreDataForIntegration());
    });
  }, []);

  return null;
}
