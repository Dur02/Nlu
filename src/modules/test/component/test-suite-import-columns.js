import React from 'react';
// eslint-disable-next-line import/prefer-default-export
export const errorColumns = [
  {
    title: '错误信息',
    dataIndex: 'errorMsg',
    render: (text) => <p style={{ color: '#3CA7FF' }}>{text}</p>,
  },
  {
    title: '技能',
    dataIndex: 'skill',
  },
  {
    title: '任务',
    dataIndex: 'task',
  },
  {
    title: '意图',
    dataIndex: 'intent',
  },
  {
    title: '说法',
    dataIndex: 'rule',
  },
  {
    title: '词库名',
    dataIndex: 'lexiconsName',
  },
  {
    title: '词库内容',
    dataIndex: 'lexiconsContent',
    width: '200px',
  },
];
