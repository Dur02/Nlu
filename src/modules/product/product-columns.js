import { Button, Popconfirm } from 'antd';
import React from 'react';
import { includes } from 'lodash/fp';

const ATTACHED = 'ATTACHED';
const DETACHED = 'DETACHED';

export const getColumns = ({
  openEditor,
  onRemove,
  openSkillEditor,
  openVersion,
}) => [{
  title: 'ID',
  dataIndex: 'id',
}, {
  title: '名称',
  dataIndex: 'name',
}, {
  title: '创建时间',
  dataIndex: 'createTime',
}, {
  title: '创建人',
  dataIndex: 'createPerson',
}, {
  title: '操作',
  width: 300,
  render: (record) => (
    <>
      <Button type="primary" size="small" ghost onClick={() => openEditor(record)}>基础信息</Button>
      &nbsp;&nbsp;
      <Button type="primary" size="small" ghost onClick={() => openSkillEditor(record)}>编辑技能</Button>
      &nbsp;&nbsp;
      <Button type="primary" size="small" ghost onClick={() => openVersion(record)}>发布</Button>
      &nbsp;&nbsp;
      <Popconfirm
        title="确认删除吗？删除操作不可恢复"
        onConfirm={() => onRemove(record.id)}
      >
        <Button type="danger" size="small" ghost>删除</Button>
      </Popconfirm>
    </>
  ),
}];

export const getSkillEditorColumns = ({
  product,
  detach,
  attach,
}) => {
  const isAttached = (record) => includes(record.id)(product.skillIds);

  return [{
  //   title: '图标',
  //   dataIndex: 'iconPath',
  //   render: (iconPath) => <img alt="icon" src={iconPath} width={40} />,
  // }, {
    title: '名称',
    dataIndex: 'name',
  }, {
    title: '类别',
    dataIndex: 'category',
  }, {
    title: '状态',
    render: (record) => (isAttached(record) ? '已添加' : '未添加'),
    filterMultiple: false,
    filters: [{
      text: '全部',
      value: '',
    }, {
      text: '已添加',
      value: ATTACHED,
    }, {
      text: '未添加',
      value: DETACHED,
    }],
    onFilter: (value, record) => {
      if (value === ATTACHED) {
        return isAttached(record);
      }
      if (value === DETACHED) {
        return !isAttached(record);
      }
      return true;
    },
  }, {
    title: '操作',
    width: 100,
    render: (record) => (
      <>
        <Button
          type="primary"
          size="small"
          ghost
          onClick={() => {
            const operation = isAttached(record) ? detach : attach;
            operation({ skillId: record.id, productId: product.id });
          }}
        >
          {isAttached(record) ? '去掉' : '添加'}
        </Button>
      </>
    ),
  }];
};

export const versionColumns = [{
  title: '版本号',
  dataIndex: 'versionNum',
}, {
  title: '版本名称',
  dataIndex: 'versionName',
}, {
  title: '发布说明',
  dataIndex: 'description',
}, {
  title: '状态',
  dataIndex: 'pubState',
  render: (pubState) => (pubState === 0 ? '成功' : '失败'),
}, {
  title: '发布人',
  dataIndex: 'createPerson',
}, {
  title: '发布时间',
  dataIndex: 'createTime',
}];
