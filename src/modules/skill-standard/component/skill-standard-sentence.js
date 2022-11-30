/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { Modal, Spin, Table } from 'antd';
import useStyles from 'isomorphic-style-loader/useStyles';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { MenuOutlined } from '@ant-design/icons';
import { useAction } from 'relient/actions';
import { create, update, remove, changeOrder } from 'shared/actions/skill-standard-sentence';
import { flow, propEq, sortBy, filter } from 'lodash/fp';
import { getEntityArray } from 'relient/selectors';
import { useSelector } from 'react-redux';
import columns from './skill-standard-sentence-columns';
import CreateSkillStandardSentence from './create-skill-standard-sentence';
import s from './skill-standard-sentence.less';

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
  readSentenceAction,
}) => {
  useStyles(s);

  const {
    sentences,
  } = useSelector((state) => {
    if (sentenceItem) {
      return ({
        sentences: flow(
          getEntityArray('skillStandardSentence'),
          filter(propEq('skillId', sentenceItem.id)),
          sortBy('order'),
        )(state),
      });
    }
    return ({
      sentences: [],
    });
  });

  const createSentence = useAction(create);
  const updateSentence = useAction(update);
  const removeSentence = useAction(remove);
  const changeSentenceOrder = useAction(changeOrder);

  const [loading, setloading] = useState(false);

  const onSortEnd = async ({ oldIndex, newIndex }) => {
    setloading(true);
    if (oldIndex !== newIndex && newIndex !== -1) {
      try {
        await changeSentenceOrder({ id: sentences[oldIndex].id, order: newIndex + 1 });
        await readSentenceAction({ id: sentenceItem.id });
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
    const index = sentences.findIndex((x) => x.id === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

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
            <CreateSkillStandardSentence
              standardId={sentenceItem.id}
              createSentence={createSentence}
              readSentenceAction={readSentenceAction}
            />
            <Spin spinning={loading}>
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
            </Spin>
          </Modal>
        )
      }
    </>
  );
};

result.displayName = __filename;

export default result;
