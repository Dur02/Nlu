import React from 'react';
import { ALL_USER, ROLE, RESOURCE, CURRENT_USER, SKILL_PERMISSION } from 'shared/constants/features';
import { readAll as readAllSkillPermission } from 'shared/actions/skill-permission';
import { readAll as readAllUser } from 'shared/actions/user';
import { readAll as readAllRole } from 'shared/actions/role';
import { readAll as readAllResource } from 'shared/actions/resource';
import { readAll as readAllSkillVersion } from 'shared/actions/skill-version';

import User from './user';
import Role from './role';
import Resource from './resource';
import CurrentUser from './current-user';
import SkillPermission from './skill-permission';

export default () => [{
  path: '/all',
  feature: ALL_USER,
  action: async ({ store: { dispatch } }) => {
    try {
      await Promise.all([
        dispatch(readAllRole()),
        dispatch(readAllUser()),
      ]);
    } catch (e) {
      // ignore
    }
    return {
      component: <User />,
    };
  },
}, {
  path: '/role',
  feature: ROLE,
  action: async ({ store: { dispatch } }) => {
    try {
      await Promise.all([
        dispatch(readAllRole()),
        dispatch(readAllResource()),
      ]);
    } catch (e) {
      // ignore
    }
    return {
      component: <Role />,
    };
  },
}, {
  path: '/resource',
  feature: RESOURCE,
  action: async ({ store: { dispatch } }) => {
    try {
      await dispatch(readAllResource());
    } catch (e) {
      // ignore
    }
    return {
      component: <Resource />,
    };
  },
}, {
  path: '/current',
  feature: CURRENT_USER,
  component: <CurrentUser />,
}, {
  path: '/skill-permission',
  feature: SKILL_PERMISSION,
  action: async ({ store: { dispatch } }) => {
    try {
      await Promise.all([
        dispatch(readAllSkillVersion()),
        dispatch(readAllSkillPermission()),
      ]);
    } catch (e) {
      // ignore
    }
    return {
      component: <SkillPermission />,
    };
  },
}];
