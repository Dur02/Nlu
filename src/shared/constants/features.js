import { setFeatures } from 'relient/features';

export const PRODUCT = 'PRODUCT';
export const SKILL = 'SKILL';

export const USER = 'USER';
export const ALL_USER = 'ALL_USER';
export const CURRENT_USER = 'CURRENT_USER';
export const ROLE = 'ROLE';
export const RESOURCE = 'RESOURCE';

export const AUDIT_LOG = 'AUDIT_LOG';

export const features = [{
  key: PRODUCT,
  link: '/',
  text: '产品',
}, {
  key: SKILL,
  link: '/skill',
  text: '技能',
}, {
  key: USER,
  link: '/user',
  text: '权限',
  items: [{
    key: ALL_USER,
    link: 'all',
    text: '用户',
  }, {
    key: CURRENT_USER,
    link: 'current',
    text: '当前用户',
  }, {
    key: ROLE,
    link: 'role',
    text: '角色',
  }, {
    key: RESOURCE,
    link: 'resource',
    text: '资源',
  }],
}, {
  key: AUDIT_LOG,
  link: 'audit/log',
  text: '审计',
}];

setFeatures(features);
