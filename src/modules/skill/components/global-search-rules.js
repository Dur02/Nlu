import React, { useCallback } from 'react';
import { func, array } from 'prop-types';
import { Button, Drawer, message, Popconfirm, Switch, Table } from 'antd';
import { prop } from 'lodash/fp';
import useStyles from 'isomorphic-style-loader/useStyles';
import { useLocalTable } from 'relient-admin/hooks';

// import IntentSlots from './intent-slots';
// eslint-disable-next-line css-modules/no-unused-class
import s from './rules.less';

const result = ({
  onChangeIntentId,
  updateRule,
  removeRule,
  rules,
  setGlobalSearch,
}) => {
  useStyles(s);

  const onUpdateRule = useCallback(async (data) => {
    await updateRule(data);
    message.success('编辑成功');
  }, []);
  const onRemoveRule = useCallback(async ({ id }) => {
    await removeRule({ id });
    message.success('删除成功');
  }, []);

  const {
    tableHeader,
    getDataSource,
    pagination,
    openEditor,
  } = useLocalTable({
    query: {
      fields: [{
        dataKey: 'sentence',
        label: '说法',
      }],
      fussy: true,
    },
    editor: {
      title: '编辑说法',
      onSubmit: updateRule,
      component: Drawer,
      fields: [{
        label: '内容',
        name: 'sentence',
      }],
    },
    pagination: {
      pageSize: 10,
    },
  });

  const columns = [
    { title: '已添加说法', dataIndex: 'sentence' },
    { title: '所属意图',
      render: (record) => (
        <>
          {/* eslint-disable-next-line max-len */}
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,jsx-a11y/no-static-element-interactions */}
          <a
            type="primary"
            size="small"
            onClick={
              () => {
                setGlobalSearch(false);
                onChangeIntentId({ id: record.intentId, name: record.name });
              }
            }
          >
            {record.name}
          </a>
        </>
      ),
    },
    {
      title: '操作',
      width: 240,
      render: (record) => (
        <>
          <Switch
            checkedChildren="强说法"
            unCheckedChildren="弱说法"
            onChange={(checked) => onUpdateRule({ id: record.id, taskClassify: checked })}
            checked={prop('taskClassify')(record)}
          />
          &nbsp;
          <Button type="primary" size="small" ghost onClick={() => openEditor(record)}>编辑</Button>
          &nbsp;
          <Popconfirm
            title="确认删除吗？删除操作不可恢复"
            onConfirm={() => onRemoveRule(record)}
          >
            <Button type="danger" size="small" ghost>删除</Button>
          </Popconfirm>
        </>
      ),
    }];

  return (
    <div className={s.Root}>
      <div className={s.Rules}>
        <div>
          {tableHeader}
          <Table
            dataSource={getDataSource(rules)}
            columns={columns}
            rowKey="id"
            pagination={pagination}
          />
        </div>
      </div>
    </div>
  );
};

result.displayName = __filename;

result.propTypes = {
  onChangeIntentId: func.isRequired,
  updateRule: func.isRequired,
  removeRule: func.isRequired,
  rules: array.isRequired,
  setGlobalSearch: func.isRequired,
};

export default result;
