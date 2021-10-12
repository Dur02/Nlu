import { keys } from 'lodash/fp';
import getText from 'relient/get-text';
import getOptions from 'relient/get-options';

export const LAST = 'last';
export const NONE = 'none';
export const WEBHOOK = 'webhook';

export const textMap = {
  [LAST]: '上一轮对话',
  [NONE]: '不使用数据资源',
  [WEBHOOK]: '使用API资源',
};

export const outputResources = keys(textMap);
export const outputResourceOptions = getOptions(textMap)();
export const getOutputResourceText = getText(textMap)();
