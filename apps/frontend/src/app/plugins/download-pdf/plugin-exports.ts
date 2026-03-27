import { registerFunctionDecorator } from '@/features/plugins-core/adapters/adapter-functions';

import { addItemsToDots } from './functions/add-items-to-dots';

registerFunctionDecorator('getControlsDotsItems', {
  callback: addItemsToDots,
  place: 'after',
});
