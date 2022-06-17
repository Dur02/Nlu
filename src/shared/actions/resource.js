import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { read, put } from 'relient/actions/request';

const actionType = actionTypeCreator('actions/resource');

export const READ_ALL = actionType('READ_ALL');
export const UPDATE = actionType('UPDATE');

export const readAll = createAction(
  READ_ALL,
  () => read('/skill/edit/resource'),
);

export const update = createAction(
  UPDATE,
  ({
    id,
    aliasName,
  }) => put('/skill/edit/resource', {
    id,
    aliasName,
  }),
);
