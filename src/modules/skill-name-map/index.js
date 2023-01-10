import React from 'react';
import { SKILL_NAME_MAP } from 'shared/constants/features';
import { readAll, readConfig } from 'shared/actions/skill-name-map';
import { readMine as readProfile } from 'shared/actions/user';
import SkillNameMap from './skill-name-map';

export default () => [{
  feature: SKILL_NAME_MAP,
  action: async ({ store: { dispatch } }) => {
    try {
      await Promise.all([
        dispatch(readProfile()),
        dispatch(readAll()),
        dispatch(readConfig()),
      ]);
      return {
        component: <SkillNameMap />,
      };
    } catch (e) {
      // ignore
    }
    return {
      component: <SkillNameMap />,
    };
  },
}];
