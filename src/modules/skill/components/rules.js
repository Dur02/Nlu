import React, { useCallback, useState } from 'react';
import { func, number, array } from 'prop-types';
import { Button, Input, message, Popconfirm, Switch, Table } from 'antd';
// import { Button, Input, message, Popconfirm, Switch, Table, Checkbox } from 'antd';
import { prop, map, size, reject, eq } from 'lodash/fp';
import useStyles from 'isomorphic-style-loader/useStyles';
import { useLocalTable } from 'relient-admin/hooks';
import EditableInputCell from 'shared/components/editable-input-cell';

import IntentSlots from './intent-slots';
import s from './rules.less';

const { Search } = Input;
// const { Group } = Checkbox;

const result = ({
  createRule,
  updateRule,
  removeRule,
  updateIntent,
  createWords,
  updateWords,
  removeWords,
  intentId,
  skillId,
  rules,
  words,
  slots,
}) => {
  useStyles(s);

  const [selectedIds, setSelectedIds] = useState([]);
  const [newSentence, setNewSentence] = useState('');

  const onChangeSentence = useCallback(
    ({ target: { value } }) => setNewSentence(value),
    [],
  );

  const onCreateRule = useCallback(async () => {
    await createRule({ intentId, sentence: newSentence });
    message.success('添加说法成功，请设置槽位');
    setNewSentence('');
  }, [newSentence, intentId]);

  const onUpdateRule = useCallback(async (data) => {
    await updateRule(data);
    message.success('编辑成功');
  }, [newSentence, intentId]);

  const onRemoveRule = useCallback(async ({ id }) => {
    await removeRule({ id });
    message.success('删除成功');
  }, []);

  const onRemoveSelectedRules = useCallback(async () => {
    await Promise.all(map((id) => removeRule({ id }))(selectedIds));
    message.success('删除成功');
  }, [selectedIds]);

  // const onDuplexTypeChange = useCallback(async ({ id, duplexType, ruleConfig }) => {
  //   if (ruleConfig == null) {
  //     await updateRule({
  //       id,
  //       ruleConfig: {
  //         appGroundType: 0,
  //         duplexType,
  //         skillId,
  //       },
  //     });
  //   } else {
  //     await updateRule({
  //       id,
  //       ruleConfig: {
  //         ...ruleConfig,
  //         duplexType,
  //       },
  //     });
  //   }
  //   message.success('编辑成功');
  // }, [newSentence, intentId, skillId]);
  //
  // const onAppGroundTypeChange = useCallback(async ({ id, appGroundType, ruleConfig }) => {
  //   if (ruleConfig == null) {
  //     await updateRule({
  //       id,
  //       ruleConfig: {
  //         appGroundType,
  //         duplexType: 0,
  //         skillId,
  //       },
  //     });
  //   } else {
  //     await updateRule({
  //       id,
  //       ruleConfig: {
  //         ...ruleConfig,
  //         appGroundType,
  //       },
  //     });
  //   }
  //   message.success('编辑成功');
  // }, [newSentence, intentId, skillId]);

  const {
    tableHeader,
    getDataSource,
    pagination,
  } = useLocalTable({
    query: {
      fields: [{
        dataKey: 'sentence',
        label: '说法',
      }],
      fussy: true,
      width: 300,
    },
  });

  const columns = [{
    title: '已添加说法',
    dataIndex: 'sentence',
    // width: 150,
    // fixed: 'left',
    render: (sentence, { id }) => (
      <EditableInputCell
        value={sentence}
        onSubmit={(value) => onUpdateRule({ sentence: value, id })}
      />
    ),
  }, {
    //   title: 'app前台/app后台',
    //   width: 130,
    //   render: (record) => {
    //     const options = [
    //       { label: '后台', value: '后台' },
    //       { label: '前台', value: '前台' },
    //     ];
    //     return (
    //       <Group
    //         options={options}
    //         defaultValue={() => {
    //           if (!record.ruleConfig) {
    //             return [];
    //           }
    //           switch (record.ruleConfig.appGroundType) {
    //             case 1:
    //               return ['后台'];
    //             case 2:
    //               return ['前台'];
    //             case 3:
    //               return ['后台', '前台'];
    //             default:
    //               return [];
    //           }
    //         }}
    //         onChange={(checkedValue) => {
    //           const getAppFroundType = (checkedArray) => {
    //             if (checkedArray.length === 2) {
    //               return 3;
    //             }
    //             if (checkedArray.length === 0) {
    //               return 0;
    //             }
    //             return JSON.stringify(checkedArray) === JSON.stringify(['后台']) ? 1 : 2;
    //           };
    //           const appGroundType = getAppFroundType(checkedValue);
    //           return onAppGroundTypeChange({
    //             id: record.id,
    //             appGroundType,
    //             ruleConfig: record.ruleConfig,
    //           });
    //         }}
    //       />
    //     );
    //   },
    // }, {
    //   title: '全双工/半双工',
    //   width: 110,
    //   render: (record) => {
    //     const options = [
    //       { label: '全双工', value: '全双工' },
    //       { label: '半双工', value: '半双工' },
    //     ];
    //     return (
    //       <Group
    //         options={options}
    //         defaultValue={() => {
    //           if (!record.ruleConfig) {
    //             return [];
    //           }
    //           switch (record.ruleConfig.duplexType) {
    //             case 1:
    //               return ['半双工'];
    //             case 2:
    //               return ['全双工'];
    //             case 3:
    //               return ['半双工', '全双工'];
    //             default:
    //               return [];
    //           }
    //         }}
    //         onChange={(checkedValue) => {
    //           const getDuplexType = (checkedArray) => {
    //             if (checkedArray.length === 2) {
    //               return 3;
    //             }
    //             if (checkedArray.length === 0) {
    //               return 0;
    //             }
    //             return JSON.stringify(checkedArray) === JSON.stringify(['半双工']) ? 1 : 2;
    //           };
    //           const duplexType = getDuplexType(checkedValue);
    //           return onDuplexTypeChange({
    //             id: record.id,
    //             duplexType,
    //             ruleConfig: record.ruleConfig,
    //           });
    //         }}
    //       />
    //     );
    //   },
    // }, {
    //   title: '强说法/弱说法',
    //   width: 110,
    //   render: (record) => (
    //     <Switch
    //       checkedChildren="强说法"
    //       unCheckedChildren="弱说法"
    //       onChange={(checked) => onUpdateRule({ id: record.id, taskClassify: checked })}
    //       checked={prop('taskClassify')(record)}
    //     />
    //   ),
    // }, {
    title: '动态编译',
    width: 80,
    render: (record) => (
      <>
        <Switch
          style={{
            color: 'red',
          }}
          checkedChildren="是"
          unCheckedChildren="否"
          onChange={async (checked) => {
            if (record.ruleConfig) {
              await updateRule({
                id: record.id,
                ruleConfig: {
                  ...record.ruleConfig,
                  compileFlag: checked ? 1 : 2,
                  skillId,
                },
              });
            } else {
              await updateRule({
                id: record.id,
                ruleConfig: {
                  appGroundType: 0,
                  duplexType: 0,
                  compileFlag: checked ? 1 : 2,
                  skillId,
                },
              });
            }
            message.success('编辑成功');
          }}
          defaultChecked={() => {
            if (record.ruleConfig !== null && record.ruleConfig.compileFlag === 2) {
              return false;
            }
            return true;
          }}
        />
      </>
    ),
  }, {
    title: '操作',
    width: 150,
    // fixed: 'right',
    render: (record) => (
      <>
        <Switch
          checkedChildren="强说法"
          unCheckedChildren="弱说法"
          onChange={(checked) => onUpdateRule({ id: record.id, taskClassify: checked })}
          checked={prop('taskClassify')(record)}
        />
        &nbsp;&nbsp;
        <Popconfirm
          title="确认删除吗？删除操作不可恢复"
          onConfirm={() => onRemoveRule(record)}
        >
          <Button type="danger" size="small" ghost>删除</Button>
        </Popconfirm>
      </>
    ),
  }];

  const dataSource = getDataSource(rules);

  return (
    <div className={s.Root}>
      <div className={s.Rules}>
        <div>
          <Search
            onSearch={onCreateRule}
            onChange={onChangeSentence}
            value={newSentence}
            placeholder="请输入说法"
            enterButton="添加"
            className={s.Search}
          />
          <div className={s.TableHeader}>
            <div className={s.Selection}>
              当前选中 {size(selectedIds)} / {size(dataSource)}
              &nbsp;&nbsp;
              <Popconfirm
                title="确认删除吗？删除操作不可恢复"
                onConfirm={onRemoveSelectedRules}
              >
                <Button type="danger" ghost size="small">删除选中</Button>
              </Popconfirm>
            </div>
            {tableHeader}
          </div>
          <Table
            size="small"
            dataSource={dataSource}
            rowSelection={{
              onSelect: ({ id }, selected) => {
                if (selected) {
                  setSelectedIds([...selectedIds, id]);
                } else {
                  setSelectedIds(reject(eq(id))(selectedIds));
                }
              },
              onSelectAll: (selected) => {
                if (selected) {
                  setSelectedIds(map(prop('id'))(dataSource));
                } else {
                  setSelectedIds([]);
                }
              },
              selectedRowKeys: selectedIds,
            }}
            columns={columns}
            rowKey="id"
            pagination={pagination}
            // scroll={{
            //   x: 500,
            //   y: 500,
            // }}
          />
        </div>
      </div>
      <IntentSlots
        updateIntent={updateIntent}
        createWords={createWords}
        updateWords={updateWords}
        removeWords={removeWords}
        intentId={intentId}
        skillId={skillId}
        words={words}
        slots={slots}
      />
    </div>
  );
};

result.displayName = __filename;

result.propTypes = {
  createRule: func.isRequired,
  updateRule: func.isRequired,
  removeRule: func.isRequired,
  createWords: func.isRequired,
  updateWords: func.isRequired,
  removeWords: func.isRequired,
  updateIntent: func.isRequired,
  intentId: number.isRequired,
  skillId: number.isRequired,
  rules: array.isRequired,
  words: array.isRequired,
};

export default result;
