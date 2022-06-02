import { Button, Popconfirm, Select } from 'antd';
import React from 'react';
// import { includes, findIndex, eq, nth } from 'lodash/fp';
import { includes, map, findIndex } from 'lodash/fp';
import { getVersionStatusText } from 'shared/constants/version-status';
import { time } from 'relient/formatters';

const { Option } = Select;

const ATTACHED = 'ATTACHED';
const DETACHED = 'DETACHED';

export const getColumns = ({
  openEditor,
  onRemove,
  openSkillEditor,
  openVersion,
  openWordGraph,
}) => [{
  title: 'ID',
  dataIndex: 'id',
}, {
  title: '名称',
  dataIndex: 'name',
}, {
  title: '创建时间',
  dataIndex: 'createTime',
  render: time(),
}, {
  title: '创建人',
  dataIndex: 'createPerson',
}, {
  title: '操作',
  width: 380,
  render: (record) => (
    <>
      <Button type="primary" size="small" ghost onClick={() => openEditor(record)}>基础信息</Button>
      &nbsp;&nbsp;
      <Button type="primary" size="small" ghost onClick={() => openSkillEditor(record)}>编辑技能</Button>
      &nbsp;&nbsp;
      <Button type="primary" size="small" ghost onClick={() => openVersion(record)}>发布</Button>
      &nbsp;&nbsp;
      <Button type="primary" size="small" ghost onClick={() => openWordGraph(record)}>词图</Button>
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
  const isAttached = (record) => {
    const a = map((item) => {
      if (includes(item.id)(product.skillIds)) {
        return true;
      }
      return false;
    })(record.flag);
    return includes(true)(a);
  };

  const findDefault = (record) => {
    const a = map((item) => {
      if (includes(item.id)(product.skillIds)) {
        return true;
      }
      return false;
    })(record.flag);
    return findIndex((o) => o === true)(a);
  };

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
    title: '版本',
    // shouldCellUpdate: (record, prevRecord) => {
    //   console.log(record);
    //   console.log(prevRecord);
    //   if (record.mark !== prevRecord.mark) {
    //     return true;
    //   }
    //   return false;
    // },
    render: (record) => {
      /* eslint no-param-reassign: ["error", { "props": false }] */
      record.mark = findDefault(record) === -1 ? record.id : record.flag[findDefault(record)].id;
      return (
        <>
          <Select
            defaultValue={
              findDefault(record) === -1
                ? record.id
                : record.flag[findDefault(record)].id
            }
            onChange={
              (value) => {
                // console.log(product)
                /* eslint no-param-reassign: ["error", { "props": false }] */
                record.mark = value;
              }
            }
            disabled={isAttached(record)}
            style={{
              width: '100px',
            }}
          >
            {
              map((item) => (
                <Option
                  key={item.version}
                  value={item.id}
                >
                  {item.version}
                </Option>
              ))(record.flag)
            }
          </Select>
        </>
      );
    },
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
            if (isAttached(record)) {
              detach({
                // skillId: nth(findIndex(eq(record.code))(product.skillCodes))(product.skillIds),
                skillId: record.mark,
                productId: product.id,
              });
            } else {
              attach({
                skillId: record.mark,
                productId: product.id,
              });
            }
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
  render: getVersionStatusText,
}, {
  title: '发布人',
  dataIndex: 'createPerson',
}, {
  title: '发布时间',
  dataIndex: 'createTime',
  render: time(),
}];
