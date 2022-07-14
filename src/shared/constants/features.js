import { setFeatures } from 'relient/features';

export const PRODUCT = 'PRODUCT';
export const SKILL = 'SKILL';

export const SYSTEM = 'SYSTEM';
export const ALL_USER = 'ALL_USER';
export const CURRENT_USER = 'CURRENT_USER';
export const ROLE = 'ROLE';
export const RESOURCE = 'RESOURCE';
export const SKILL_PERMISSION = 'SKILL_PERMISSION';

export const AUDIT_LOG = 'AUDIT_LOG';
export const INTERVENTION = 'INTERVENTION';

export const features = [{
  key: PRODUCT,
  link: '/',
  text: '产品',
}, {
  key: SKILL,
  link: '/skill',
  text: '技能',
}, {
  key: SYSTEM,
  link: '/system',
  text: '系统设置',
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
    text: '权限',
  }, {
    key: SKILL_PERMISSION,
    link: 'skill-permission',
    text: '技能权限',
  }],
}, {
  key: AUDIT_LOG,
  link: 'audit/log',
  text: '审计',
}, {
  key: INTERVENTION,
  link: 'intervention',
  text: '干预',
}];

setFeatures(features);
