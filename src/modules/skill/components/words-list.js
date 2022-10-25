import React, { useCallback, useState } from 'react';
import { array, func, number } from 'prop-types';
import { Drawer, Button, Table, Popconfirm, message } from 'antd';
import useStyles from 'isomorphic-style-loader/useStyles';
import { map, flow, find, propEq, reject, eq, includes, join, prop, compact, difference } from 'lodash/fp';
import { useLocalTable } from 'relient-admin/hooks';

import WordsContent from './words-content';
import s from './words-list.less';

const mapWithIndex = map.convert({ cap: false });

const fields = [{
  label: '名称',
  name: 'name',
  type: 'text',
  rules: [{
    required: true,
  }, {
    validator: async (_, value) => {
      if (includes(',')(value)) {
        throw new Error('词库名不能包含,');
      }
    },
  }],
  labelCol: { span: 2 },
  wrapperCol: { span: 20 },
}, {
  label: '词条',
  name: 'content',
  component: WordsContent,
  labelCol: { span: 2 },
  wrapperCol: { span: 20 },
}];

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
    width: 120,
    dataIndex: 'name',
  }, {
    title: '词条',
    dataIndex: 'content',
    render: flow(
      map(prop('word')),
      join(', '),
      (display) => {
        if (display && display.length > 100) {
          return `${display.slice(0, 100)}...`;
        }
        return display;
      },
    ),
  }, {
    title: '操作',
    width: 80,
    render: (record) => (
      <>
        {record.skillId && (
          <div className={s.Button}>
            <Button type="primary" size="small" ghost onClick={() => openEditor(record)}>编辑</Button>
          </div>
        )}
        <div className={s.Button}>
          {includes(prop('name')(record))(value) ? (
            <Button type="primary" size="small" ghost onClick={() => onDetachWords(record)}>去除绑定</Button>
          ) : (
            <Button type="primary" size="small" ghost onClick={() => onAttachWords(record)}>添加绑定</Button>
          )}
        </div>
        {prop('canDelete')(record) && (
          <div className={s.Button}>
            <Popconfirm
              title="确认删除吗？删除操作不可恢复"
              onConfirm={() => onRemoveWords(record)}
            >
              <Button type="danger" size="small" ghost>删除</Button>
            </Popconfirm>
          </div>
        )}
      </>
    ),
  }];

  const selectedWords = flow(
    map((name) => find(propEq('name', name))(words)),
    compact,
  )(value);

  return (
    <>
      <div className={s.WordsList}>
        {map((item) => (
          <div className={s.AddedWords} key={item.id}>
            <Button
              onClick={() => {
                if (item.skillId) {
                  openEditor(item);
                } else {
                  message.error('词库不可编辑');
                }
              }}
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
        {mapWithIndex((item, index) => (
          <div className={s.AddedWords} key={index}>
            <Button
              onClick={() => {
                message.error('系统词库缺失');
              }}
              size="small"
              ghost
              type="danger"
            >
              {item}(词库缺失)
            </Button>
          </div>
        ))(difference(value, map(({ name }) => name)(selectedWords)))}
        <Button
          type="primary"
          size="small"
          onClick={() => setTableVisible(true)}
        >
          添加
        </Button>
      </div>
      <Drawer
        forceRender
        visible={tableVisible}
        title="选择词库"
        onClose={() => setTableVisible(false)}
        width={800}
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
