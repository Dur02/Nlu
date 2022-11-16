import React from 'react';
import { Button, Popconfirm } from 'antd';

export const columns = () => [{
  title: 'ID',
  width: 70,
  dataIndex: 'id',
}, {
  title: '期待技能',
  // width: 140,
  dataIndex: 'expectedSkill',
}, {
  title: '期待意图',
  // width: 140,
  dataIndex: 'expectedIntent',
}, {
  title: 'joss共享地址',
  width: 250,
  dataIndex: 'jossShareUrl',
}, {
  title: '用户说',
  // width: 180,
  dataIndex: 'refText',
}];

// , {
//   title: '操作',
//     width: 250,
//     render: (record) => (
//     <>
//       <Button
//         type="primary"
//         ghost
//         size="small"
//         onClick={async () => {
//           openBind(record);
//         }}
//       >
//         添加到测试集
//       </Button>
//       &nbsp;&nbsp;
//       <Button
//         type="primary"
//         ghost
//         size="small"
//         onClick={async () => {
//           openEditor({
//             ...record,
//             expectedIntentTemp: record.expectedIntent,
//             expectedRuleTemp: record.expectedRule,
//             expectedSkill: record.expectedSkill,
//             skillCode: record.skillCode,
//           });
//           setIntentOption(filter(
//             propEq('skillId', flow(
//               find(propEq('skillCode', record.skillCode)),
//               get('key'),
//             )(skills)),
//           )(intents));
//         }}
//       >
//         修改
//       </Button>
//       &nbsp;&nbsp;
//       <Popconfirm
//         title="确认删除吗？删除操作不可恢复"
//         onConfirm={async () => {
//           await onRemove({ id: record.id });
//           if ((pagination.current - 1) * pagination.pageSize < pagination.total - 1) {
//             reload();
//           } else {
//             reload(pagination.current - 2);
//           }
//         }}
//       >
//         <Button type="danger" size="small" ghost>删除</Button>
//       </Popconfirm>
//     </>
//   ),
// }

export const testCaseColumns = ({
  delCase,
  caseTableItem,
  pagination,
  openUpdateCase,
  caseUpdateForm,
  caseReload,
}) => [{
  title: 'ID',
  // width: 140,
  dataIndex: 'id',
}, {
  title: '用户说',
  // width: 180,
  dataIndex: 'refText',
}, {
  title: '期待技能',
  // width: 140,
  dataIndex: 'expectedSkill',
}, {
  title: '期待意图',
  // width: 140,
  dataIndex: 'expectedIntent',
}, {
  title: 'joss共享地址',
  width: 250,
  dataIndex: 'jossShareUrl',
}, {
  title: '级别',
  dataIndex: 'level',
}, {
  title: '操作',
  width: 120,
  render: (record) => (
    <>
      <Button
        type="primary"
        ghost
        size="small"
        onClick={() => {
          // 设置form初始值，initialValues不能动态变化
          caseUpdateForm.setFieldsValue({ ...record });
          openUpdateCase(record);
        }}
      >
        修改
      </Button>
      &nbsp;&nbsp;
      <Popconfirm
        title="确认删除吗？删除操作不可恢复"
        onConfirm={async () => {
          await delCase({ caseIds: [record.id], suiteId: caseTableItem.id });
          if (pagination.current === 1 && pagination.total === 1) {
            // 如果只剩一条
            await caseReload(1);
          } else if ((pagination.current - 1) * pagination.pageSize < pagination.total - 1) {
            await caseReload(pagination.current);
          } else {
            await caseReload(pagination.current - 1);
          }
        }}
      >
        <Button type="danger" size="small" ghost>删除</Button>
      </Popconfirm>
    </>
  ),
}];
