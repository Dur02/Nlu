import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';

const actionType = actionTypeCreator('actions/user');

export const READ_MINE = actionType('READ_MINE');

export const readMine = createAction(
  READ_MINE,
);
