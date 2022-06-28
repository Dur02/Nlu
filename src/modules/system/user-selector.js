import { getEntityArray, getEntity } from 'relient/selectors';
import { flow, map } from 'lodash/fp';
import { getRoleOptions } from 'shared/selectors/index';

export default (state) => ({
  users: flow(
    getEntityArray('user'),
    map((user) => ({
      ...user,
      roles: map((roleId) => getEntity(`role.${roleId}`)(state))(user.roleIds),
      skillCodes: getEntity(`skillPermission.${user.id}.skillCodes`)(state),
    })),
  )(state),
  roleOptions: getRoleOptions(state),
});
