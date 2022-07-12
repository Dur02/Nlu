import { Button, Popconfirm, Select } from 'antd';
import React from 'react';
// import { includes, findIndex, eq, nth } from 'lodash/fp';
import { includes, map, findIndex } from 'lodash/fp';
import { getVersionStatusText } from 'shared/constants/version-status';
import { time } from 'relient/formatters';

const { Option } = Select;

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
    render: (record) => (
      <>
        <Select
          defaultValue={
              findDefault(record) === -1
                ? ''
                : record.flag[findDefault(record)].id
          }
          onChange={
              (value) => {
                if (findDefault(record) !== -1) {
                  detach({
                    skillId: record.flag[findDefault(record)].id,
                    productId: product.id,
                    skillName: record.name,
                  });
                }
                if (value !== '') {
                  attach({
                    skillId: value,
                    productId: product.id,
                    skillName: record.name,
                  });
                }
              }
            }
          style={{
            width: '100px',
          }}
        >
          <Option value="">无选择</Option>
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
