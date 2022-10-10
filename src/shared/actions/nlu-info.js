import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { read } from 'relient/actions/request';

const actionType = actionTypeCreator('actions/nlu-info');

export const READ_ALL = actionType('READ_ALL');

export const readAll = createAction(
  READ_ALL,
  () => read('/skill/edit/skill-model/product-skill-model-info'),
);
