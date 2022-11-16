import React, { useCallback, useState } from 'react';
import { array, func, number } from 'prop-types';
import { Button, Drawer, message, Table } from 'antd';
import useStyles from 'isomorphic-style-loader/useStyles';
import {
  map,
  flow,
  find,
  propEq,
  reject,
  eq,
  compact,
  difference,
} from 'lodash/fp';
import { useLocalTable } from 'relient-admin/hooks';
import { readAll as readAllIntent } from 'shared/actions/intent';
import { useDispatch } from 'react-redux';
import { getConfigValue } from 'shared/constants/config';
import columns from './words-drawer-columns';
import fields from './words-drawer-fields';
import s from './words-list.less';

const mapWithIndex = map.convert({ cap: false });

const result = ({
  createWords,
  updateWords,
  removeWords,
  words,
  onChange,
  value,
  skillId,
}) => {
  // words-list组件大部分代码与words-drawer组件相同，words-drawer是技能编辑页工具栏弹出，而words-list作为
  // intent-slot中一列的数据存在
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

  const selectedWords = flow(
    map((name) => find(propEq('name', name))(words)),
    compact,
  )(value);

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
        // const appGroundType = getConfigValue(param.appGroundType, 'appGroundType');
        const duplexType = getConfigValue(param.duplexType || [], 'duplexType');
        await createWords({
          ...param,
          wordConfig: {
            // appGroundType,
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
        // const appGroundType = getConfigValue(param.appGroundType, 'appGroundType');
        const duplexType = getConfigValue(param.duplexType || [], 'duplexType');
        await updateWords({
          ...param,
          wordConfig: {
            // appGroundType,
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
          columns={columns({
            updateWords,
            skillId,
            value,
            isAttachable: true,
            onDetachWords,
            onAttachWords,
            openEditor,
            onRemoveWords,
          })}
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
