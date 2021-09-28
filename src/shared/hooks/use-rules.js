import { createPriceRule, createPositiveNumberRule, createSameAsRule } from 'relient-admin/form/rules';
import { useI18N } from 'relient/i18n';
import { useMemo } from 'react';

export default () => {
  const i18n = useI18N();
  return useMemo(() => ({
    sameAsRule: createSameAsRule(i18n)('输入与之前不同'),
    positiveNumberRule: createPositiveNumberRule(i18n)('请输入正数'),
    priceRule: createPriceRule(i18n)('价格输入有误'),
    phoneNumber: { min: 11, type: 'string' },
    password: { min: 6, type: 'string' },
  }), [i18n]);
};
