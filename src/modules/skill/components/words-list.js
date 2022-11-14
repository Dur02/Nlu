import React, { useCallback, useState } from 'react';
import { array, func, number } from 'prop-types';
import { Drawer, Button, Table, Popconfirm, message, Checkbox } from 'antd';
import useStyles from 'isomorphic-style-loader/useStyles';
import { map, flow, find, propEq, reject, eq, includes, join, prop, compact, difference } from 'lodash/fp';
import { useLocalTable } from 'relient-admin/hooks';
import { useDispatch } from 'react-redux';
import { readAll as readAllIntent } from 'shared/actions/intent';
import { appGroundTypeOption, duplexTypeOption, getConfigValue } from 'shared/constants/config';

import WordsContent from './words-content';
import s from './words-list.less';

const mapWithIndex = map.convert({ cap: false });
const { Group } = Checkbox;

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
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}, {
  label: 'app前台/app后台',
  name: 'appGroundType',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  component: Checkbox.Group,
  options: appGroundTypeOption,
}, {
  label: '全双工/半双工',
  name: 'duplexType',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  component: Checkbox.Group,
  options: duplexTypeOption,
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

  const dispatch = useDispatch();
  const [tableVisible, setTableVisible] = useState(false);

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

  const onCheckboxChange = useCallback(async ({ id, name, key, keyValue, wordConfig }) => {
    if (wordConfig == null) {
      await updateWords({
        id,
        name,
        wordConfig: {
          appGroundType: key === 'appGroundType' ? keyValue : 0,
          duplexType: key === 'duplexType' ? keyValue : 0,
          skillId,
        },
      });
    } else {
      await updateWords({
        id,
        name,
        wordConfig: {
          ...wordConfig,
          appGroundType: key === 'appGroundType' ? keyValue : wordConfig.appGroundType,
          duplexType: key === 'duplexType' ? keyValue : wordConfig.duplexType,
        },
      });
    }
    message.success('编辑成功');
  }, [skillId]);

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
      onSubmit: async (param) => {
        const appGroundType = getConfigValue(param.appGroundType, 'appGroundType');
        const duplexType = getConfigValue(param.duplexType, 'duplexType');
        await createWords({
          ...param,
          wordConfig: {
            appGroundType,
            duplexType,
            skillId,
          },
        });
      },
      fields,
      component: Drawer,
      width: 600,
      className: s.Words,
    },
    editor: {
      title: '编辑词库',
      onSubmit: async (param) => {
        const appGroundType = getConfigValue(param.appGroundType, 'appGroundType');
        const duplexType = getConfigValue(param.duplexType, 'duplexType');
        await updateWords({
          ...param,
          wordConfig: {
            appGroundType,
            duplexType,
            skillId,
          },
        });
        await dispatch(readAllIntent({ skillId }));
      },
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
    title: 'app前台/app后台',
    width: 150,
    render: (record) => (
      <Group
        disabled={record.skillId === null}
        options={appGroundTypeOption}
        value={record.appGroundType}
        onChange={(checkedValue) => {
          const appGroundType = getConfigValue(checkedValue, 'appGroundType');
          return onCheckboxChange({
            id: record.id,
            name: record.name,
            key: 'appGroundType',
            keyValue: appGroundType,
            wordConfig: record.wordConfig,
          });
        }}
      />
    ),
  }, {
    title: '全双工/半双工',
    width: 150,
    render: (record) => (
      <Group
        disabled={record.skillId === null}
        options={duplexTypeOption}
        value={record.duplexType}
        onChange={(checkedValue) => {
          const duplexType = getConfigValue(checkedValue, 'duplexType');
          return onCheckboxChange({
            id: record.id,
            name: record.name,
            key: 'duplexType',
            keyValue: duplexType,
            wordConfig: record.wordConfig,
          });
        }}
      />
    ),
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
                openEditor(item);
                // if (item.skillId) {
                //   openEditor(item);
                // } else {
                //   message.error('系统词库不可编辑');
                // }
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
                message.error('词库缺失');
              }}
              size="small"
              ghost
              type="primary"
            >
              {item}
            </Button>
            <Button
              onClick={() => onDetachWords({ name: item })}
              size="small"
            >
              x
            </Button>
            <span style={{ color: '#FF4D4F' }}>(词库缺失)</span>
          </div>
        ))(difference(value, map(({ name }) => name)(selectedWords)))}
        <Button
          className={s.AddedWords}
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
