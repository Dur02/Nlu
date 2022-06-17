import { getEntityArray, getEntity } from 'relient/selectors';
import { flow, map, propEq, reject } from 'lodash/fp';
import { getCurrentUser, getRoleOptions } from 'shared/selectors/index';

export default (state) => {
  const currentUser = getCurrentUser(state);

  return {
    users: flow(
      getEntityArray('user'),
      reject(propEq('id', currentUser.id)),
      map((user) => ({
        ...user,
        roles: map((roleId) => getEntity(`role.${roleId}`)(state))(user.roleIds),
      })),
    )(state),
    roleOptions: getRoleOptions(state),
  };
};
