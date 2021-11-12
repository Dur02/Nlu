import { flow, join, map } from 'lodash/fp';
import { getConditionTypeText } from '../constants/condition-type';

export const getCName = flow(
  map(({ params, type }) => `${params[0] || ''}${getConditionTypeText(type)}${params[1] || ''}`),
  join('&'),
);

export const a = 1;
