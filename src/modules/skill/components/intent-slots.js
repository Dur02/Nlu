import React, { useCallback, useState } from 'react';
import { func, number, array } from 'prop-types';
import { Drawer, message, Table, Switch, Button } from 'antd';
import { map, any, flow, prop, reject, propEq, eq, find } from 'lodash/fp';
import { useLocalTable } from 'relient-admin/hooks';
import useStyles from 'isomorphic-style-loader/useStyles';
import { booleanSwitchOptions } from 'shared/constants/boolean';
import columns from './intent-slots-columns';
import WordsList from './words-list';
import Prompt from './intent-slot-prompt';
import WordsInline from './words-inline';
import QuickCreateWords from './quick-create-words';
import s from './intent-slots.less';

const result = ({
  updateIntent,
  createWords,
  updateWords,
  removeWords,
  intentId,
  skillId,
  words,
  slots,
}) => {
  useStyles(s);

  const [promptEditorSlotName, setPromptEditorSlotName] = useState(null);
  const [wordsDrawerOpen, setWordsDrawerOpen] = useState(false);
  const [createWordOpen, setCreateWordOpen] = useState(false);
  const [slotName, setSlotName] = useState('');

  const onCreateSlot = useCallback(
    (values) => {
      if (any(flow(prop('name'), eq(values.name)))(slots)) {
        message.error('取值已存在');
        throw Error('取值已存在');
      }
      return updateIntent({ id: intentId, slots: [values, ...slots] });
    },
    [intentId, slots],
  );

  const onUpdatePrompt = useCallback(async (value) => {
    await updateIntent({
      id: intentId,
      slots: map((slot) => {
        if (slot.name === promptEditorSlotName) {
          return {
            ...slot,
            prompt: value,
          };
        }
        return slot;
      })(slots),
    });
    message.success('编辑成功');
    setPromptEditorSlotName(null);
  }, [promptEditorSlotName, intentId]);
  const onClosePromptEditor = useCallback(() => setPromptEditorSlotName(null), []);

  const onUpdateSlot = useCallback(
    (values, _, editItem) => {
      const { name } = values;
      if (any(flow(
        prop('name'),
        (existingName) => existingName !== editItem.name && existingName === name,
      ))(slots)) {
        message.error('取值已存在');
        throw Error('取值已存在');
      }
      return updateIntent({
        id: intentId,
        slots: map((slot) => {
          if (slot.name === editItem.name) {
            return values;
          }
          return slot;
        })(slots),
      });
    },
    [intentId, slots],
  );

  const onRemoveSlot = useCallback(async ({ name }) => {
    await updateIntent({
      id: intentId,
      slots: reject(propEq('name', name))(slots),
    });
    message.success('删除成功');
  }, [intentId, slots]);

  const {
    tableHeader,
    getDataSource,
    // pagination,
  } = useLocalTable({
    query: {
      fussy: true,
      fields: [{
        dataKey: 'name',
        label: '名称',
      }, {
        dataKey: 'lexiconsNamesJoint',
        label: '词库',
      }],
      width: 200,
    },
    createButton: {
      text: '创建语义槽',
      size: 'middle',
    },
    creator: {
      title: '创建语义槽',
      onSubmit: onCreateSlot,
      fields: [{
        label: '名称',
        name: 'name',
        type: 'text',
        rules: [{ required: true }],
      }, {
        label: '是否必须',
        name: 'required',
        component: Switch,
        valuePropName: 'checked',
        ...booleanSwitchOptions,
      }, {
        label: '是否有效槽位',
        name: 'isSlot',
        component: Switch,
        valuePropName: 'checked',
        ...booleanSwitchOptions,
      }, {
        label: '词库',
        name: 'lexiconsNames',
        rules: [{ required: true }],
        component: WordsList,
        words,
        createWords,
        updateWords,
        removeWords,
        skillId,
      }],
      component: Drawer,
      width: 600,
    },
  });
  // console.log('intent-slots.js');

  return (
    <div className={s.Root}>
      <Button
        type="primary"
        style={{
          position: 'absolute',
          left: 120,
        }}
        onClick={() => setCreateWordOpen(true)}
      >
        创建词库
      </Button>
      {tableHeader}
      <Table
        className={s.IntentSlotTable}
        size="small"
        dataSource={getDataSource(slots)}
        columns={columns({
          onUpdateSlot,
          onRemoveSlot,
          setPromptEditorSlotName,
          words,
          createWords,
          updateWords,
          removeWords,
          skillId,
        })}
        onRow={(record) => ({
          onDoubleClick: () => {
            setWordsDrawerOpen(true);
            setSlotName(record.name);
          },
        })}
        rowKey="name"
        // pagination={pagination}
        pagination={false}
        scroll={{
          // x: 500,
          y: 500,
        }}
      />
      <Drawer
        title="编辑提问"
        visible={!!promptEditorSlotName}
        onClose={onClosePromptEditor}
        width={600}
      >
        <Prompt
          onCancel={onClosePromptEditor}
          onChange={onUpdatePrompt}
          value={flow(find(propEq('name', promptEditorSlotName)), prop('prompt'))(slots)}
        />
      </Drawer>
      <WordsInline
        slots={slots}
        slotName={slotName}
        setSlotName={setSlotName}
        isModalOpen={wordsDrawerOpen}
        setIsModalOpen={setWordsDrawerOpen}
        onUpdateSlot={onUpdateSlot}
        words={words}
        createWords={createWords}
        updateWords={updateWords}
        skillId={skillId}
      />
      <QuickCreateWords
        createWordOpen={createWordOpen}
        setCreateWordOpen={setCreateWordOpen}
        skillId={skillId}
        createWords={createWords}
      />
    </div>
  );
};

result.displayName = __filename;

result.propTypes = {
  updateIntent: func.isRequired,
  createWords: func.isRequired,
  updateWords: func.isRequired,
  removeWords: func.isRequired,
  intentId: number.isRequired,
  skillId: number.isRequired,
  words: array.isRequired,
  slots: array.isRequired,
};

export default result;
