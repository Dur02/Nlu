import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { DEFAULT_CURRENT, DEFAULT_SIZE } from 'shared/constants/pagination';
import { read, post } from 'relient/actions/request';

const actionType = actionTypeCreator('actions/skill-version');

export const READ_ALL = actionType('READ_ALL');
export const CREATE = actionType('CREATE');

export const readAll = createAction(
  READ_ALL,
  ({
    current = DEFAULT_CURRENT,
    size = DEFAULT_SIZE,
  } = {}) => read('/nlu/edit/skill-version/all', {
    current,
    size,
  }),
);

export const create = createAction(
  CREATE,
  ({
    skillId,
    note,
  }) => post('/nlu/edit/skill-version', {
    skillId,
    note,
  }),
);
