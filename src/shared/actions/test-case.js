import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { read, del, put, post } from 'relient/actions/request';

const actionType = actionTypeCreator('actions/testCase');

export const READ_ALL = actionType('READ_ALL');
export const CREATE = actionType('CREATE');
export const REMOVE = actionType('REMOVE');
export const UPDATE = actionType('UPDATE');
export const REMOVE_BY_LIST = actionType('REMOVE_BY_LIST');

export const readAll = createAction(
  READ_ALL,
  ({
    page,
    pageSize,
    startTime,
    endTime,
    skillName,
    intentName,
    refText,
    testSuiteId,
  }) => read('/skill/edit/test/case/page', {
    page,
    pageSize,
    startTime,
    endTime,
    skillName,
    intentName,
    refText,
    testSuiteId,
  }),
);

export const create = createAction(
  CREATE,
  ({
    audioFile,
    description,
    expectedIntent,
    expectedRule,
    expectedSkill,
    jossShareUrl,
    refText,
    skillCode,
  }) => post('/skill/edit/test/case', {
    audioFile,
    description,
    expectedIntent,
    expectedRule,
    expectedSkill,
    jossShareUrl,
    refText,
    skillCode,
  }),
);

export const update = createAction(
  UPDATE,
  ({
    id,
    audioFile,
    description,
    expectedIntent,
    expectedRule,
    expectedSkill,
    jossShareUrl,
    refText,
    skillCode,
  }) => put(`/skill/edit/test/case/${id}`, {
    audioFile,
    description,
    expectedIntent,
    expectedRule,
    expectedSkill,
    jossShareUrl,
    refText,
    skillCode,
  }),
);

export const remove = createAction(
  REMOVE,
  ({
    id,
  }) => del(`/skill/edit/test/case/${id}`),
);

export const removeByList = createAction(
  REMOVE_BY_LIST,
  ({
    ids,
  }) => del('/skill/edit/test/case/list', {
    ids,
  }),
);
