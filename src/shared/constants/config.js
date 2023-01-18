export const activatedOption = [
  { label: '未激活', value: '未激活' },
  { label: '激活', value: '激活' },
];

export const duplexTypeOption = [
  { label: '全双工', value: '全双工' },
  { label: '半双工', value: '半双工' },
];

export const getConfigValue = (checkedArray, type) => {
  switch (checkedArray.length) {
    case 2:
      return 3;
    case 0:
      return 0;
    default:
      switch (type) {
        case 'activated':
          return JSON.stringify(checkedArray) === JSON.stringify(['未激活']) ? 1 : 2;
        default:
          return JSON.stringify(checkedArray) === JSON.stringify(['半双工']) ? 1 : 2;
      }
  }
};

export const getCheckboxValue = (value, type) => {
  switch (type) {
    case 'activated':
      switch (value) {
        case 0:
          return [];
        case 1:
          return ['未激活'];
        case 2:
          return ['激活'];
        default:
          return ['未激活', '激活'];
      }
    default:
      switch (value) {
        case 0:
          return [];
        case 1:
          return ['半双工'];
        case 2:
          return ['全双工'];
        default:
          return ['半双工', '全双工'];
      }
  }
};
