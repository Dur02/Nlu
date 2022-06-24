import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { read, put } from 'relient/actions/request';
import { DEFAULT_CURRENT, DEFAULT_SIZE } from '../constants/pagination';

const actionType = actionTypeCreator('actions/skill-permission');

export const READ_ALL = actionType('READ_ALL');
export const UPDATE = actionType('UPDATE');

export const readAll = createAction(
  READ_ALL,
  ({
    page = DEFAULT_CURRENT,
    size = DEFAULT_SIZE,
  } = {}) => read('/skill/edit/skill-permission', {
    page,
    limit: size,
  }),
);

export const update = createAction(
  UPDATE,
  ({
    userId,
    skillCodes,
  }) => put('/skill/edit/skill-permission', {
    userId,
    skillCodes,
  }),
);
