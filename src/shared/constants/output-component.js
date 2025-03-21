import { keys } from 'lodash/fp';
import getText from 'relient/get-text';
import getOptions from 'relient/get-options';

export const TEXT = 'text';
export const LIST = 'list';
export const CUSTOM = 'custom';
export const OPEN_APP = 'open_app';

export const textMap = {
  [TEXT]: '文字',
  [LIST]: '列表',
  [OPEN_APP]: '打开App',
  [CUSTOM]: '自定义',
};

export const outputComponents = keys(textMap);
export const outputComponentOptions = getOptions(textMap)();
export const getOutputComponentText = getText(textMap)();
