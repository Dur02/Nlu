import { getCurrentUser, getSkillsWithVersions } from 'shared/selectors';
import { filter, flow, includes } from 'lodash/fp';

export default (state) => {
  const { skillCodes } = getCurrentUser(state);

  return {
    skills: flow(
      getSkillsWithVersions,
      filter(({ code }) => includes(code)(skillCodes)),
    )(state),
  };
};
