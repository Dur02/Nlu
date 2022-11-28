/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-console */
import React, { useState } from 'react';
import Layout from 'shared/components/layout';
import { Button, Table } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { useSelector } from 'react-redux';
import { getEntity } from 'relient/selectors';
import useStyles from 'isomorphic-style-loader/useStyles';
import columns from './skill-app-columns';
import CreateSkillApp from './component/create-skill-app';
import s from './skill-app.less';

const DragHandle = SortableHandle(() => (
  <MenuOutlined
    style={{
      cursor: 'grab',
      color: '#999',
    }}
  />
));
const SortableItem = SortableElement((props) => <tr {...props} />);
const SortableBody = SortableContainer((props) => <tbody {...props} />);

const result = () => {
  useStyles(s);

  const {
    info,
    token,
  } = useSelector((state) => ({
    info: getEntity('skillAppInfo')(state),
    token: getEntity('auth.authorization')(state),
  }));

  console.log(info);

  const [createVisible, setCreateVisible] = useState(false);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    console.log(oldIndex);
    console.log(newIndex);
    // if (oldIndex !== newIndex) {
    //   const newData = arrayMoveImmutable(dataSource.slice(), oldIndex, newIndex).filter(
    //     (el) => !!el,
    //   );
    //   console.log('Sorted items: ', newData);
    //   setDataSource(newData);
    // }
  };

  const DraggableContainer = (props) => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass={s.RowDragging}
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow = ({ ...restProps }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = info.findIndex((x) => x.order === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  // const expandable = {
  //   expandedRowRender: (record) => {
  //     const expandedColumns = [{
  //       title: 'ID',
  //       dataIndex: 'id',
  //     }, {
  //       title: '说法名',
  //       dataIndex: 'sentenceName',
  //     }, {
  //       title: '创建时间',
  //       dataIndex: 'createTime',
  //     }, {
  //       title: '更新时间',
  //       dataIndex: 'updateTime',
  //     }];
  //
  //     return (
  //       <Table
  //         dataSource={record.sentences}
  //         tableLayout="fixed"
  //         rowKey="id"
  //         columns={expandedColumns}
  //         pagination={false}
  //       />
  //     );
  //   },
  //   rowExpandable: ({ sentences }) => sentences && sentences.length !== 0,
  // };

  return (
    <Layout>
      <Button
        type="primary"
        size="large"
        style={{
          marginBottom: '16px',
        }}
        onClick={() => {
          setCreateVisible(true);
        }}
      >
        上传技能定义
      </Button>
      <Table
        dataSource={info}
        columns={columns({
          DragVisible: s.DragVisible,
          DragHandle,
        })}
        tableLayout="fixed"
        rowKey="id"
        scroll={{
          y: 800,
        }}
        pagination={false}
        // expandable={expandable}
        components={{
          body: {
            wrapper: DraggableContainer,
            row: DraggableBodyRow,
          },
        }}
      />
      <CreateSkillApp
        createVisible={createVisible}
        setCreateVisible={setCreateVisible}
        token={token}
      />
    </Layout>
  );
};

result.displayName = __filename;

export default result;
