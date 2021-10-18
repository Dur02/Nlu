import React, { useCallback, useState } from 'react';
import { array, func, number } from 'prop-types';
import { Drawer, Button, Table, Popconfirm, message } from 'antd';
import useStyles from 'isomorphic-style-loader/useStyles';
import { map, flow, filter, reject, eq, includes, join, prop } from 'lodash/fp';
import { useLocalTable } from 'relient-admin/hooks';

import WordsContent from './words-content';
import s from './words-list.less';

const result = ({
  createWords,
  updateWords,
  removeWords,
  words,
  onChange,
  value,
  skillId,
}) => {
  useStyles(s);

  const [tableVisible, setTableVisible] = useState(false);
  const onCreateWords = useCallback((values) => createWords({ skillId, ...values }), [skillId]);
  const onRemoveWords = useCallback(async ({ id }) => {
    await removeWords({ id });
    message.success('删除成功');
  }, [skillId]);
  const onDetachWords = useCallback(
    ({ name }) => onChange(reject(eq(name))(value)),
    [value, onChange],
  );
  const onAttachWords = useCallback(
    ({ name }) => onChange([name, ...(value || [])]),
    [value, onChange],
  );
  const fields = [{
    label: '名称',
    name: 'name',
    type: 'text',
    rules: [{ required: true }],
    labelCol: { span: 2 },
    wrapperCol: { span: 20 },
  }, {
    label: '词条',
    name: 'content',
    component: WordsContent,
    labelCol: { span: 2 },
    wrapperCol: { span: 20 },
  }];
  const {
    tableHeader,
    getDataSource,
    pagination,
    openEditor,
  } = useLocalTable({
    query: {
      fields: [{
        dataKey: 'name',
        label: '词库名',
      }],
    },
    createButton: {
      text: '创建',
      size: 'middle',
    },
    creator: {
      title: '创建词库',
      onSubmit: onCreateWords,
      fields,
      component: Drawer,
      width: 600,
      className: s.Words,
    },
    editor: {
      title: '编辑词库',
      onSubmit: updateWords,
      fields,
      component: Drawer,
      width: 600,
      className: s.Words,
    },
  });
  const columns = [{
    title: '词库名',
    dataIndex: 'name',
  }, {
    title: '词条',
    dataIndex: 'content',
    render: flow(map(prop('word')), join(', ')),
  }, {
    title: '操作',
    width: 80,
    render: (record) => (
      <>
        <div className={s.Button}>
          <Button type="primary" size="small" ghost onClick={() => openEditor(record)}>编辑</Button>
        </div>
        <div className={s.Button}>
          {includes(prop('name')(record))(value) ? (
            <Button type="primary" size="small" ghost onClick={() => onDetachWords(record)}>去除绑定</Button>
          ) : (
            <Button type="primary" size="small" ghost onClick={() => onAttachWords(record)}>添加绑定</Button>
          )}
        </div>
        <div className={s.Button}>
          <Popconfirm
            title="确认删除吗？删除操作不可恢复"
            onConfirm={() => onRemoveWords(record)}
          >
            <Button type="danger" size="small" ghost>删除</Button>
          </Popconfirm>
        </div>
      </>
    ),
  }];

  const selectedWords = filter(({ name }) => includes(name)(value))(words);

  return (
    <>
      <div className={s.WordsList}>
        {map((item) => (
          <div className={s.AddedWords} key={item.id}>
            <Button
              onClick={() => openEditor(item)}
              size="small"
              ghost
              type="primary"
            >
              {item.name}
            </Button>
            <Button
              onClick={() => onDetachWords(item)}
              size="small"
            >
              x
            </Button>
          </div>
        ))(selectedWords)}
      </div>
      <Button
        type="primary"
        size="small"
        onClick={() => setTableVisible(true)}
      >
        添加
      </Button>
      <Drawer
        forceRender
        visible={tableVisible}
        title="选择词库"
        onClose={() => setTableVisible(false)}
        width={600}
      >
        {tableHeader}
        <Table
          dataSource={getDataSource(words)}
          columns={columns}
          rowKey="id"
          pagination={pagination}
        />
      </Drawer>
    </>
  );
};

result.displayName = __filename;

result.propTypes = {
  onChange: func,
  value: array,
  words: array.isRequired,
  createWords: func.isRequired,
  removeWords: func.isRequired,
  updateWords: func.isRequired,
  skillId: number.isRequired,
};

export default result;
