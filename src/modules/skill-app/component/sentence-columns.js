import React from 'react';
import { Button, Popconfirm } from 'antd';
import EditableInputCell from 'shared/components/editable-input-cell';
import EditableSwitchCell from 'shared/components/editable-switch-cell';
import { time } from 'relient/formatters';

export default ({
  DragVisible,
  DragHandle,
  updateSentence,
  removeSentence,
}) => [{
  title: 'Sort',
  dataIndex: 'sort',
  width: 50,
  className: DragVisible,
  render: () => <DragHandle />,
}, {
  title: 'ID',
  width: 50,
  dataIndex: 'id',
  className: DragVisible,
}, {
  title: '说法名',
  dataIndex: 'sentenceName',
  render: (sentenceName, record) => (
    <EditableInputCell
      value={sentenceName}
      onSubmit={async (value) => updateSentence({ ...record, sentenceName: value })}
    />
  ),
}, {
  title: '主页展示',
  dataIndex: 'homePageShow',
  render: (homePageShow, record) => (
    <EditableSwitchCell
      value={homePageShow}
      onChange={(value) => updateSentence({ ...record, homePageShow: value })}
    />
  ),
}, {
  title: '创建时间',
  width: 150,
  dataIndex: 'createTime',
  render: time(),
}, {
  title: '更新时间',
  width: 150,
  dataIndex: 'updateTime',
  render: time(),
}, {
  title: '操作',
  width: 60,
  render: (record) => (
    <>
      <Popconfirm
        title="确认删除吗？删除操作不可恢复"
        onConfirm={() => {
          removeSentence({ id: record.id });
        }}
      >
        <Button type="danger" size="small" ghost>删除</Button>
      </Popconfirm>
    </>
  ),
}];
