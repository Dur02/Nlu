import { getEntity, getEntityArray } from 'relient/selectors';
import { flow, map, filter, propEq, orderBy, last, prop } from 'lodash/fp';
import { getUniqSkillByCode } from 'shared/selectors';

export default (state) => ({
  skills: flow(
    getUniqSkillByCode,
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
  )(state),
  token: getEntity('auth.authorization')(state),
});
