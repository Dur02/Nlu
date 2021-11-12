import { getEntityArray } from 'relient/selectors';
import { flow, map, filter, propEq } from 'lodash/fp';

export default (state) => ({
  skills: flow(
    getEntityArray('skill'),
    map((skill) => ({
      ...skill,
      skillVersions: flow(
        getEntityArray('skillVersion'),
        filter(propEq('code', skill.code)),
      )(state),
    })),
  )(state),
});
