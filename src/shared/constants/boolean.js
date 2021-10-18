export const booleanOptions = [{
  label: '是',
  value: true,
}, {
  label: '否',
  value: false,
}];

export const booleanSwitchOptions = {
  checkedChildren: '是',
  unCheckedChildren: '否',
};

export const getBooleanText = (value) => (value ? '是' : '否');
