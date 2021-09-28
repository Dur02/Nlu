import React from 'react';
import Login from './login';

export default async () => [{
  path: '/login',
  action: async () => ({
    component: <Login />,
  }),
}];
