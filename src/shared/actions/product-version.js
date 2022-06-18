import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { DEFAULT_CURRENT, DEFAULT_SIZE } from 'shared/constants/pagination';
import { read, post } from 'relient/actions/request';

const actionType = actionTypeCreator('actions/product-version');

export const READ_ALL = actionType('READ_ALL');
export const CREATE = actionType('CREATE');

export const readAll = createAction(
  READ_ALL,
  ({
    page = DEFAULT_CURRENT,
    size = DEFAULT_SIZE,
    productId,
  } = {}) => read('/skill/edit/product-version/all', {
    current: page,
    size,
    productId,
  }),
);

export const create = createAction(
  CREATE,
  ({
    productId,
    versionName,
    description,
  }) => post('/skill/edit/product-version', {
    productId,
    versionName,
    description,
  }),
);
