import { time } from 'relient/formatters';

export default () => [{
  title: 'id',
  dataIndex: 'id',
}, {
  title: '标题',
  dataIndex: 'title',
}, {
  title: '测试集类型',
  dataIndex: 'suiteType',
}, {
  title: '描述',
  dataIndex: 'description',
}, {
  title: '状态',
  dataIndex: 'status',
}, {
  title: '删除',
  dataIndex: 'deleted',
}, {
  title: '创建时间',
  dataIndex: 'createTime',
  render: time(),
}, {
  title: '创建者',
  dataIndex: 'creator',
}, {
  title: '更新时间',
  dataIndex: 'updateTime',
  render: time(),
}];
