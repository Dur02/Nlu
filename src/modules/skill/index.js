import React from 'react';
import { SKILL } from 'shared/constants/features';
import { readAll as readAllWords } from 'shared/actions/words';
import { readAll as readAllRule } from 'shared/actions/rule';
import Skill from './skill';
import SkillEditor from './skill-editor';

export default () => [{
  feature: SKILL,
  component: <Skill />,
}, {
  path: '/:id',
  feature: SKILL,
  action: async ({ params: { id }, store: { dispatch } }) => {
    const skillId = Number(id);
    await dispatch(readAllWords({ skillId }));
    await dispatch(readAllRule({ skillId }));
    return {
      component: <SkillEditor skillId={skillId} />,
    };
  },
}];
