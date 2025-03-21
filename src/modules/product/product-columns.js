import { Button, Popconfirm, Select } from 'antd';
import React, { useState } from 'react';
import { includes, map, findIndex, get } from 'lodash/fp';
import { getVersionStatusText } from 'shared/constants/version-status';
import { time } from 'relient/formatters';
import { object, func } from 'prop-types';

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

const Operations = ({
  record,
  product,
  attach,
  detach,
  // findVersionDefault,
  // findLoadDefault,
}) => {
  const findVersionDefault = () => {
    const a = map((item) => includes(item.id)(product.skillIds))(record.skillVersions);
    return findIndex((o) => o === true)(a);
  };

  const findLoadDefault = () => {
    if (findVersionDefault(record) === -1) {
      // setPreLoadValue(false);
      return false;
    }
    return get(`${record.skillVersions[findVersionDefault(record)].id}`)(product.preLoadStatus);
  };

  const [preLoadValue, setPreLoadValue] = useState(findLoadDefault());

  return (
    <>
      <Select
        defaultValue={
          findVersionDefault(record) === -1
            ? ''
            : record.skillVersions[findVersionDefault(record)].id
        }
        onChange={
          async (value) => {
            if (findVersionDefault(record) !== -1) {
              await detach({
                skillId: record.skillVersions[findVersionDefault(record)].id,
                productId: product.id,
                skillName: record.name,
              });
            }
            if (value !== '') {
              await attach({
                skillId: value,
                productId: product.id,
                skillName: record.name,
                preLoad: preLoadValue,
              });
            } else {
              setPreLoadValue(false);
            }
          }
        }
        style={{ width: '100px' }}
      >
        <Option value="">无选择</Option>
        {
          map((item) => (item.pubState === 1 && item.modelFile !== ''
            ? (
              <Option
                key={item.version}
                value={item.id}
              >
                {item.version}
              </Option>
            ) : ''
          ))(record.skillVersions)
        }
      </Select>
      &nbsp;&nbsp;
      <Select
        // defaultValue={findLoadDefault(record)}
        value={preLoadValue}
        onChange={async (value) => {
          await detach({
            skillId: record.skillVersions[findVersionDefault(record)].id,
            productId: product.id,
            skillName: record.name,
          });
          await attach({
            skillId: record.skillVersions[findVersionDefault(record)].id,
            productId: product.id,
            skillName: record.name,
            preLoad: value,
          });
          setPreLoadValue(value);
        }}
        style={{ width: '100px' }}
        disabled={findVersionDefault(record) === -1}
      >
        <Option value={false}>懒加载</Option>
        <Option value>预加载</Option>
      </Select>
    </>
  );
};

Operations.propTypes = {
  record: object.isRequired,
  product: object.isRequired,
  attach: func.isRequired,
  detach: func.isRequired,
  // findVersionDefault: func.isRequired,
  // findLoadDefault: func.isRequired,
};

export const getSkillEditorColumns = ({
  product,
  detach,
  attach,
}) => [{
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
  width: 240,
  filters: [
    {
      text: '已选择',
      value: true,
    },
    {
      text: '未选择',
      value: false,
    },
  ],
  onFilter: (value, record) => {
    switch (value) {
      case true:
        return includes(record.code)(product.skillCodes);
      default:
        return !includes(record.code)(product.skillCodes);
    }
  },
  render: (record) => (
    <Operations
      record={record}
      product={product}
      attach={attach}
      detach={detach}
      // findVersionDefault={findVersionDefault}
      // findLoadDefault={findLoadDefault}
    />
  ),
}];

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
