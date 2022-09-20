import React from 'react';
import { SKILL } from 'shared/constants/features';
import { readAll as readAllWords } from 'shared/actions/words';
import { readAll as readAllRule } from 'shared/actions/rule';
import { readAll as readAllBuiltinIntent } from 'shared/actions/builtin-intent';
import { readAll as readAllIntent } from 'shared/actions/intent';
import { readAll as readAllOutput } from 'shared/actions/output';
import { readAll as readAllSkillVersion } from 'shared/actions/skill-version';
import { readOne as readOneSkill } from 'shared/actions/skill';
import { readMine as readProfile } from 'shared/actions/user';

import Skill from './skill';
import SkillEditor from './skill-editor';

export default () => [{
  feature: SKILL,
  action: async ({ store: { dispatch } }) => {
    try {
      await Promise.all([
        dispatch(readAllSkillVersion()),
        dispatch(readProfile()),
      ]);
    } catch (e) {
      // ignore
    }
    return {
      component: <Skill />,
    };
  },
}, {
  path: '/:id',
  feature: SKILL,
  action: async ({ params: { id }, store: { dispatch } }) => {
    const skillId = Number(id);
    try {
      await Promise.all([
        // dispatch(readProfile()),
        dispatch(readAllSkillVersion()),
        dispatch(readOneSkill({ id: skillId })),
        dispatch(readAllWords({ skillId })),
        dispatch(readAllWords({ type: 'SYSTEM' })),
        dispatch(readAllRule({ skillId })),
        dispatch(readAllBuiltinIntent()),
        dispatch(readAllIntent()),
        dispatch(readAllOutput()),
      ]);
    } catch (e) {
      return {
        redirect: '/skill',
      };
    }
    return {
      component: <SkillEditor skillId={skillId} />,
    };
  },
}];
