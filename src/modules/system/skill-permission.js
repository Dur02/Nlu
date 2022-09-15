import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from 'shared/components/layout';
import {
  Table,
  Modal,
  Button,
  message,
} from 'antd';
import { useDetails, useLocalTable } from 'relient-admin/hooks';
// import { PlainText } from 'relient-admin/components';
import { update as updateSkillPermission } from 'shared/actions/skill-permission';
import { getEntityArray } from 'relient/selectors';
import { getSkillOptions, getSkillsWithCodeKey } from 'shared/selectors';
import { flow, map, prop, join, difference, concat, find, propEq } from 'lodash/fp';
import { useAction } from 'relient/actions';

const result = () => {
  const {
    users,
    skillOptions,
  } = useSelector((state) => {
    const skillsWithCodeKey = getSkillsWithCodeKey(state);

    return {
      users: flow(
        getEntityArray('skillPermission'),
        map((skillPermission) => ({
          ...skillPermission,
          skillPermissionDisplay: flow(
            map((skillCode) => prop([skillCode, 'name'])(skillsWithCodeKey)),
            join(', '),
          )(skillPermission.skillCodes),
        })),
      )(state),
      skillOptions: getSkillOptions(state),
    };
  });

  const {
    detailsVisible: permissionVisible,
    openDetails: openPermission,
    closeDetails: closePermission,
    detailsItem: permissionItem,
  } = useDetails();

  const onUpdate = useAction(updateSkillPermission);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const {
    tableHeader,
    getDataSource,
    pagination,
    // openEditor,
  } = useLocalTable({
    query: {
      fields: [{
        dataKey: 'name',
        label: '名称',
      }, {
        dataKey: 'nickName',
        label: '昵称',
      }],
      fussy: true,
    },
    showReset: true,
  });

  const columns = [{
    title: '昵称',
    dataIndex: 'nickName',
  }, {
    title: '名称',
    dataIndex: 'name',
  }, {
    title: '技能权限',
    dataIndex: 'skillPermissionDisplay',
  }, {
    title: '操作',
    key: 'operations',
    width: 200,
    render: (record) => (
      <>
        <Button
          type="primary"
          onClick={() => {
            setSelectedRowKeys(record.skillCodes);
            openPermission(record);
          }}
          style={{ marginBottom: 10, marginRight: 10 }}
          size="small"
          ghost
        >
          编辑技能权限
        </Button>
      </>
    ),
  }];

  const permissionColumns = [{
    title: '名字',
    dataIndex: 'label',
  }, {
    title: '编号',
    dataIndex: 'value',
  }];

  const rowSelection = {
    onSelect: (_, __, selectedRows) => {
      setSelectedRowKeys(map(({ value }) => value)(selectedRows));
    },
    onSelectAll: (selected) => {
      if (selected) {
        setSelectedRowKeys(map(({ value }) => value)(skillOptions));
      } else {
        setSelectedRowKeys([]);
      }
    },
    onSelectNone: () => {
      setSelectedRowKeys([]);
    },
  };

  const getPermissionData = useCallback(
    () => {
      const temp = concat(
        difference(map(({ value }) => value)(skillOptions), permissionItem.skillCodes),
        permissionItem.skillCodes,
      );
      return flow(
        map((item) => ({ label: prop('label')(find(propEq('value', item))(skillOptions)) || item, value: item })),
      )(temp);
    }, [permissionItem],
  );

  const {
    tableHeader: skillTableHeader,
    getDataSource: getSkillData,
    // pagination: skillPagination,
    // openEditor,
  } = useLocalTable({
    query: {
      fields: [{
        dataKey: 'label',
        label: '名称',
      }],
      fussy: true,
    },
    showReset: true,
  });

  return (
    <Layout>
      {tableHeader}
      <Table
        dataSource={getDataSource(users)}
        columns={columns}
        rowKey="userId"
        pagination={pagination}
      />
      {
        permissionItem && (
          <Modal
            visible={permissionVisible}
            onCancel={closePermission}
            onOk={closePermission}
            footer={null}
            title={`编辑${permissionItem.nickName}技能权限`}
          >
            {skillTableHeader}
            <Table
              size="small"
              dataSource={getSkillData(getPermissionData())}
              // pagination={skillPagination}
              columns={permissionColumns}
              rowKey="value"
              rowSelection={{
                type: 'checkbox',
                selectedRowKeys,
                ...rowSelection,
              }}
            />
            <Button
              style={{
                position: 'relative',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
              onClick={async () => {
                try {
                  const { msg } = await onUpdate({
                    userId: permissionItem.userId,
                    skillCodes: selectedRowKeys,
                  });
                  message.success(msg);
                  closePermission();
                } catch (e) {
                  // message.error(e.msg);
                }
              }}
            >
              更改
            </Button>
          </Modal>
        )
      }
    </Layout>
  );
};

result.displayName = __filename;

export default result;
