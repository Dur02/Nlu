import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { DEFAULT_CURRENT, DEFAULT_SIZE } from 'shared/constants/pagination';
import { read } from 'relient/actions/request';

const actionType = actionTypeCreator('actions/builtin-intent');

export const READ_ALL = actionType('READ_ALL');

export const readAll = createAction(
  READ_ALL,
  ({
    page = DEFAULT_CURRENT,
    size = DEFAULT_SIZE,
  } = {}) => read('/skill/edit/builtin-intent/all', {
    current: page,
    size,
  }),
);
