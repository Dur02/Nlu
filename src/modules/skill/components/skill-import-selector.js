import { getEntity } from 'relient/selectors';
import { getSkillsWithCodeKey } from 'shared/selectors';
import { getSkills } from '../skill-selector';

export default (state) => ({
  skills: getSkills(state),
  skillsWithCodeKey: getSkillsWithCodeKey(state),
  token: getEntity('auth.authorization')(state),
});
