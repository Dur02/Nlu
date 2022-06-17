import React from 'react';
import { ALL_USER, ROLE, RESOURCE, CURRENT_USER } from 'shared/constants/features';
import User from './user';
import Role from './role';
import Resource from './resource';
import CurrentUser from './current-user';

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
}];
