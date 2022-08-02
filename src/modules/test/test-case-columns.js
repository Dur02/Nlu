import { time } from 'relient/formatters';

export default () => [{
  title: 'audioFile',
  dataIndex: 'audioFile',
}, {
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
  title: 'expectedIntent',
  dataIndex: 'expectedIntent',
}, {
  title: 'expectedRule',
  dataIndex: 'expectedRule',
}, {
  title: 'expectedSkill',
  dataIndex: 'expectedSkill',
}, {
  title: 'id',
  dataIndex: 'id',
}, {
  title: 'jossShareUrl',
  dataIndex: 'jossShareUrl',
}, {
  title: 'refText',
  dataIndex: 'refText',
}, {
  title: 'status',
  dataIndex: 'status',
}, {
  title: 'testCaseSource',
  dataIndex: 'testCaseSource',
}, {
  title: 'updateTime',
  dataIndex: 'updateTime',
  render: time(),
}];
