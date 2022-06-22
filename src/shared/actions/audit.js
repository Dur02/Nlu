import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { read } from 'relient/actions/request';

const actionType = actionTypeCreator('actions/audit-log');

export const READ_ALL = actionType('READ_ALL');
export const READ_ALL_RESOURCE_TYPE = actionType('READ_ALL_RESOURCE_TYPE');

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

export const readAllResourceType = createAction(
  READ_ALL_RESOURCE_TYPE,
  () => read('/skill/edit/audit/audit-resource-type'),
);
