export const suiteType = [{
  label: '普通文本/语音测试',
  value: 0,
}, {
  label: '端到端结果测试',
  value: 1,
}];

export const normalTest = 0;
export const e2eTest = 1;

export const getTestSuiteStatus = (value) => (value === 0 ? '未启用' : '正常');

export const getTestSuiteType = (value) => (value === 0 ? '普通文本/语音测试' : '端到端结果测试');
