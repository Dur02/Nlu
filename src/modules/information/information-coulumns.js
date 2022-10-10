export default [{
  title: 'ID',
  dataIndex: 'id',
}, {
  title: '技能名',
  dataIndex: 'name',
}, {
  title: '技能code',
  dataIndex: 'code',
  width: 120,
}, {
  title: '技能版本',
  dataIndex: 'version',
  width: 90,
}, {
  title: '模型路径',
  dataIndex: 'modelPath',
}, {
  title: '是否已加载',
  dataIndex: 'existCache',
  width: 110,
  render: (existCache) => (
    existCache === true ? '是' : '否'
  ),
}, {
  title: '是否懒加载',
  dataIndex: 'lazyLoad',
  width: 110,
  render: (lazyLoad) => (
    lazyLoad === true ? '是' : '否'
  ),
}];
