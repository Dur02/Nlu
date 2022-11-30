import React from 'react';
import { SKILL_STANDARD } from 'shared/constants/features';
import { readMine as readProfile } from 'shared/actions/user';
import { readAll } from 'shared/actions/skill-standard';
import SkillStandard from './skill-standard';

export default () => [{
  feature: SKILL_STANDARD,
  action: async ({ store: { dispatch } }) => {
    try {
      await Promise.all([
        dispatch(readProfile()),
        dispatch(readAll()),
      ]);
    } catch (e) {
      // ignore
    }
    return {
      component: <SkillStandard />,
    };
  },
}];
