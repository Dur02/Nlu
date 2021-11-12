import { flow, join, map } from 'lodash/fp';
import { getConditionTypeText } from '../constants/condition-type';

export const getCName = flow(
  map(({ params, type }) => `${params[0] || ''}${getConditionTypeText(type)}${params[1] || ''}`),
  join('&'),
);

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
