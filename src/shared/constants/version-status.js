export const getVersionStatusText = (pubState) => {
  if (pubState === 0) {
    return '未发布';
  }
  if (pubState === 1) {
    return '已发布';
  }
  return '取消发布';
};

export const a = 1;
