import { Minus, Plus, FrameCorners } from '@phosphor-icons/react';
import { NavButton } from '@synergycodes/overflow-ui';
import clsx from 'clsx';
import { LayoutDirection } from '@workflow-builder/types/common';
import { Icon, type WBIcon } from '@workflow-builder/icons';

import styles from './elk-layout-controls.module.css';

import useStore from '@/store/store';
import { setStoreLayoutDirection, setStoreNodes } from '@/store/slices/diagram-slice/actions';

import { trackFutureChange } from '@/features/changes-tracker/stores/use-changes-tracker-store';

import { useFitView } from '@/hooks/use-fit-view';

import { getLayoutedNodes } from '../../utils/get-layouted-nodes';

function getNextLayoutDirection(layoutDirection: LayoutDirection): LayoutDirection {
  return layoutDirection === 'RIGHT' ? 'DOWN' : 'RIGHT';
}

function getDirectionToggleIcon(layoutDirection: LayoutDirection): WBIcon {
  return layoutDirection === 'RIGHT' ? 'ArrowsVertical' : 'ArrowsHorizontal';
}

export function ElkLayoutControls() {
  const fitView = useFitView();
  const nodes = useStore((store) => store.nodes);
  const edges = useStore((store) => store.edges);
  const layoutDirection = useStore((store) => store.layoutDirection);
  const isReadOnlyMode = useStore((store) => store.isReadOnlyMode);
  const reactFlowInstance = useStore((store) => store.reactFlowInstance);
  const isSidebarExpanded = useStore((store) => store.isSidebarExpanded);

  function zoomInDiagram() {
    reactFlowInstance?.zoomIn({ duration: 200 });
  }

  function zoomOutDiagram() {
    reactFlowInstance?.zoomOut({ duration: 200 });
  }

  function centerDiagram() {
    fitView();
  }

  async function applyDiagramLayout(nextLayoutDirection: LayoutDirection) {
    setStoreLayoutDirection(nextLayoutDirection);

    if (nodes.length === 0) {
      return;
    }

    const layoutedNodes = await getLayoutedNodes({
      edges,
      layoutDirection: nextLayoutDirection,
      nodes,
    });

    setStoreNodes(layoutedNodes);
    fitView();
  }

  async function changeLayoutDirection() {
    if (isReadOnlyMode) {
      return;
    }

    trackFutureChange('layoutDirection');
    trackFutureChange('layout');

    try {
      await applyDiagramLayout(getNextLayoutDirection(layoutDirection));
    } catch (error) {
      console.error('ELK direction change failed', error);
    }
  }

  async function refreshDiagramLayout() {
    if (isReadOnlyMode) {
      return;
    }

    trackFutureChange('layout');

    try {
      await applyDiagramLayout(layoutDirection);
    } catch (error) {
      console.error('ELK layout failed', error);
    }
  }

  return (
    <div className={styles['container']}>
      <div
        className={clsx(styles['viewport-controls'], {
          [styles['viewport-controls--with-sidebar']]: isSidebarExpanded,
        })}
      >
        <NavButton disabled={!reactFlowInstance} onClick={zoomOutDiagram} tooltip="Zoom out">
          <Minus />
        </NavButton>
        <NavButton disabled={!reactFlowInstance} onClick={centerDiagram} tooltip="Center diagram">
          <FrameCorners />
        </NavButton>
        <NavButton disabled={!reactFlowInstance} onClick={zoomInDiagram} tooltip="Zoom in">
          <Plus />
        </NavButton>
      </div>
      <div className={styles['layout-controls']}>
        <NavButton onClick={refreshDiagramLayout} tooltip="Refresh layout">
          <Icon name="TreeStructure" />
        </NavButton>
        <NavButton onClick={changeLayoutDirection} tooltip="Change layout direction">
          <Icon name={getDirectionToggleIcon(layoutDirection)} />
        </NavButton>
      </div>
    </div>
  );
}
