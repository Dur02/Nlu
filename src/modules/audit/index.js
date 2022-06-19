import React from 'react';
import { AUDIT_LOG } from 'shared/constants/features';
import { map, prop } from 'lodash/fp';
import { readAll } from 'shared/actions/audit-log';
import Log from './log';

export default () => [{
  path: '/log',
  feature: AUDIT_LOG,
  action: async ({ store: { dispatch } }) => {
    const {
      data: {
        data,
        currentPage,
        pageSize,
        total,
      },
    } = await dispatch(readAll({
      size: 10,
      page: 1,
    }));
    return {
      component: <Log
        ids={map(prop('id'))(data)}
        total={total}
        current={currentPage}
        size={pageSize}
      />,
    };
  },
}];
