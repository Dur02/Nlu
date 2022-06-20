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
import { getResourceTypeText, resourceTypeOptions } from 'shared/constants/resource-type';
import { getOperationTypeText } from 'shared/constants/operation-type';

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
    readAction: async (values) => {
      const {
        data: response,
      } = await readAllAuditLog(values);
      return {
        content: response.data,
        number: response.currentPage,
        size: response.pageSize,
        totalElements: response.total,
      };
    },
    query: {
      fields: [{
        dataKey: 'userName',
        label: '用户名',
      }],
    },
    filters: [{
      dataKey: 'resourceType',
      label: '资源类型',
      defaultValue: '',
      options: [{
        value: '',
        label: '全部',
      }, ...resourceTypeOptions],
    }],
    datePickers: [{
      dataKey: 'createTime',
      label: '起止日期',
      disabledDate: (date) => date.isAfter(new Date()),
    }],
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
    title: '资源类型',
    dataIndex: 'resourceType',
    render: getResourceTypeText,
  }, {
    title: '操作类型',
    dataIndex: 'operationType',
    render: getOperationTypeText,
  }, {
    title: '操作内容',
    dataIndex: 'contentDiffVos',
    render: (contentDiffVos) => (
      <>
        {map(({ contentDiff, id }) => (
          <div key={id}>{contentDiff}</div>
        ))(contentDiffVos)}
      </>
    ),
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
