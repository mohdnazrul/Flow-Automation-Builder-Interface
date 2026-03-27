import { create } from 'zustand';

import { getStoreDataForIntegration, setStoreDataFromIntegration } from '@/store/slices/diagram-slice/actions';

import { IntegrationDataFormat } from '@/features/integration/types';

const HISTORY_LIMIT = 100;

type UndoRedoState = {
  past: IntegrationDataFormat[];
  future: IntegrationDataFormat[];
};

export const useUndoRedoStore = create<UndoRedoState>(() => ({
  past: [],
  future: [],
}));

function cloneSnapshot(snapshot: IntegrationDataFormat) {
  return JSON.parse(JSON.stringify(snapshot)) as IntegrationDataFormat;
}

function getSnapshotKey(snapshot: IntegrationDataFormat) {
  return JSON.stringify(snapshot);
}

export function pushUndoSnapshot(snapshot: IntegrationDataFormat) {
  const nextSnapshot = cloneSnapshot(snapshot);

  useUndoRedoStore.setState((state) => {
    const lastSnapshot = state.past.at(-1);

    if (lastSnapshot && getSnapshotKey(lastSnapshot) === getSnapshotKey(nextSnapshot)) {
      return state;
    }

    return {
      past: [...state.past, nextSnapshot].slice(-HISTORY_LIMIT),
      future: [],
    };
  });
}

export function undoDiagramState() {
  const { past, future } = useUndoRedoStore.getState();
  const previousSnapshot = past.at(-1);

  if (!previousSnapshot) {
    return;
  }

  const currentSnapshot = cloneSnapshot(getStoreDataForIntegration());

  setStoreDataFromIntegration(previousSnapshot);

  useUndoRedoStore.setState({
    past: past.slice(0, -1),
    future: [currentSnapshot, ...future].slice(0, HISTORY_LIMIT),
  });
}

export function redoDiagramState() {
  const { past, future } = useUndoRedoStore.getState();
  const nextSnapshot = future[0];

  if (!nextSnapshot) {
    return;
  }

  const currentSnapshot = cloneSnapshot(getStoreDataForIntegration());

  setStoreDataFromIntegration(nextSnapshot);

  useUndoRedoStore.setState({
    past: [...past, currentSnapshot].slice(-HISTORY_LIMIT),
    future: future.slice(1),
  });
}
