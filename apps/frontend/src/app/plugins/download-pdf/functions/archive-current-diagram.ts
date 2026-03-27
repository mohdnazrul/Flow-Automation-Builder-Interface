import { setStoreDataFromIntegration } from '@/store/slices/diagram-slice/actions';

import { trackFutureChange } from '@/features/changes-tracker/stores/use-changes-tracker-store';

const localStorageDiagramKey = 'workflowBuilderDiagram';

export function archiveCurrentDiagram() {
  trackFutureChange('archive');
  localStorage.removeItem(localStorageDiagramKey);
  setStoreDataFromIntegration({
    edges: [],
    layoutDirection: 'RIGHT',
    name: 'Untitled',
    nodes: [],
  });
}
