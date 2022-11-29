/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import { Modal, Table } from 'antd';
import useStyles from 'isomorphic-style-loader/useStyles';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { MenuOutlined } from '@ant-design/icons';
import { useAction } from 'relient/actions';
import { create, update, remove, changeOrder } from 'shared/actions/skill-app-sentence';
import { flow, sortBy } from 'lodash/fp';
import { getEntityArray } from 'relient/selectors';
import { useSelector } from 'react-redux';
import columns from './sentence-columns';
import CreateSentence from './create-sentence';
import s from './sentence.less';

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

const result = ({
  sentenceVisible,
  sentenceItem,
  closeSentence,
  readAllInfo,
}) => {
  useStyles(s);

  const {
    sentences,
  } = useSelector((state) => ({
    sentences: flow(
      getEntityArray('skillAppSentence'),
      sortBy('order'),
    )(state),
  }));

  const createSentence = useAction(create);
  const updateSentence = useAction(update);
  const removeSentence = useAction(remove);
  // eslint-disable-next-line no-unused-vars
  const changeSentenceOrder = useAction(changeOrder);

  // eslint-disable-next-line no-unused-vars
  const onSortEnd = async ({ oldIndex, newIndex }) => {
    // if (oldIndex !== newIndex && newIndex !== -1) {
    //   await changeOrderAction({ id: info[oldIndex].id, order: newIndex + 1 });
    //   await readAllInfo();
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
    const index = sentences.findIndex((x) => x.id === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  useEffect(() => {

  }, []);

  return (
    <>
      {
        sentenceItem && (
          <Modal
            open={sentenceVisible}
            footer={null}
            onCancel={() => {
              closeSentence();
            }}
            width={800}
          >
            <CreateSentence
              appSkillId={sentenceItem.id}
              createSentence={createSentence}
              readAllInfo={readAllInfo}
            />
            <Table
              size="small"
              dataSource={sentences}
              columns={columns({
                DragVisible: s.DragVisible,
                DragHandle,
                updateSentence,
                removeSentence,
              })}
              rowKey="id"
              pagination={false}
              scroll={{
                y: 500,
              }}
              components={{
                body: {
                  wrapper: DraggableContainer,
                  row: DraggableBodyRow,
                },
              }}
            />
          </Modal>
        )
      }
    </>
  );
};

result.displayName = __filename;

export default result;
