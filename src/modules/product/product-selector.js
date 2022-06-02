import { getEntity, getEntityArray } from 'relient/selectors';
// import { map, flow, filter, propEq, orderBy, reduce, find, reject, concat, prop }
// from 'lodash/fp';
import { map, flow, filter, propEq, orderBy, reduce, find, concat, prop } from 'lodash/fp';

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
        return flow(
          // reject(propEq('code', skillVersion.code)),
          concat(skillVersion),
        )(skills);
      }
      // skillVersion.flag = [{ version:skillVersion.version, id:skillVersion.id}]
      // console.log(skillVersion)
      // map((item) => {
      //   if (item.code === skillVersion.code && item.version !== skillVersion.version){
      //     console.log(item.flag);
      //     const a = concat(item.flag, skillVersion.flag);
      //     console.log(a);
      //     item.flag = a;
      //     console.log(item.flag);
      //   }
      // })(skills)
      // skills = flow(
      //   reject(propEq('code', skillVersion.code)),
      //   concat(skillVersion),
      // )(skills);
      // console.log(skills)
      return skills;
    }, []),
    orderBy(['id'], ['asc']),
  )(state),
});
