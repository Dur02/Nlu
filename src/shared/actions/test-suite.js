import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { read, del, put, post } from 'relient/actions/request';

const actionType = actionTypeCreator('actions/testSuite');

export const READ_ALL = actionType('READ_ALL');
export const CREATE = actionType('CREATE');
export const REMOVE = actionType('REMOVE');
export const UPDATE = actionType('UPDATE');
export const FILTER_ADD = actionType('FILTER_ADD');
export const CASE_ADD = actionType('CASE_ADD');
export const CASE_DEL = actionType('CASE_DEL');
export const CASE_REPLACE = actionType('CASE_REPLACE');

export const readAll = createAction(
  READ_ALL,
  ({
    page,
    pageSize,
    startTime,
    endTime,
    title,
  }) => read('/skill/edit/test/suite/page', {
    page,
    pageSize,
    startTime,
    endTime,
    title,
  }),
);

export const create = createAction(
  CREATE,
  ({
    description,
    suiteType,
    testCaseIds,
    title,
  }) => post('/skill/edit/test/suite', {
    description,
    suiteType,
    testCaseIds,
    title,
  }),
);

export const update = createAction(
  UPDATE,
  ({
    id,
    description,
    suiteType,
    testCaseIds,
    title,
  }) => put(`/skill/edit/test/suite/${id}`, {
    description,
    suiteType,
    testCaseIds,
    title,
  }),
);

export const remove = createAction(
  REMOVE,
  ({
    id,
  }) => del(`/skill/edit/test/suite/${id}`),
);

export const filterAdd = createAction(
  FILTER_ADD,
  ({
    intentName,
    refText,
    skillName,
    suiteId,
  }) => post('/skill/edit/test/suite/cases/filter-add', {
    intentName,
    refText,
    skillName,
    suiteId,
  }),
);

export const caseAdd = createAction(
  CASE_ADD,
  ({
    caseIds,
    suiteId,
  }) => post('/skill/edit/test/suite/cases/add', {
    caseIds,
    suiteId,
  }),
);

export const caseDel = createAction(
  CASE_DEL,
  ({
    caseIds,
    suiteId,
  }) => del('/skill/edit/test/suite/cases/del', {
    caseIds,
    suiteId,
  }),
);

export const caseReplace = createAction(
  CASE_REPLACE,
  ({
    caseIds,
    suiteId,
  }) => put('/skill/edit/test/suite/cases/add-del', {
    caseIds,
    suiteId,
  }),
);
