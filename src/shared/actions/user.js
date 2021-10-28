import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { read } from 'relient/actions/request';

const actionType = actionTypeCreator('actions/user');

export const READ_MINE = actionType('READ_MINE');

export const readMine = createAction(
  READ_MINE,
  () => read('/skill/edit/user/mine'),
);
