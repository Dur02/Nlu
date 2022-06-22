import { getEntity, getEntityArray } from 'relient/selectors';
import { flow, map, filter, propEq, orderBy, reduce, find, reject, concat, last, prop } from 'lodash/fp';

export default (state) => ({
  skills: flow(
    getEntityArray('skillVersion'),
    reduce((skills, skillVersion) => {
      const skill = find(skillVersion.code)(skills);
      if (!skill || skillVersion.id > skill.id) {
        return flow(
          reject(propEq('code', skillVersion.code)),
          concat(skillVersion),
        )(skills);
      }
      return skills;
    }, []),
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
