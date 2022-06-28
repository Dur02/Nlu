import React from 'react';
import { ALL_USER, ROLE, RESOURCE, CURRENT_USER, SKILL_PERMISSION } from 'shared/constants/features';
import { readAll as readAllSkillPermission } from 'shared/actions/skill-permission';
import User from './user';
import Role from './role';
import Resource from './resource';
import CurrentUser from './current-user';
import SkillPermission from './skill-permission';

export default () => [{
  path: '/all',
  feature: ALL_USER,
  component: <User />,
}, {
  path: '/role',
  feature: ROLE,
  component: <Role />,
}, {
  path: '/resource',
  feature: RESOURCE,
  component: <Resource />,
}, {
  path: '/current',
  feature: CURRENT_USER,
  component: <CurrentUser />,
}, {
  path: '/skill-permission',
  feature: SKILL_PERMISSION,
  action: async ({ store: { dispatch } }) => {
    try {
      await dispatch(readAllSkillPermission());
    } catch (e) {
      // ignore
    }
    return {
      component: <SkillPermission />,
    };
  },
}];
