import { getPermittedSkillsWithCodeKey } from 'shared/selectors';

export default (state) => ({
  skills: getPermittedSkillsWithCodeKey(state),
});
