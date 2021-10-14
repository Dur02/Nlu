import React from 'react';
import { SKILL } from 'shared/constants/features';
import Skill from './skill';
import SkillEditor from './skill-editor';

export default () => [{
  feature: SKILL,
  component: <Skill />,
}, {
  path: '/:id',
  feature: SKILL,
  action: ({ params: { id } }) => ({
    component: <SkillEditor skillId={Number(id)} />,
  }),
}];
