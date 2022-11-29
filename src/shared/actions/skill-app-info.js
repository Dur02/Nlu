import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { read, post, put, del } from 'relient/actions/request';

const actionType = actionTypeCreator('actions/skill-app-info');

export const READ_ALL = actionType('READ_ALL');
export const CREATE = actionType('CREATE');
export const REMOVE = actionType('REMOVE');
export const UPDATE = actionType('UPDATE');
export const CHANGE_ORDER = actionType('CHANGE_ORDER');

export const readAll = createAction(
  READ_ALL,
  () => read('/skill/edit/skill-app/skills'),
);

export const create = createAction(
  CREATE,
  ({
    order,
    skillIcon,
    skillName,
  }) => post('/skill/edit/skill-app/skill', {
    order,
    skillIcon,
    skillName,
  }),
);

export const update = createAction(
  UPDATE,
  ({
    id,
    order,
    skillIcon,
    skillName,
  }) => put('/skill/edit/skill-app/skill', {
    id,
    order,
    skillIcon,
    skillName,
  }),
);

export const remove = createAction(
  REMOVE,
  ({ id }) => del(`/skill/edit/skill-app/skill/${id}`),
);

export const changeOrder = createAction(
  CHANGE_ORDER,
  ({ id, order }) => put('/skill/edit/skill-app/skill/rank', {
    id,
    order,
  }),
);
