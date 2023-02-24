import { prop } from 'lodash/fp';
import { Button, Popconfirm } from 'antd';
import React from 'react';
import EditableSwitchCell from 'shared/components/editable-switch-cell';
import WordsList from './words-list';
import s from './intent-slots-columns.less';

export default ({
  onUpdateSlot,
  onRemoveSlot,
  words,
  createWords,
  updateWords,
  removeWords,
  skillId,
  setPromptEditorSlotName,
}) => [{
  title: '名称',
  width: 60,
  // fixed: 'left',
  dataIndex: 'name',
}, {
  title: '必须',
  dataIndex: 'required',
  width: 60,
  render: (required, record) => (
    <EditableSwitchCell
      value={required}
      onChange={(value) => onUpdateSlot({ ...record, required: value }, undefined, record)}
    />
  ),
}, {
  title: '有效',
  dataIndex: 'isSlot',
  width: 60,
  render: (isSlot, record) => (
    <EditableSwitchCell
      value={isSlot}
      onChange={(value) => onUpdateSlot({ ...record, isSlot: value }, undefined, record)}
    />
  ),
}, {
  title: '词库',
  dataIndex: 'lexiconsNames',
  render: (lexiconsNames, record) => (
    <WordsList
      onChange={(value) => onUpdateSlot({ ...record, lexiconsNames: value }, undefined, record)}
      value={lexiconsNames}
      words={words}
      createWords={createWords}
      updateWords={updateWords}
      removeWords={removeWords}
      skillId={skillId}
    />
  ),
}, {
  title: '操作',
  width: 80,
  // fixed: 'right',
  render: (record) => (
    <>
      {prop('required')(record) && (
        <div className={s.Button}>
          <Button type="primary" size="small" ghost onClick={() => setPromptEditorSlotName(record.name)}>提问</Button>
        </div>
      )}
      {prop('canDelete')(record) && (
        <div className={s.Button}>
          <Popconfirm
            title="确认删除吗？删除操作不可恢复"
            onConfirm={() => onRemoveSlot(record)}
          >
            <Button type="danger" size="small" ghost>删除</Button>
          </Popconfirm>
        </div>
      )}
    </>
  ),
}];
