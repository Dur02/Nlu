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
  openExport,
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

  const onExport = useCallback(async () => {
    setLoading(true);
    if (await hasPermission(readProfile, record.code)) {
      openExport(record);
    }
    setLoading(false);
    // setLoading(true);
    // const result = await exportYaml({ skillId: record.id });
    // // eslint-disable-next-line no-console
    // console.log(result);
    // const blob = new Blob([result.data], { type: 'application/force-download ' });
    // console.log(blob);
    // // 创建新的URL并指向File对象或者Blob对象的地址
    // const blobURL = window.URL.createObjectURL(blob);
    // console.log(blobURL);
    // // 创建a标签，用于跳转至下载链接
    // const tempLink = document.createElement('a');
    // tempLink.style.display = 'none';
    // tempLink.href = blobURL;
    // tempLink.setAttribute('download', '随便.yaml');
    // // 兼容：某些浏览器不支持HTML5的download属性
    // if (typeof tempLink.download === 'undefined') {
    //   tempLink.setAttribute('target', '_blank');
    // }
    // // 挂载a标签
    // document.body.appendChild(tempLink);
    // tempLink.click();
    // document.body.removeChild(tempLink);
    // // 释放blob URL地址
    // window.URL.revokeObjectURL(blobURL);
    // setLoading(false);
  }, [readProfile, record, setLoading]);

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
       &nbsp;&nbsp;
      <Button type="primary" size="small" ghost onClick={onExport}>导出</Button>
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
  openExport: func.isRequired,
};

export const getColumns = ({
  // openEditor,
  onRemove,
  openVersion,
  openWordGraph,
  createDraft,
  push,
  readProfile,
  openExport,
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
  width: 430,
  render: (record) => (
    <Operations
      record={record}
      createDraft={createDraft}
      onRemove={onRemove}
      openVersion={openVersion}
      openWordGraph={openWordGraph}
      push={push}
      readProfile={readProfile}
      openExport={openExport}
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
