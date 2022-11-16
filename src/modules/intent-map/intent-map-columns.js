import { time } from 'relient/formatters';
import { Button, Popconfirm } from 'antd';
import React from 'react';
import { find, findKey, flow, map, prop, propEq } from 'lodash/fp';

export default ({
  onRemove,
  paginationProps,
  reload,
  openEditor,
  skillInfos,
  setIntentOption,
  updateForm,
}) => [{
  title: 'ID',
  dataIndex: 'id',
  width: 70,
}, {
  title: '规则意图名',
  dataIndex: 'intentName',
}, {
  title: '技能编号',
  dataIndex: 'skillCode',
}, {
  title: '技能名',
  dataIndex: 'skillName',
}, {
  title: '统计意图名',
  dataIndex: 'intentMapName',
}, {
  title: '更新时间',
  dataIndex: 'updateTime',
  width: 160,
  render: time(),
  // width: 180,
}, {
  title: '操作',
  width: 140,
  render: (record) => (
    <>
      <Button
        type="primary"
        size="small"
        ghost
        onClick={() => {
          openEditor(record);
          const selectedSkill = flow(
            find(propEq('skillCode', record.skillCode)),
            prop('intentNames'),
          )(skillInfos);
          setIntentOption(
            map((item) => ({
              label: findKey((o) => o === item)(selectedSkill),
              value: findKey((o) => o === item)(selectedSkill),
            }))(selectedSkill),
          );
          updateForm.setFieldsValue({ ...record });
        }}
      >
        修改
      </Button>
      &nbsp;&nbsp;
      <Popconfirm
        title="确认删除吗？删除操作不可恢复"
        onConfirm={async () => {
          await onRemove({ id: record.id });
          if (paginationProps.current === 1 && paginationProps.total === 1) {
            await reload(1);
          } else if (
            (paginationProps.current - 1) * paginationProps.pageSize < paginationProps.total - 1
          ) {
            await reload(paginationProps.current);
          } else {
            await reload(paginationProps.current - 1);
          }
        }}
      >
        <Button type="danger" size="small" ghost>删除</Button>
      </Popconfirm>
    </>
  ),
}];
