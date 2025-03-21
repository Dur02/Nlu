import { setFeatures } from 'relient/features';

export const PRODUCT = 'PRODUCT';
export const SKILL = 'SKILL';
export const SKILL_STANDARD = 'SKILL_STANDARD';

export const SYSTEM = 'SYSTEM';
export const ALL_USER = 'ALL_USER';
export const CURRENT_USER = 'CURRENT_USER';
export const ROLE = 'ROLE';
export const RESOURCE = 'RESOURCE';
export const SKILL_PERMISSION = 'SKILL_PERMISSION';

export const AUDIT_LOG = 'AUDIT_LOG';
export const INTERVENTION = 'INTERVENTION';

export const TEST = 'TEST';
export const CASE = 'CASE';
export const SUITE = 'SUITE';
export const JOB = 'JOB';

export const INTENT_MAP = 'INTENT_MAP';

export const INFORMATION = 'INFORMATION';

export const SKILL_NAME_MAP = 'SKILL_NAME_MAP';

export const HELP = 'HELP';

export const features = [{
  key: PRODUCT,
  link: '/',
  text: '产品',
}, {
  key: SKILL,
  link: '/skill',
  text: '技能',
}, {
  key: SKILL_STANDARD,
  link: '/skillStandard',
  text: '技能定义',
}, {
  key: SKILL_NAME_MAP,
  link: '/skillNameMap',
  text: 'App名关系映射',
}, {
  key: INTERVENTION,
  link: '/intervention',
  text: '干预',
}, {
  key: AUDIT_LOG,
  link: '/audit/log',
  text: '审计',
}, {
  key: INTENT_MAP,
  link: '/intentMap',
  text: '意图映射',
}, {
  key: TEST,
  link: '/test',
  text: '测试',
  items: [{
    key: CASE,
    link: 'case',
    text: '测试用例',
  }, {
    key: SUITE,
    link: 'suite',
    text: '测试集',
  }, {
    key: JOB,
    link: 'job',
    text: '测试任务',
  }],
}, {
  key: INFORMATION,
  link: 'information',
  text: 'NLU信息',
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
  key: HELP,
  link: '/help',
  text: '帮助',
}];

setFeatures(features);
