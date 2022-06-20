import { keys } from 'lodash/fp';
import getText from 'relient/get-text';
import getOptions from 'relient/get-options';

export const POST = 'post';
export const DELETE = 'delete';
export const PUT = 'put';

const textMap = {
  [POST]: '增',
  [DELETE]: '删',
  [PUT]: '改',
};

export const operationTypes = keys(textMap);
export const getOperationTypeText = getText(textMap)();
export const operationTypeOptions = getOptions(textMap)();
