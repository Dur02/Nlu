export const sysIntentTableData = [{
  id: 1,
  sysIntent: 'sys.国内城市',
  example: '北京市、广州市、深圳市',
  execute: '国内城市的词库，可以自己添加扩展；baidu LAC、 HanLP进行分词处理，提取出实体以及它的词性，结合词性来判断',
}, {
  id: 2,
  sysIntent: 'sys.国内省份',
  example: '广东省、浙江省、四川省等',
  execute: '国内省份的词库，可以自己添加扩展；baidu LAC、 HanLP进行分词处理，提取出实体以及它的词性，结合词性来判断',
}, {
  id: 3,
  sysIntent: 'sys.国外城市',
  example: '芝加哥、纽约、伦敦',
  execute: '国外城市的词库，可以自己添加扩展；baidu LAC、 HanLP进行分词处理，提取出实体以及它的词性，结合词性来判断',
}, {
  id: 4,
  sysIntent: 'sys.地址',
  example: '广州市黄埔区开源大道136号黄埔实验室',
  execute: '内部代码解析处理，baidu LAC、 HanLP进行分词处理，提取出实体以及它的词性，结合词性来判断',
}, {
  id: 5,
  sysIntent: 'sys.国外地址',
  example: '19 Washington Square N, New York, NY 10011, USA',
  execute: '内部代码解析处理，baidu LAC、 HanLP进行分词处理，提取出实体以及它的词性，结合词性来判断',
}, {
  id: 6,
  sysIntent: 'sys.时间',
  example: '2022年11月11号 （时间相关，建议用这个）（最终格式：yyyy-MM-dd HH:mm:ss）',
  execute: '内部代码解析处理，由TimeProcessor来处理，循环周期不处理，如每周三',
}, {
  id: 7,
  sysIntent: 'sys.语气助词',
  example: '啊、的、呐',
  execute: '内置硬编码判断',
}, {
  id: 8,
  sysIntent: 'sys语气助词',
  example: '啊、的、呐',
  execute: '内置硬编码判断（nlu判断用的是这个）',
}, {
  id: 9,
  sysIntent: 'sys时间长度',
  example: '1分钟、1小时',
  execute: '内部代码解析处理，由TimeProcessor来处理，循环周期不处理，如每周三',
}, {
  id: 10,
  sysIntent: 'sys.相对时间',
  example: '下周五晚上8点',
  execute: '内部代码解析处理，由TimeProcessor来处理，循环周期不处理，如每周三',
}, {
  id: 11,
  sysIntent: 'sys.年份',
  example: '2022、2021、2020、2019（最终格式：yyyy）',
  execute: '内部代码解析处理，由TimeProcessor来处理，循环周期不处理，如每周三',
}, {
  id: 12,
  sysIntent: 'sys.阴历日期',
  example: '农历的时间（2022年八月初十）（最终格式：yyyyMMdd）',
  execute: '内部代码解析处理，由TimeProcessor来处理，循环周期不处理，如每周三',
}, {
  id: 13,
  sysIntent: 'sys.节日节气',
  example: '春节、元宵节、中秋节、立春、夏至',
  execute: '内部代码解析处理，由TimeProcessor来处理，循环周期不处理，如每周三',
}, {
  id: 14,
  sysIntent: 'sys.节日',
  example: '春节、元宵节、中秋节（最终格式：yyyy-MM-dd HH:mm:ss）',
  execute: '内部代码解析处理，由TimeProcessor来处理，循环周期不处理，如每周三',
}, {
  id: 15,
  sysIntent: 'sys.qq',
  example: 'qq号码',
  execute: 'qq号码，纯数字，内部代码解析处理（使用正则来提取数字，qq 5-13位；）',
}, {
  id: 16,
  sysIntent: 'sys.电话号码',
  example: '电话号码',
  execute: '纯数字，内部代码解析处理（使用正则来提取数字，支持手机号码和固话，手机号码11位，固话判断是大于3位）',
}, {
  id: 17,
  sysIntent: 'sys.整数',
  example: '整数',
  execute: '内部代码解析处理（NumericProcessor，ChineseNumberUtil，使用正则来提取数字或中文数字，需要技能词典没有加上sys.数值和sys.整数等）',
}, {
  id: 18,
  sysIntent: 'sys.数值',
  example: '123345678',
  execute: '内部代码解析处理（使用正则来提取数字或中文数字，需要技能词典没有加上sys.数值和sys.整数等）',
}, {
  id: 19,
  sysIntent: 'sys.APP',
  example: '闹钟、音乐、备忘录等',
  execute: '如果包含app的系统词库，则从extensionData获取app的应用名字，逐个匹配去构造Wordnet的节点',
}, {
  id: 20,
  sysIntent: 'sys.歌曲名',
  example: '孤勇者、富士山下、葡萄成熟时',
  execute: '根据爬虫数据制作的词库，系统内置，BigwordProcessor来处理',
}, {
  id: 21,
  sysIntent: 'sys.歌手名',
  example: '周杰伦、张学友、梁静茹',
  execute: '根据爬虫数据制作的词库，系统内置，BigwordProcessor来处理',
}, {
  id: 22,
  sysIntent: 'sys.音乐专辑名',
  example: '《饿狼传说》、《祝福》、《孤勇者》、《等你下课》',
  execute: '根据爬虫数据制作的词库，系统内置，BigwordProcessor来处理',
}, {
  id: 23,
  sysIntent: '人物关系',
  example: '爷爷、奶奶、爸爸、妈妈',
  execute: '可自己扩展，包含PERSONREL才会触发处理',
}, {
  id: 24,
  sysIntent: 'sys.联系人',
  example: '张三、李四 （通讯录）',
  execute: '内部代码解析处理',
}, {
  id: 25,
  sysIntent: 'sys.序列号',
  example: '第一，第二',
  execute: '内部代码解析处理，左判断“第”中间判断是否是数值，需要包含：sys.序列号才会触发',
}, {
  id: 26,
  sysIntent: 'sys.页码',
  example: '第一页，第二页',
  execute: '内部代码解析处理，左判断“第”，右判断“页”，中间判断是否是数值，需要包含：sys.页码才会触发',
}, {
  id: 27,
  sysIntent: 'sys.生肖',
  example: '"鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"',
  execute: '内部代码解析处理，由TimeProcessor来处理，循环周期不处理，如每周三',
}, {
  id: 28,
  sysIntent: '纯时间',
  example: '12点30分 （具体的几点几分不带日期）（最终格式：HH:mm:ss）',
  execute: '内部代码解析处理，由TimeProcessor来处理，循环周期不处理，如每周三',
}, {
  id: 29,
  sysIntent: 'sys.直接地址',
  example: '（样例暂无）',
  execute: '',
}, {
  id: 30,
  sysIntent: 'sys.国内外城市',
  example: '国内城市和国外城市的整合 （城市相关，建议用这个）',
  execute: '国内外城市的词库，可以自己添加扩展,baidu LAC、 HanLP进行分词处理，提取出实体以及它的词性，通过词性来判断',
}];

export const sysIntentTableColumns = [{
  title: '系统内置词库',
  dataIndex: 'sysIntent',
  width: 100,
}, {
  title: '数据示例',
  dataIndex: 'example',
}, {
  title: '词库处理方式',
  dataIndex: 'execute',
}];
