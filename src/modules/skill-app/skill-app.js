/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import Layout from 'shared/components/layout';
import { Button, Table } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { useSelector } from 'react-redux';
import { getEntity, getEntityArray } from 'relient/selectors';
import useStyles from 'isomorphic-style-loader/useStyles';
import { useAction } from 'relient/actions';
import { readAll, create, update, remove, changeOrder } from 'shared/actions/skill-app-info';
import { readAll as readSentence } from 'shared/actions/skill-app-sentence';
import { useDetails } from 'relient-admin/hooks';
import { flow, sortBy } from 'lodash/fp';
import columns from './skill-app-columns';
import CreateSkillApp from './component/create-skill-app';
import UpdateSkillApp from './component/update-skill-app';
import Sentence from './component/sentence';
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
    info: flow(
      getEntityArray('skillAppInfo'),
      sortBy('order'),
    )(state),
    token: getEntity('auth.authorization')(state),
  }));

  const readAllInfo = useAction(readAll);
  const createInfo = useAction(create);
  const updateInfo = useAction(update);
  const removeInfo = useAction(remove);
  const changeInfoOrder = useAction(changeOrder);
  const readSentenceAction = useAction(readSentence);

  const [createVisible, setCreateVisible] = useState(false);

  const {
    detailsVisible: updateVisible,
    openDetails: openUpdate,
    closeDetails: closeUpdate,
    detailsItem: updateItem,
  } = useDetails();

  const {
    detailsVisible: sentenceVisible,
    openDetails: openSentence,
    closeDetails: closeSentence,
    detailsItem: sentenceItem,
  } = useDetails();

  const onSortEnd = async ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex && newIndex !== -1) {
      await changeInfoOrder({ id: info[oldIndex].id, order: newIndex + 1 });
      await readAllInfo();
    }
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
    const index = info.findIndex((x) => x.id === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

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
        创建技能定义
      </Button>
      <Table
        dataSource={info}
        columns={columns({
          DragVisible: s.DragVisible,
          DragHandle,
          removeInfo,
          openUpdate,
          openSentence,
          readSentenceAction,
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
        readAllInfo={readAllInfo}
        createInfo={createInfo}
      />
      <UpdateSkillApp
        token={token}
        updateVisible={updateVisible}
        updateItem={updateItem}
        closeUpdate={closeUpdate}
        readAllInfo={readAllInfo}
        updateInfo={updateInfo}
      />
      <Sentence
        sentenceVisible={sentenceVisible}
        sentenceItem={sentenceItem}
        closeSentence={closeSentence}
        readAllInfo={readAllInfo}
      />
    </Layout>
  );
};

result.displayName = __filename;

export default result;
