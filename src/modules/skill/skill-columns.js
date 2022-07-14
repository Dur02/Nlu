import React, { useState } from 'react';
import { Button, Popconfirm, Dropdown, Menu, Space, message } from 'antd';
import { getVersionStatusText } from 'shared/constants/version-status';
import { time } from 'relient/formatters';
import { includes, map, drop } from 'lodash/fp';
import { DownOutlined } from '@ant-design/icons';
import { func, number, string } from 'prop-types';

const { Item } = Menu;

const EditButton = ({
  readProfile,
  code,
  id,
  push,
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      type="primary"
      size="small"
      ghost
      loading={loading}
      onClick={async () => {
        setLoading(true);
        try {
          const { data: { skillCodes } } = await readProfile();
          if (includes(code)(skillCodes)) {
            push(`/skill/${id}`);
          } else {
            message.error('该账号没有这个技能的权限');
          }
        } catch (e) {
          setLoading(false);
        }
      }}
    >
      编辑技能
    </Button>
  );
};

EditButton.propTypes = {
  readProfile: func.isRequired,
  code: string,
  id: number,
  push: func.isRequired,
};

export const getColumns = ({
  // openEditor,
  onRemove,
  openVersion,
  openWordGraph,
  createDraft,
  creatingDraftSkillIds,
  push,
  readProfile,
}) => [{
  //   title: '图标',
  //   dataIndex: 'iconPath',
  //   width: 40,
  //   render: (iconPath) => <img alt="icon" src={iconPath} width={40} />,
  // }, {
  title: '名称',
  dataIndex: 'name',
}, {
  title: '类别',
  dataIndex: 'category',
}, {
  title: '最新版本',
  dataIndex: 'version',
}, {
  title: '操作',
  width: 400,
  render: (record) => (
    <>
      {/* <Button */}
      {/*  type="primary" */}
      {/*  size="small" */}
      {/*  ghost */}
      {/*  onClick={() => openEditor(record)} */}
      {/* > */}
      {/*  基础信息 */}
      {/* </Button> */}
      {/* &nbsp;&nbsp; */}
      {record.isDraft ? (
        <>
          <EditButton readProfile={readProfile} push={push} id={record.id} code={record.code} />
          &nbsp;&nbsp;
        </>
      ) : (
        <>
          <Button
            type="primary"
            size="small"
            ghost
            onClick={() => createDraft(record.id)}
            loading={includes(record.id)(creatingDraftSkillIds)}
          >
            拷贝技能
          </Button>
          &nbsp;&nbsp;
        </>
      )}
      <Dropdown
        overlay={(
          <Menu>
            {map((item) => (
              <Item key={item.id} onClick={() => push(`/skill/${item.id}`)}>
                {item.version}
              </Item>
            ))(drop(1)(record.skillVersions))}
          </Menu>
        )}
        placement="bottom"
      >
        <Button type="primary" size="small" ghost>
          <Space>
            历史版本
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
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

export const versionColumns = [{
  title: '版本号',
  dataIndex: 'version',
}, {
  title: '发布说明',
  dataIndex: 'note',
}, {
  title: '状态',
  dataIndex: 'status',
  render: getVersionStatusText,
}, {
  title: '发布人',
  dataIndex: 'userName',
}, {
  title: '发布时间',
  dataIndex: 'createDate',
  render: time(),
}];
