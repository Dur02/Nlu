import { getEntity } from 'relient/selectors';
import { getSkillsWithCodeKey, getSkillsWithVersions } from 'shared/selectors';

export default (state) => ({
  skills: getSkillsWithVersions(state),
  skillsWithCodeKey: getSkillsWithCodeKey(state),
  token: getEntity('auth.authorization')(state),
});
