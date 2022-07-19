import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { DEFAULT_CURRENT, DEFAULT_SIZE } from 'shared/constants/pagination';
import { read, post } from 'relient/actions/request';

const actionType = actionTypeCreator('actions/skill-version');

export const READ_ALL = actionType('READ_ALL');
export const READ_BY_PRODUCT = actionType('READ_BY_PRODUCT');
export const CREATE = actionType('CREATE');
export const CREATE_DRAFT = actionType('CREATE_DRAFT');

export const readAll = createAction(
  READ_ALL,
  ({
    page = DEFAULT_CURRENT,
    size = DEFAULT_SIZE,
  } = {}) => read('/skill/edit/skill-version/all', {
    current: page,
    size,
  }),
);

export const create = createAction(
  CREATE,
  ({
    skillId,
    note,
  }) => post('/skill/edit/skill-version', {
    skillId,
    note,
  }),
);

export const createDraft = createAction(
  CREATE_DRAFT,
  ({ skillId }) => post(`/skill/edit/skill-version/draft?skillId=${skillId}`, { skillId }),
);

export const readByProduct = createAction(
  READ_BY_PRODUCT,
  ({ productId, status }) => read('/skill/edit/product/product-bind-skill', { productId, status }),
);
