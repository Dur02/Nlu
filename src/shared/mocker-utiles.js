export const pagination = (query, others = {}) => (records) => {
  const current = query.current || 1;
  const size = query.size || 10;

  return {
    code: 'SUCCESS',
    data: {
      current,
      records: records.slice((current - 1) * size, current * size),
      pages: Math.ceil(records.length / size),
      size,
      total: records.length,
    },
    ...others,
  };
};

export const single = (others = {}) => (data) => ({
  code: 'SUCCESS',
  data,
  ...others,
});
