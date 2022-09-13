export const sysIntentTableData = [{
  sysIntent: 'sys.国内城市',
  type: '北京市、广州市、深圳市',
}, {
  sysIntent: 'sys.国内省份',
  type: '广东省、浙江省、四川省等',
}, {
  sysIntent: 'sys.国外城市',
  type: '芝加哥、纽约、伦敦',
}, {
  sysIntent: 'sys.地址',
  type: '广州市黄埔区开源大道136号黄埔实验室',
}, {
  sysIntent: 'sys.国外地址',
  type: '19 Washington Square N, New York, NY 10011, USA',
}, {
  sysIntent: 'sys.时间',
  type: '2022年11月11号 （时间相关，建议用这个）（最终格式：yyyy-MM-dd HH:mm:ss）',
}, {
  sysIntent: 'sys.语气助词',
  type: '啊、的、呐',
}, {
  sysIntent: 'sys语气助词',
  type: '啊、的、呐',
}, {
  sysIntent: 'sys时间长度',
  type: '1分钟、1小时',
}, {
  sysIntent: 'sys.相对时间',
  type: '下周五晚上8点',
}, {
  sysIntent: 'sys.年份',
  type: '2022、2021、2020、2019（最终格式：yyyy）',
}, {
  sysIntent: 'sys.阴历日期',
  type: '农历的时间（2022年八月初十）（最终格式：yyyyMMdd）',
}, {
  sysIntent: 'sys.节日节气',
  type: '春节、元宵节、中秋节、立春、夏至',
}, {
  sysIntent: 'sys.节日',
  type: '春节、元宵节、中秋节（最终格式：yyyy-MM-dd HH:mm:ss）',
}, {
  sysIntent: 'sys.qq',
  type: 'qq号码',
}, {
  sysIntent: 'sys.电话号码',
  type: '电话号码',
}, {
  sysIntent: 'sys.整数',
  type: '整数',
}, {
  sysIntent: 'sys.数值',
  type: '123345678',
}, {
  sysIntent: 'sys.APP',
  type: '闹钟、音乐、备忘录等',
}, {
  sysIntent: 'sys.歌曲名',
  type: '孤勇者、富士山下、葡萄成熟时',
}, {
  sysIntent: 'sys.歌手名',
  type: '周杰伦、张学友、梁静茹',
}, {
  sysIntent: 'sys.音乐专辑名',
  type: '《饿狼传说》、《祝福》、《孤勇者》、《等你下课》',
}, {
  sysIntent: '人物关系',
  type: '爷爷、奶奶、爸爸、妈妈',
}, {
  sysIntent: 'sys.联系人',
  type: '张三、李四 （通讯录）',
}, {
  sysIntent: 'sys.序列号',
  type: '第一，第二',
}, {
  sysIntent: 'sys.页码',
  type: '第一页，第二页',
}, {
  sysIntent: 'sys.生肖',
  type: '"鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"',
}, {
  sysIntent: '纯时间',
  type: '12点30分 （具体的几点几分不带日期）（最终格式：HH:mm:ss）',
}, {
  sysIntent: 'sys.直接地址',
  type: '（样例暂无）',
}, {
  sysIntent: 'sys.国内外城市',
  type: '国内城市和国外城市的整合 （城市相关，建议用这个）',
}];

export const sysIntentTableColumns = [{
  title: '系统内置词库',
  dataIndex: 'sysIntent',
}, {
  title: '数据的类型',
  dataIndex: 'type',
}];
