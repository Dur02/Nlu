import { getEntity, getEntityArray } from 'relient/selectors';
import { flow } from 'lodash';
import { map, prop } from 'lodash/fp';

export default (state) => ({
  skillNameMap: flow(
    getEntityArray('skillNameMap'),
    map((item) => ({
      ...item,
      standardName: item.skillStandardName,
    })),
  )(state),
  apps: flow(
    getEntity('skillNameMapConfig'),
    prop('apps'),
    map(({ appName, id }) => ({
      label: appName,
      value: id,
    })),
  )(state),
  standardSkillNames: flow(
    getEntity('skillNameMapConfig'),
    prop('standardSkillNames'),
    map(({ skillName }) => ({
      label: skillName,
      value: skillName,
    })),
  )(state),
});
