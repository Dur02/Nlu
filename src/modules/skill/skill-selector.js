import { getEntityArray } from 'relient/selectors';
import { flow, map, filter, propEq, orderBy } from 'lodash/fp';

export default (state) => ({
  skills: flow(
    getEntityArray('skill'),
    orderBy(['id'], ['desc']),
    map((skill) => ({
      ...skill,
      skillVersions: flow(
        getEntityArray('skillVersion'),
        filter(propEq('code', skill.code)),
      )(state),
    })),
  )(state),
});
