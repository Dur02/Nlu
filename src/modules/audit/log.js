import React from 'react';
import Layout from 'shared/components/layout';
import {
  Table,
} from 'antd';
import { useAPITable } from 'relient-admin/hooks';
import { readAll } from 'shared/actions/audit';
import { useAction } from 'relient/actions';
import { getEntity } from 'relient/selectors';
import { map } from 'lodash/fp';
import { time } from 'relient/formatters';
import { useSelector } from 'react-redux';
import { getAuditResourceTypeOptions } from 'shared/selectors';
import moment from 'moment';

const getDataSource = (state) => map((id) => getEntity(`auditLog.${id}`)(state));

const result = ({
  ids,
  total,
  current,
  size,
}) => {
  const readAllAuditLog = useAction(readAll);
  const {
    resourceTypeOptions,
  } = useSelector((state) => ({
    resourceTypeOptions: getAuditResourceTypeOptions(state),
  }));

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
      } = await readAllAuditLog({
        ...values,
        createTimeAfter: moment(new Date(values.createTimeAfter)).startOf('day').toISOString(),
        createTimeBefore: moment(new Date(values.createTimeBefore)).endOf('day').toISOString(),
        page: values.page + 1,
      });
      return {
        content: response.data,
        number: response.currentPage - 1,
        size: response.pageSize,
        totalElements: response.total,
      };
    },
    showReset: true,
    query: {
      fields: [{
        dataKey: 'userName',
        label: '用户名',
      }],
      searchWhenValueChange: false,
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
    title: '业务号',
    dataIndex: 'bizNo',
  }, {
    title: '资源ID',
    dataIndex: 'resourceId',
  }, {
    title: '资源类型',
    dataIndex: 'resourceTypeName',
    render: (resourceTypeName, { resourceType }) => resourceTypeName || resourceType,
  }, {
    title: '操作类型',
    dataIndex: 'operationType',
  }, {
    title: '描述',
    dataIndex: 'description',
  }, {
    title: 'IP',
    dataIndex: 'ip',
  }, {
    title: '操作时间',
    dataIndex: 'createTime',
    render: time(),
  }];

  const expandable = {
    expandedRowRender: (record) => {
      const expandedColumns = [{
        title: '日志ID',
        dataIndex: 'logId',
        width: 80,
      }, {
        title: '属性名',
        dataIndex: 'attributeName',
        width: 80,
      }, {
        title: '属性别名',
        dataIndex: 'attributeAlias',
        width: 120,
      }, {
        title: '属性类型',
        dataIndex: 'attributeType',
        width: 120,
      }, {
        title: '新值',
        dataIndex: 'newValue',
      }, {
        title: '旧值',
        dataIndex: 'oldValue',
      }, {
        title: '内容差异',
        dataIndex: 'contentDiff',
        width: 120,
      }];

      return (
        <Table
          dataSource={record.contentDiffVos}
          tableLayout="fixed"
          columns={expandedColumns}
          rowKey="id"
          pagination={false}
        />
      );
    },
    rowExpandable: ({ contentDiffVos }) => contentDiffVos && contentDiffVos.length > 0,
  };

  return (
    <Layout>
      {tableHeader}
      <Table
        tableLayout="fixed"
        dataSource={data}
        columns={columns}
        rowKey="id"
        expandable={expandable}
        pagination={pagination}
      />
    </Layout>
  );
};

result.displayName = __filename;

export default result;
