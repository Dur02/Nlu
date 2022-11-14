export const appGroundTypeOption = [
  { label: '后台', value: '后台' },
  { label: '前台', value: '前台' },
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
        case 'appGroundType':
          return JSON.stringify(checkedArray) === JSON.stringify(['后台']) ? 1 : 2;
        default:
          return JSON.stringify(checkedArray) === JSON.stringify(['半双工']) ? 1 : 2;
      }
  }
};

export const getCheckboxValue = (value, type) => {
  switch (type) {
    case 'appGroundType':
      switch (value) {
        case 0:
          return [];
        case 1:
          return ['后台'];
        case 2:
          return ['前台'];
        default:
          return ['后台', '前台'];
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
