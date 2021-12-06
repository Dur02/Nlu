import React, { useCallback, useState } from 'react';
import { func, number, array } from 'prop-types';
import { Button, Drawer, Input, message, Popconfirm, Switch, Table } from 'antd';
import { prop } from 'lodash/fp';
import useStyles from 'isomorphic-style-loader/useStyles';
import { useLocalTable } from 'relient-admin/hooks';
// import { SLOT } from 'shared/constants/content-type';
// import classNames from 'classnames';

import IntentSlots from './intent-slots';
import s from './rules.less';

const { Search } = Input;
// const { Item } = Menu;

// const rowExpandable = ({ slots }) => slots && slots.length > 0;

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

  const [newSentence, setNewSentence] = useState('');
  // const [visibleRuleMenuId, setVisibleRuleMenuId] = useState(null);
  // const [newSlot, setNewSlot] = useState({});
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

  // const onRemoveSlot = useCallback(async ({ index, ruleId }) => {
  //   const selectedRuleSlots = flow(find(propEq('id', ruleId)), prop('slots'))(rules);
  //   await updateRule({ id: ruleId, slots: reject(propEq('index', index))(selectedRuleSlots) });
  // }, [intentId]);

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
  });

  // const onMouseUpOnSentence = useCallback(({ currentTarget }) => {
  //   const selection = window.getSelection();
  //   if (currentTarget.contains(selection.anchorNode) && selection.type === 'Range') {
  //     const selectionStart = Number(selection.anchorNode.parentNode.dataset.index);
  //     const selectionEnd = Number(selection.focusNode.parentNode.dataset.index);
  //     if (isNaN(selectionStart) || isNaN(selectionEnd)) {
  //       message.error('请勿交叉选择');
  //       return;
  //     }
  //     let start;
  //     let end;
  //     if (selectionStart > selectionEnd) {
  //       start = selectionEnd;
  //       end = selectionStart;
  //     } else {
  //       start = selectionStart;
  //       end = selectionEnd;
  //     }
  //     const ruleId = Number(currentTarget.dataset.id);
  //     if (!flow(
  //       find(propEq('id', ruleId)),
  //       prop('slots'),
  //       every(({ pos: [slotStart, slotEnd] }) => start > slotEnd || end < slotStart),
  //     )(rules)) {
  //       message.error('请勿交叉选择');
  //       return;
  //     }
  //     setVisibleRuleMenuId(ruleId);
  //     setNewSlot({ pos: [start, end], value: selection.toString() });
  //   }
  // }, [rules]);

  const columns = [{
    title: '已添加说法',
    dataIndex: 'sentence',
    // render: (sentenceDisplay, { id }) => {
    //   const ruleSlots = flow(
    //     find(propEq('id', id)),
    //     prop('slots'),
    //   )(rules);
    //   const availableRuleSlots = reject(
    //     ({ name }) => any((ruleSlot) => ruleSlot.name === name)(ruleSlots),
    //   )(slots);
    //   const slotsMenu = (
    //     <Menu
    //       onClick={async ({
    //         key,
    //       }) => {
    //         await onUpdateRule({ id, slots: [{ ...newSlot, name: key }, ...(ruleSlots || [])] });
    //         setVisibleRuleMenuId(null);
    //       }}
    //       className={s.SlotsMenu}
    //     >
    //       {map(({ name }) => (
    //         <Item key={name}>{name}</Item>
    //       ))(availableRuleSlots)}
    //       {availableRuleSlots.length === 0 && <Item key="_none" disabled>无可用语义槽</Item>}
    //     </Menu>
    //   );
    //
    //   return (
    //     <>
    //       {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
    //       <div
    //         // onMouseUp={onMouseUpOnSentence}
    //         data-id={id}
    //       >
    //         {map(({ type, value, index, name }) => (
    //           <span
    //             className={classNames({ [s.ContentSlot]: type === SLOT })}
    //             data-index={index}
    //             key={type === SLOT ? name : index}
    //           >
    //             {value}
    //           </span>
    //         ))(sentenceDisplay)}
    //       </div>
    //       <Tooltip
    //         title={slotsMenu}
    //         color="white"
    //         visible={id === visibleRuleMenuId}
    //         onVisibleChange={(visible) => {
    //           if (!visible && id === visibleRuleMenuId) {
    //             setVisibleRuleMenuId(null);
    //           }
    //         }}
    //         placement="bottom"
    //         trigger="contextMenu"
    //       >
    //         <div style={{ width: '100%' }} />
    //       </Tooltip>
    //     </>
    //   );
    // },
  }, {
    title: '操作',
    width: 140,
    render: (record) => (
      <>
        <div style={{ marginBottom: 8 }}>
          <Switch
            checkedChildren="强说法"
            unCheckedChildren="弱说法"
            onChange={(checked) => onUpdateRule({ id: record.id, taskClassify: checked })}
            checked={prop('taskClassify')(record)}
          />
        </div>
        <div>
          <Button type="primary" size="small" ghost onClick={() => openEditor(record)}>编辑</Button>
          &nbsp;
          <Popconfirm
            title="确认删除吗？删除操作不可恢复"
            onConfirm={() => onRemoveRule(record)}
          >
            <Button type="danger" size="small" ghost>删除</Button>
          </Popconfirm>
        </div>
      </>
    ),
  }];

  // const nestedColumns = [{
  //   title: '语义槽',
  //   dataIndex: 'name',
  // }, {
  //   title: '取值',
  //   dataIndex: 'value',
  // }, {
  //   title: '操作',
  //   width: 80,
  //   render: (record) => (
  //     <Popconfirm
  //       title="确认删除吗？删除操作不可恢复"
  //       onConfirm={() => onRemoveSlot(record)}
  //     >
  //       <Button type="danger" size="small" ghost>删除</Button>
  //     </Popconfirm>
  //   ),
  // }];

  // const expandedRowRender = (record) => (
  //   <Table
  //     columns={nestedColumns}
  //     dataSource={record.slots}
  //     rowKey="name"
  //     pagination={false}
  //   />
  // );

  return (
    <div className={s.Root}>
      <div className={s.Rules}>
        <Search
          onSearch={onCreateRule}
          onChange={onChangeSentence}
          value={newSentence}
          placeholder="请输入说法"
          enterButton="添加"
          className={s.Search}
        />
        <div>
          {tableHeader}
          <Table
            dataSource={getDataSource(rules)}
            columns={columns}
            rowKey="id"
            pagination={pagination}
            // expandable={{
            //   expandedRowRender,
            //   rowExpandable,
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
