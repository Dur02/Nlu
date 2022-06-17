import { getEntity, getEntityArray } from 'relient/selectors';
import { flow, prop, map } from 'lodash/fp';

export const getCurrentUser = (state) => flow(
  getEntity('user'),
  prop(getEntity('auth.currentUserId')(state)),
)(state);

export const gerRoles = (state) => flow(
  getEntityArray('role'),
  map((role) => ({
    ...role,
    resourceIds: map(prop('id'))(role.resources),
    resources: map(({ id }) => getEntity(`resource.${id}`)(state))(role.resources),
  })),
)(state);

export const getRoleOptions = (state) => flow(
  getEntityArray('role'),
  map(({ id, name }) => ({
    label: name,
    value: id,
  })),
)(state);

export const getResourceOptions = (state) => flow(
  getEntityArray('resource'),
  map(({ id, aliasName }) => ({
    label: aliasName,
    value: id,
  })),
)(state);
