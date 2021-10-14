import { setFeatures } from 'relient/features';

export const PRODUCT = 'PRODUCT';
export const SKILL = 'SKILL';

export const features = [{
  key: PRODUCT,
  link: '/',
  text: '产品',
}, {
  key: SKILL,
  link: '/skill',
  text: '技能',
}];

setFeatures(features);
