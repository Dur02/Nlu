import React, { useState } from 'react';
import Layout from 'shared/components/layout';
import { useSelector } from 'react-redux';
import { flow, map, flattenDepth, findKey, concat, prop } from 'lodash/fp';
import { getEntity } from 'relient/selectors';
import { Table, Tabs } from 'antd';

const mapWithIndex = map.convert({ cap: false });

const result = () => {
  const {
    productSkillInfos,
    tabOption,
  } = useSelector((state) => ({
    productSkillInfos: getEntity('nluInfo')(state),
    tabOption: concat([{ label: '全部', key: '全部' }], flow(
      getEntity('nluInfo'),
      map((item) => ({
        label: findKey((o) => o === item)(getEntity('nluInfo')(state)),
        key: findKey((o) => o === item)(getEntity('nluInfo')(state)),
      })),
    )(state)),
  }));

  const columns = [{
    title: 'ID',
    dataIndex: 'id',
  }, {
    title: '技能名',
    dataIndex: 'name',
  }, {
    title: '技能code',
    dataIndex: 'code',
    width: 120,
  }, {
    title: '技能版本',
    dataIndex: 'version',
    width: 90,
  }, {
    title: '模型路径',
    dataIndex: 'modelPath',
  }, {
    title: '是否已加载',
    dataIndex: 'existCache',
    width: 110,
    render: (existCache) => (
      existCache === true ? '是' : '否'
    ),
  }, {
    title: '是否懒加载',
    dataIndex: 'lazyLoad',
    width: 110,
    render: (lazyLoad) => (
      lazyLoad === true ? '是' : '否'
    ),
  }];

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
    // 切换tab再换回来原表格会保持页码不变，要实现切换页签后重置页码的吗需要一个state
    total: data.length,
    pageSize,
    onChange: async (newPage, newPageSize) => {
      setCurrent(newPage);
      setPageSize(newPageSize);
    },
    showTotal: (total) => `共 ${total} 条`,
  };

  const getHeight = () => {
    const temp = paginationProps.pageSize;
    switch (temp) {
      case 10:
        return 680;
      case 20:
        return 1250;
      case 50:
        return 3000;
      default:
        return 5650;
    }
  };

  return (
    <Layout>
      <Tabs
        defaultActiveKey="全部"
        tabPosition="left"
        style={{
          height: getHeight(),
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
              key: index,
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
