import React from 'react';
import { Button, message, Popconfirm } from 'antd';
import { flow, any, prop, map, eq } from 'lodash/fp';
import EditableInputCell from 'shared/components/editable-input-cell';
import EditableTextArea from 'shared/components/editable-text-area';

export default ({
  onRemove,
  updateWords,
  item,
}) => [{
  title: '取值',
  dataIndex: 'word',
  render: (word) => (
    <EditableInputCell
      value={word}
      onSubmit={async (value) => {
        if (any(flow(prop('word'), eq(value)))(item.content)) {
          message.error('取值已存在');
        } else {
          await updateWords({
            id: item.id,
            name: item.name,
            content: flow(
              map((lexicon) => {
                switch (lexicon.word) {
                  case word:
                    return {
                      word: value,
                      synonym: lexicon.synonym,
                    };
                  default:
                    return lexicon;
                }
              }),
            )(item.content),
          });
        }
      }}
    />
  ),
}, {
  title: '同义词',
  // dataIndex: 'synonym',
  style: {
    wordBreak: 'break-all',
  },
  render: (record) => (
    <EditableTextArea
      value={record.synonym}
      onSubmit={async (value) => {
        await updateWords({
          id: item.id,
          name: item.name,
          content: flow(
            map((lexicon) => {
              switch (lexicon.word) {
                case record.word:
                  return {
                    word: lexicon.word,
                    synonym: value,
                  };
                default:
                  return lexicon;
              }
            }),
          )(item.content),
        });
      }}
    />
  ),
}, {
  title: '操作',
  width: 70,
  render: (record) => (
    <>
      <Popconfirm
        title="确认删除吗？删除操作不可恢复"
        onConfirm={() => onRemove(record)}
      >
        <Button type="danger" size="small" ghost>删除</Button>
      </Popconfirm>
    </>
  ),
}];
