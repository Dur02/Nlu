import React from 'react';
import { AUDIT_LOG } from 'shared/constants/features';
import { map, prop } from 'lodash/fp';
import { readAll, readAllResourceType as readAllAuditResourceType } from 'shared/actions/audit';
import Log from './log';

export default () => [{
  path: '/log',
  feature: AUDIT_LOG,
  action: async ({ store: { dispatch } }) => {
    try {
      await dispatch(readAllAuditResourceType());
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
          current={currentPage - 1}
          size={pageSize}
        />,
      };
    } catch (e) {
      return {
        component: <Log
          ids={[]}
          total={0}
          current={0}
          size={0}
        />,
      };
    }
  },
}];
