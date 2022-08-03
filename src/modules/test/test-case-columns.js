import { time } from 'relient/formatters';

export default () => [{
  title: 'ID',
  dataIndex: 'id',
}, {
  title: '期待技能',
  dataIndex: 'expectedSkill',
}, {
  title: '期待意图',
  dataIndex: 'expectedIntent',
}, {
  title: '期待说法',
  dataIndex: 'expectedRule',
}, {
  title: '描述',
  dataIndex: 'description',
}, {
  title: 'joss共享地址',
  dataIndex: 'jossShareUrl',
}, {
  title: '用户说',
  dataIndex: 'refText',
}, {
  title: '状态',
  dataIndex: 'status',
}, {
  title: '测试用例来源',
  dataIndex: 'testCaseSource',
}, {
  title: '音频',
  dataIndex: 'audioFile',
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
