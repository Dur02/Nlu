import { every, flow, join, map, any, propEq } from 'lodash/fp';
import { getConditionTypeText, ALWAYS } from '../constants/condition-type';

export const getIsDefault = (condition) => !condition
  || condition.length === 0
  || any(propEq('type', ALWAYS))(condition)
  || every(({ params }) => !params || params.length === 0)(condition);

export const getCName = (condition) => {
  if (getIsDefault(condition)) {
    return getConditionTypeText(ALWAYS);
  }
  return flow(
    map(({ params, type }) => `${params[0] || ''}${getConditionTypeText(type)}${params[1] || ''}`),
    join('&'),
  )(condition);
};

export const arrayMoveMutable = (array, fromIndex, toIndex) => {
  const startIndex = fromIndex < 0 ? array.length + fromIndex : fromIndex;

  if (startIndex >= 0 && startIndex < array.length) {
    const endIndex = toIndex < 0 ? array.length + toIndex : toIndex;

    const [item] = array.splice(fromIndex, 1);
    array.splice(endIndex, 0, item);
  }
};

export const arrayMoveImmutable = (array, fromIndex, toIndex) => {
  const result = [...array];
  arrayMoveMutable(result, fromIndex, toIndex);
  return result;
};
