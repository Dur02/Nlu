import { keys } from 'lodash/fp';
import getText from 'relient/get-text';
import getOptions from 'relient/get-options';

export const INTENT = 'intent';
export const RULE = 'rule';
export const WORD = 'word';
export const OUTPUT = 'output';
export const SKILL = 'skill';
export const PRODUCT = 'product';

const textMap = {
  [INTENT]: '意图',
  [RULE]: '说法',
  [WORD]: '词库',
  [OUTPUT]: '对话',
  [SKILL]: '技能',
  [PRODUCT]: '产品',
};

export const resourceTypes = keys(textMap);
export const getResourceTypeText = getText(textMap)();
export const resourceTypeOptions = getOptions(textMap)();
