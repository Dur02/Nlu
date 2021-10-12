import { map } from 'lodash/fp';

export const skillCategories = [
  '效率工具',
  '生活服务',
  '交通出行',
  '影音视听',
  '社交分享',
  '新闻资讯',
  '智能问答',
  '智能家居',
  '智能车载',
  '商业财务',
  '运动健康',
  '购物',
  '游戏',
  '教育',
];

export const skillCategoryOptions = map((category) => ({
  value: category,
  label: category,
}))(skillCategories);
