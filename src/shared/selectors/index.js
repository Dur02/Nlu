import { getEntity, getEntityArray } from 'relient/selectors';
import { flow, prop, map, filter, propEq, reject } from 'lodash/fp';

export const getCurrentUser = (state) => flow(
  getEntity('user'),
  prop(getEntity('auth.currentUserId')(state)),
)(state);

export const gerRoles = (state) => flow(
  getEntityArray('role'),
  reject(propEq('id', 1)),
  map((role) => ({
    ...role,
    resourceIds: map(prop('id'))(role.resources),
    resources: map(({ id }) => getEntity(`resource.${id}`)(state))(role.resources),
  })),
)(state);

export const getRoleOptions = (state) => flow(
  getEntityArray('role'),
  reject(propEq('id', 1)),
  map(({ id, name }) => ({
    label: name,
    value: id,
  })),
)(state);

export const getResourceOptions = (state, father = 0) => {
  const resources = flow(
    getEntityArray('resource'),
    filter(propEq('father', father)),
  )(state);
  if (resources.length > 0) {
    return map(({ id, resourceName }) => ({
      title: resourceName,
      key: id,
      children: getResourceOptions(state, id),
    }))(resources);
  }
  return undefined;
};

export const getResources = (state, father = 0) => {
  const resources = flow(
    getEntityArray('resource'),
    filter(propEq('father', father)),
  )(state);
  if (resources.length > 0) {
    return map((resource) => ({
      ...resource,
      children: getResources(state, resource.id),
    }))(resources);
  }
  return undefined;
};
