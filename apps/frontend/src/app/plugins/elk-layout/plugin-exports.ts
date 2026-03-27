import { registerComponentDecorator } from '@/features/plugins-core/adapters/adapter-components';

import { ElkLayoutControls } from './components/elk-layout-controls/elk-layout-controls';

registerComponentDecorator('OptionalAppBarControls', {
  content: ElkLayoutControls,
  name: 'ElkLayout',
  place: 'before',
});
