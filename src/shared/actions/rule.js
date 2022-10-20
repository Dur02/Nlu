import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { DEFAULT_CURRENT, DEFAULT_SIZE } from 'shared/constants/pagination';
import { read, post, del, put } from 'relient/actions/request';
import { map, pick } from 'lodash/fp';

const actionType = actionTypeCreator('actions/rule');

export const READ_ALL = actionType('READ_ALL');
export const READ_ONE = actionType('READ_ONE');
export const CREATE = actionType('CREATE');
export const REMOVE = actionType('REMOVE');
export const UPDATE = actionType('UPDATE');

export const readAll = createAction(
  READ_ALL,
  ({
    page = DEFAULT_CURRENT,
    size = DEFAULT_SIZE,
    skillId,
  } = {}) => read('/skill/edit/rule/all', {
    current: page,
    size,
    skillId,
  }),
);

export const readOne = createAction(
  READ_ONE,
  ({ id }) => read(`/skill/edit/rule/${id}`),
);

export const create = createAction(
  CREATE,
  ({
    skillId,
    intentId,
    sentence,
    slots,
    taskClassify,
    ruleConfig,
  }) => post('/skill/edit/rule', {
    skillId,
    intentId,
    sentence,
    taskClassify,
    slots: slots && JSON.stringify(map(pick(['pos', 'name', 'value']))(slots)),
    ruleConfig,
  }),
);

export const update = createAction(
  UPDATE,
  ({
    id,
    sentence,
    slots,
    taskClassify,
    skillId,
    intentId, // 在2022.10.20更新分级预料加入，此前没有使用intentId，但没有影响？为什么这个参数要存在？
    ruleConfig,
  }) => put(`/skill/edit/rule/${id}`, {
    sentence,
    taskClassify,
    slots: slots && JSON.stringify(map(pick(['pos', 'name', 'value']))(slots)),
    skillId,
    intentId,
    ruleConfig,
  }),
);

export const remove = createAction(
  REMOVE,
  ({ id, skillId }) => del(`/skill/edit/rule/${id}`, { skillId }),
);
