import { time } from 'relient/formatters';

export default () => [{
  title: 'createTime',
  dataIndex: 'createTime',
  render: time(),
}, {
  title: 'creator',
  dataIndex: 'creator',
}, {
  title: 'deleted',
  dataIndex: 'deleted',
}, {
  title: 'description',
  dataIndex: 'description',
}, {
  title: 'suiteType',
  dataIndex: 'suiteType',
}, {
  title: 'id',
  dataIndex: 'id',
}, {
  title: 'status',
  dataIndex: 'status',
}, {
  title: 'title',
  dataIndex: 'title',
}, {
  title: 'updateTime',
  dataIndex: 'updateTime',
  render: time(),
}];
