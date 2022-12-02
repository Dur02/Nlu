import React from 'react';
import { Button, message, Popconfirm } from 'antd';
import { flow, any, prop, map, eq, filter, propEq, flatten } from 'lodash/fp';
import EditableInputCell from 'shared/components/editable-input-cell';

export default ({
  onRemove,
  updateWords,
  selectedWord,
}) => [{
  title: '取值',
  // dataIndex: 'word',
  render: (record) => (
    <EditableInputCell
      value={record.word}
      onSubmit={async (value) => {
        const wordContent = filter(
          propEq('id', record.id),
        )(
          flow(
            map(({ id, name, content }) => map((item) => ({ ...item, id, name }))(content)),
            flatten,
          )(selectedWord),
        );
        if (any(flow(prop('word'), eq(value)))(wordContent)) {
          message.error('取值已存在');
        } else {
          await updateWords({
            id: record.id,
            name: record.name,
            content: flow(
              map((lexicon) => {
                switch (lexicon.word) {
                  case record.word:
                    return {
                      word: value,
                      synonym: lexicon.synonym,
                    };
                  default:
                    return lexicon;
                }
              }),
            )(wordContent),
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
    <EditableInputCell
      value={record.synonym}
      onSubmit={async (value) => {
        const wordContent = filter(
          propEq('id', record.id),
        )(
          flow(
            map(({ id, name, content }) => map((item) => ({ ...item, id, name }))(content)),
            flatten,
          )(selectedWord),
        );
        await updateWords({
          id: record.id,
          name: record.name,
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
          )(wordContent),
        });
      }}
    />
  ),
}, {
  title: '所属词库',
  dataIndex: 'name',
  // width: 70,
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
