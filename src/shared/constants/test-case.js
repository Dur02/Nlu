export const getStatus = (value) => (value === 0 ? '未启用' : '正常');

export const getTestCaseSource = (value) => (value === 0 ? '用户创建' : 'joss平台');

export const getDeleted = (value) => (value ? '已删除' : '未删除');
