import React from 'react';
import { SKILL_APP } from 'shared/constants/features';
import { readMine as readProfile } from 'shared/actions/user';
import SkillApp from './skill-app';

export default () => [{
  feature: SKILL_APP,
  action: async ({ store: { dispatch } }) => {
    try {
      await Promise.all([
        dispatch(readProfile()),
      ]);
    } catch (e) {
      // ignore
    }
    return {
      component: <SkillApp />,
    };
  },
}];
