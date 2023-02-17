export const getStatus = (value) => {
  switch (value) {
    case 0: return '未执行';
    case 1: return '已执行';
    case 2: return '已取消';
    default: return '执行中';
  }
};

export const getDeleted = (value) => (value ? '已删除' : '未删除');
