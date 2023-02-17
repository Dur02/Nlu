export const getPassed = (value) => (value ? '成功' : '失败');

export const passedArray = [{
  label: '全部',
  value: -1,
}, {
  label: '失败',
  value: 0,
}, {
  label: '成功',
  value: 1,
}];
