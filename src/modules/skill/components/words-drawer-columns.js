import React, { useCallback } from 'react';
import { flow, includes, join, map, prop } from 'lodash/fp';
import { Button, Popconfirm, Checkbox, message } from 'antd';
// import { appGroundTypeOption, duplexTypeOption, getConfigValue } from 'shared/constants/config';
import { duplexTypeOption, getConfigValue } from 'shared/constants/config';
import useStyles from 'isomorphic-style-loader/useStyles';
import s from './words-drawer-columns.less';

const { Group } = Checkbox;

export default ({
  updateWords,
  skillId,
  value,
  isAttachable,
  onDetachWords,
  onAttachWords,
  openEditor,
  onRemoveWords,
}) => {
  useStyles(s);

  const onCheckboxChange = useCallback(async ({ id, name, key, keyValue, wordConfig }) => {
    if (wordConfig == null) {
      await updateWords({
        id,
        name,
        wordConfig: {
          // appGroundType: key === 'appGroundType' ? keyValue : 0,
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
          // appGroundType: key === 'appGroundType' ? keyValue : wordConfig.appGroundType,
          duplexType: key === 'duplexType' ? keyValue : wordConfig.duplexType,
        },
      });
    }
    message.success('编辑成功');
  }, [skillId]);

  return [{
    title: '词库名',
    width: 120,
    dataIndex: 'name',
  }, {
  //   title: 'app前台/app后台',
  //   width: 150,
  //   render: (record) => (
  //     <Group
  //       disabled={record.skillId === null}
  //       options={appGroundTypeOption}
  //       value={record.appGroundType}
  //       onChange={(checkedValue) => {
  //         const appGroundType = getConfigValue(checkedValue, 'appGroundType');
  //         return onCheckboxChange({
  //           id: record.id,
  //           name: record.name,
  //           key: 'appGroundType',
  //           keyValue: appGroundType,
  //           wordConfig: record.wordConfig,
  //         });
  //       }}
  //     />
  //   ),
  // }, {
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
        {
          // record.skillId && (
          //   <div className={s.Button}>
          //     <Button
          //       type="primary"
          //       size="small"
          //       ghost
          //       onClick={() => openEditor(record)}
          //     >
          //       编辑
          //     </Button>
          //   </div>
          // )
        }
        <div className={s.Button}>
          <Button type="primary" size="small" ghost onClick={() => openEditor(record)}>编辑</Button>
        </div>
        {
          isAttachable && (
            <div className={s.Button}>
              {includes(prop('name')(record))(value) ? (
                <Button type="primary" size="small" ghost onClick={() => onDetachWords(record)}>去除绑定</Button>
              ) : (
                <Button type="primary" size="small" ghost onClick={() => onAttachWords(record)}>添加绑定</Button>
              )}
            </div>
          )
        }
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
};
