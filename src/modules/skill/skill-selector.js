import { flow } from 'lodash/fp';
import { getSkillsWithVersions } from 'shared/selectors';

export const getSkills = (state) => flow(
  getSkillsWithVersions,
)(state);

export default (state) => ({
  skills: getSkills(state),
});
