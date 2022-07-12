import { getSkillsWithVersions } from 'shared/selectors';

export default (state) => ({
  skills: getSkillsWithVersions(state),
});
