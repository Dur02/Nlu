import { getEntity, getEntityArray } from 'relient/selectors';
import { map, flow, filter, propEq, orderBy, find, reduce, reject, concat, prop } from 'lodash/fp';

export default (state) => ({
  products: flow(
    getEntityArray('product'),
    orderBy(['id'], ['desc']),
    map((product) => ({
      ...product,
      skillCodes: map((skillId) => flow(
        getEntity(`skillVersion.${skillId}`),
        prop('code'),
      )(state))(product.skillIds),
      productVersions: flow(
        getEntityArray('productVersion'),
        filter(propEq('productId', product.id)),
        orderBy(['id'], ['desc']),
      )(state),
    })),
  )(state),
  skills: flow(
    getEntityArray('skillVersion'),
    reduce((skills, skillVersion) => {
      // console.log(skills)
      if (skillVersion.isDraft) {
        return skills;
      }
      const skill = find(skillVersion.code)(skills);
      if (!skill || skillVersion.id > skill.id) {
        // return flow(
        //   reject(propEq('code', skillVersion.code)),
        //   concat(skillVersion),
        // )(skills);
        const skillVersionTemp = skillVersion;
        skillVersionTemp.flag = [{ version: skillVersion.version, id: skillVersion.id }];
        let a;
        map((item) => {
          if (item.code === skillVersionTemp.code) {
            a = concat(skillVersionTemp.flag, item.flag);
          }
        })(skills);
        if (a !== undefined) {
          skillVersionTemp.flag = a;
        }
        return flow(
          reject(propEq('code', skillVersionTemp.code)),
          concat(skillVersionTemp),
        )(skills);
      }
      return skills;
    }, []),
    orderBy(['id'], ['desc']),
  )(state),
});
