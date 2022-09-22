import React from 'react';
import { INTENT_MAP } from 'shared/constants/features';
import { readAll, readInfo } from 'shared/actions/intent-map';
import { readMine as readProfile } from 'shared/actions/user';
import { map, prop } from 'lodash/fp';
import IntentMap from './intent-map';

export default () => [{
  feature: INTENT_MAP,
  action: async ({ store: { dispatch } }) => {
    try {
      await Promise.all([
        dispatch(readProfile()),
        dispatch(readInfo()),
      ]);
      const {
        data: {
          records,
          current,
          size,
          total,
        },
      } = await dispatch(readAll({
        pageSize: 10,
        page: 1,
      }));
      return {
        component: <IntentMap
          ids={map(prop('id'))(records)}
          total={total}
          current={current - 1}
          size={size}
        />,
      };
    } catch (e) {
      // ignore
    }
    return {
      component: <IntentMap
        ids={[]}
        total={0}
        current={0}
        size={0}
      />,
    };
  },
}];
