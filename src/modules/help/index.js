import React from 'react';
import { HELP } from 'shared/constants/features';
import Help from './help';

export default () => [{
  feature: HELP,
  action: async () => {
    try {
      // ignore
    } catch (e) {
      // ignore
    }
    return {
      component: <Help />,
    };
  },
}];
