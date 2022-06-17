import { eq } from 'lodash/fp';

export const getUserStatusText = (status) => {
  if (status === 0) {
    return '激活';
  }
  if (status === 1) {
    return '冻结';
  }
  return '无';
};

export const ACTIVE = 0;
export const INACTIVE = 1;
export const formatNormalStatus = eq(ACTIVE);
export const parseNormalStatus = (value) => (value ? ACTIVE : INACTIVE);
