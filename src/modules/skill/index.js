import React from 'react';
import { SKILL } from 'shared/constants/features';
import { readAll as readAllWords } from 'shared/actions/words';
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
    return {
      component: <SkillEditor skillId={skillId} />,
    };
  },
}];
