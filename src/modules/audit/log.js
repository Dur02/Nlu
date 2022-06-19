import React from 'react';
import Layout from 'shared/components/layout';
import {
  Table,
} from 'antd';
import { useAPITable } from 'relient-admin/hooks';
import { readAll } from 'shared/actions/audit-log';
import { useAction } from 'relient/actions';
import { getEntity } from 'relient/selectors';
import { map } from 'lodash/fp';
import { time } from 'relient/formatters';

const getDataSource = (state) => map((id) => getEntity(`auditLog.${id}`)(state));

const result = ({
  ids,
  total,
  current,
  size,
}) => {
  const readAllAuditLog = useAction(readAll);

  const {
    tableHeader,
    pagination,
    data,
  } = useAPITable({
    paginationInitialData: {
      ids,
      total,
      current,
      size,
    },
    getDataSource,
    readAction: readAllAuditLog,
    query: {
      fields: [{
        dataKey: 'userName',
        label: '用户名',
      }],
    },
    datePickers: {
      dataKey: 'createTime',
      label: '起止日期',
    },
  });

  const columns = [{
    title: '用户ID',
    dataIndex: 'userId',
  }, {
    title: '用户名',
    dataIndex: 'userName',
  }, {
    title: '技能ID',
    dataIndex: 'skillId',
  }, {
    title: '技能Code',
    dataIndex: 'skillCode',
  }, {
    title: '技能版本',
    dataIndex: 'skillVersion',
  }, {
    title: '资源ID',
    dataIndex: 'resourceId',
  }, {
  //   title: '资源类型',
  //   dataIndex: 'resourceType',
  // }, {
    title: '操作类型',
    dataIndex: 'operationType',
  }, {
    title: '操作内容',
    dataIndex: 'contentDiff',
  }, {
    title: 'IP',
    dataIndex: 'ip',
  }, {
    title: '创建时间',
    dataIndex: 'createTime',
    render: time(),
  }];

  return (
    <Layout>
      {tableHeader}
      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        pagination={pagination}
      />
    </Layout>
  );
};

result.displayName = __filename;

export default result;
