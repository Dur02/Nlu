import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { read } from 'relient/actions/request';

const actionType = actionTypeCreator('actions/audit-log');

export const READ_ALL = actionType('READ_ALL');

export const readAll = createAction(
  READ_ALL,
  ({
    page,
    size,
    createTimeBefore,
    createTimeAfter,
    userName,
    resourceType,
  }) => read('/skill/edit/audit/audit-log', {
    page,
    pageSize: size,
    startTime: createTimeAfter,
    endTime: createTimeBefore,
    userName,
    resourceType,
  }),
);
