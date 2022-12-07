/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import Layout from 'shared/components/layout';
import { Button, Spin, Table } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { useSelector } from 'react-redux';
import { getEntity, getEntityArray } from 'relient/selectors';
import useStyles from 'isomorphic-style-loader/useStyles';
import { useAction } from 'relient/actions';
import { readAll, create, update, remove, changeOrder } from 'shared/actions/skill-standard';
import { readAll as readSentence } from 'shared/actions/skill-standard-sentence';
import { useDetails } from 'relient-admin/hooks';
import { flow, sortBy } from 'lodash/fp';
import columns from './skill-standard-columns';
import CreateSkillStandard from './component/create-skill-standard';
import UpdateSkillStandard from './component/update-skill-standard';
import SkillStandardSentence from './component/skill-standard-sentence';
import s from './skill-standard.less';

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
      getEntityArray('skillStandard'),
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
  const [loading, setloading] = useState(false);

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
    setloading(true);
    if (oldIndex !== newIndex && newIndex !== -1) {
      try {
        await changeInfoOrder({ id: info[oldIndex].id, order: newIndex + 1 });
        await readAllInfo();
      } catch (e) {
        setloading(false);
      }
    }
    setloading(false);
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
      <Spin spinning={loading}>
        <Table
          className={s.StandardTable}
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
      </Spin>
      <CreateSkillStandard
        createVisible={createVisible}
        setCreateVisible={setCreateVisible}
        token={token}
        readAllInfo={readAllInfo}
        createInfo={createInfo}
      />
      <UpdateSkillStandard
        token={token}
        updateVisible={updateVisible}
        updateItem={updateItem}
        closeUpdate={closeUpdate}
        readAllInfo={readAllInfo}
        updateInfo={updateInfo}
      />
      <SkillStandardSentence
        sentenceVisible={sentenceVisible}
        sentenceItem={sentenceItem}
        closeSentence={closeSentence}
        readSentenceAction={readSentenceAction}
      />
    </Layout>
  );
};

result.displayName = __filename;

export default result;
