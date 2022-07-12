import { getEntityArray } from 'relient/selectors';
import { flow, map, filter, propEq, orderBy, last, prop, values } from 'lodash/fp';
import { getPermittedSkillsWithCodeKey } from 'shared/selectors';

export const getSkills = (state) => flow(
  getPermittedSkillsWithCodeKey,
  values,
  map((skill) => {
    const skillVersions = flow(
      getEntityArray('skillVersion'),
      filter(propEq('code', skill.code)),
      orderBy(['id'], ['desc']),
    )(state);
    return {
      ...skill,
      originalId: flow(last, prop('id'))(skillVersions),
      skillVersions,
    };
  }),
  orderBy(['originalId'], ['desc']),
)(state);

export default (state) => ({
  skills: getSkills(state),
});
