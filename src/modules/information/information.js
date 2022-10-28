import React, { useState } from 'react';
import Layout from 'shared/components/layout';
import { useSelector } from 'react-redux';
import { flow, map, flattenDepth, findKey, concat, prop } from 'lodash/fp';
import { getEntity } from 'relient/selectors';
import { Table, Tabs } from 'antd';
import columns from './information-columns';

const mapWithIndex = map.convert({ cap: false });

const result = () => {
  const {
    productSkillInfos,
    tabOption,
  } = useSelector((state) => ({
    productSkillInfos: getEntity('information')(state),
    tabOption: concat([{ label: '全部', key: '全部' }], flow(
      getEntity('information'),
      map((item) => ({
        label: findKey((o) => o === item)(getEntity('information')(state)),
        key: findKey((o) => o === item)(getEntity('information')(state)),
      })),
    )(state)),
  }));

  const [data, setData] = useState(
    flow(
      mapWithIndex((item, index) => mapWithIndex((item2, index2) => ({ ...item2, key: `${index}-${index2}` }))(item)),
      flattenDepth(2),
    )(productSkillInfos),
  );
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const paginationProps = {
    defaultCurrent: 1,
    defaultPageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: [10, 20, 50, 100],
    current,
    // 切换tab再换回来原表格会保持页码不变，要实现切换页签后重置页码的话需要一个state
    total: data.length,
    pageSize,
    onChange: async (newPage, newPageSize) => {
      setCurrent(newPage);
      setPageSize(newPageSize);
    },
    showTotal: (total) => `共 ${total} 条`,
  };

  return (
    <Layout>
      <Tabs
        defaultActiveKey="全部"
        tabPosition="left"
        style={{
          height: 800,
          position: 'relative',
          top: 10,
        }}
        items={
          flow(
            map(({ label, key }) => ({
              label,
              key,
              children: <Table
                // tableLayout="fixed"
                scroll={{
                  y: 600,
                }}
                dataSource={data}
                columns={columns}
                rowKey="key"
                pagination={paginationProps}
              />,
            })),
          )(tabOption)
        }
        onChange={async (activeKey) => {
          if (activeKey !== '全部') {
            setData(mapWithIndex((item, index) => ({
              ...item,
              key: `${activeKey}-${index}`,
            }))(prop(activeKey)(productSkillInfos)));
          } else {
            setData(
              flow(
                mapWithIndex((item, index) => mapWithIndex((item2, index2) => ({
                  ...item2,
                  key: `${index}-${index2}`,
                }))(item)),
                flattenDepth(2),
              )(productSkillInfos),
            );
          }
          setCurrent(1);
        }}
      />
    </Layout>
  );
};

result.displayName = __filename;

export default result;
