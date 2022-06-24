import { eq } from 'lodash/fp';

export const ACTIVE = 0;
export const INACTIVE = 1;

export const getUserStatusText = (status) => {
  if (status === ACTIVE) {
    return '激活';
  }
  if (status === INACTIVE) {
    return '冻结';
  }
  return '无';
};

export const getValueFromEvent = (value) => (value ? ACTIVE : INACTIVE);
export const normalize = eq(ACTIVE);
