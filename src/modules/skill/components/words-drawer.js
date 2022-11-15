import React, { useCallback } from 'react';
import { array, bool, func, number } from 'prop-types';
import useStyles from 'isomorphic-style-loader/useStyles';
import { Drawer, message, Table } from 'antd';
import { getConfigValue } from 'shared/constants/config';
import { readAll as readAllIntent } from 'shared/actions/intent';
import { useLocalTable } from 'relient-admin/hooks';
import { useDispatch } from 'react-redux';
import columns from './words-drawer-columns';
import fields from './words-drawer-fields';
import s from './words-drawer.less';

const result = ({
  tableVisible,
  setTableVisible,
  createWords,
  updateWords,
  removeWords,
  words,
  skillId,
}) => {
  useStyles(s);

  const dispatch = useDispatch();

  const onRemoveWords = useCallback(async ({ id }) => {
    await removeWords({ id });
    message.success('删除成功');
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

  return (
    <>
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
            isAttachable: false,
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
  tableVisible: bool.isRequired,
  setTableVisible: func.isRequired,
  createWords: func.isRequired,
  removeWords: func.isRequired,
  updateWords: func.isRequired,
  words: array.isRequired,
  skillId: number.isRequired,
};

export default result;
