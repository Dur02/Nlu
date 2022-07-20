import React, { useCallback, useState } from 'react';
import { Button, Popconfirm, Dropdown, Menu, Space, message, Spin } from 'antd';
import { getVersionStatusText } from 'shared/constants/version-status';
import { time } from 'relient/formatters';
import { includes, map, drop } from 'lodash/fp';
import { DownOutlined } from '@ant-design/icons';
import { func, number, string, shape, array } from 'prop-types';

const { Item } = Menu;

const hasPermission = async (readProfile, code) => {
  try {
    const { data: { skillCodes } } = await readProfile();
    if (includes(code)(skillCodes)) {
      return true;
    }
    message.error('该账号没有这个技能的权限');
    return false;
  } catch (e) {
    message.error('出错了，请重试，或联系管理员');
    return false;
  }
};

const Operations = ({
  readProfile,
  push,
  record,
  createDraft,
  openVersion,
  onRemove,
  openWordGraph,
  // exportYaml,
}) => {
  const [loading, setLoading] = useState(false);

  const onEdit = useCallback(async () => {
    setLoading(true);
    if (await hasPermission(readProfile, record.code)) {
      push(`/skill/${record.id}`);
    } else {
      setLoading(false);
    }
  }, [readProfile, record.code, record.id, setLoading]);

  const onCreateDraft = useCallback(async () => {
    setLoading(true);
    if (await hasPermission(readProfile, record.code)) {
      await createDraft({ skillId: record.id });
      message.success('拷贝技能成功，可以进行技能编辑');
    }
    setLoading(false);
  }, [readProfile, record.code, record.id, setLoading]);

  const onEditHistory = useCallback((item) => async () => {
    setLoading(true);
    if (await hasPermission(readProfile, item.code)) {
      push(`/skill/${item.id}`);
    } else {
      setLoading(false);
    }
  }, [readProfile, setLoading]);

  const onPublish = useCallback(async () => {
    setLoading(true);
    if (await hasPermission(readProfile, record.code)) {
      openVersion(record);
    }
    setLoading(false);
  }, [readProfile, record, setLoading]);

  // const onExport = useCallback(async () => {
  //   setLoading(true);
  //   const a = await exportYaml({ skillId: record.id });
  //   // eslint-disable-next-line no-console
  //   console.log(a);
  //   setLoading(false);
  // }, [readProfile, record, setLoading]);

  const onRemoveSkill = useCallback(async () => {
    setLoading(true);
    if (await hasPermission(readProfile, record.code)) {
      onRemove(record.id);
    }
    setLoading(false);
  }, [readProfile, record.id, record.code, setLoading]);

  return (
    <Spin spinning={loading}>
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
          <Button
            type="primary"
            size="small"
            ghost
            onClick={onEdit}
          >
            编辑技能
          </Button>
          &nbsp;&nbsp;
        </>
      ) : (
        <>
          <Button
            type="primary"
            size="small"
            ghost
            onClick={onCreateDraft}
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
              <Item key={item.id} onClick={onEditHistory(item)}>
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
      <Button type="primary" size="small" ghost onClick={onPublish}>发布</Button>
      {/* &nbsp;&nbsp; */}
      {/* <Button type="primary" size="small" ghost onClick={onExport}>导出</Button> */}
      &nbsp;&nbsp;
      <Button type="primary" size="small" ghost onClick={() => openWordGraph(record)}>词图</Button>
      &nbsp;&nbsp;
      <Popconfirm
        title="确认删除吗？删除操作不可恢复"
        onConfirm={onRemoveSkill}
      >
        <Button type="danger" size="small" ghost>删除</Button>
      </Popconfirm>
    </Spin>
  );
};

Operations.propTypes = {
  readProfile: func.isRequired,
  push: func.isRequired,
  openWordGraph: func.isRequired,
  openVersion: func.isRequired,
  onRemove: func.isRequired,
  createDraft: func.isRequired,
  skillVersions: array,
  record: shape({
    id: number,
    isDraft: number,
    code: string,
  }),
  // exportYaml: func.isRequired,
};

export const getColumns = ({
  // openEditor,
  onRemove,
  openVersion,
  openWordGraph,
  createDraft,
  push,
  readProfile,
  exportYaml,
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
  width: 380,
  render: (record) => (
    <Operations
      record={record}
      createDraft={createDraft}
      onRemove={onRemove}
      openVersion={openVersion}
      openWordGraph={openWordGraph}
      push={push}
      readProfile={readProfile}
      exportYaml={exportYaml}
    />
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
