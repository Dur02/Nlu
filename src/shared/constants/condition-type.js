import { keys } from 'lodash/fp';
import getText from 'relient/get-text';
import getOptions from 'relient/get-options';

export const EQUAL = 'equal';
export const NOT_EQUAL = 'ne';
export const GREATER = 'greater';
export const LESS = 'less';
export const GREATER_OR_EQUAL = 'ge';
export const LESS_OR_EQUAL = 'le';
export const IN = 'in';
export const EXIST = 'exist';
export const REQUIRED = 'required';
export const ALWAYS = 'always';

export const textMap = {
  [EQUAL]: 'equal',
  [NOT_EQUAL]: 'ne',
  [GREATER]: 'greater',
  [LESS]: 'less',
  [GREATER_OR_EQUAL]: 'ge',
  [LESS_OR_EQUAL]: 'le',
  [IN]: '任意一个',
  [EXIST]: '存在',
  [REQUIRED]: '缺失',
  [ALWAYS]: '默认',
};

export const conditionTypes = keys(textMap);
export const conditionTypeOptions = getOptions(textMap)();
export const getConditionTypeText = getText(textMap)();
