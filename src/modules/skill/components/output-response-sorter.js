import React, { useCallback, useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { func, string, array, bool, node } from 'prop-types';
import { Modal, Button } from 'antd';
import { map, findIndex, propEq } from 'lodash/fp';
import useStyles from 'isomorphic-style-loader/useStyles';

import s from './output-response-sorter.less';

const SortableItem = ({
  id,
  children,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div className={s.Item} ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

SortableItem.propTypes = {
  id: string.isRequired,
  children: node,
};

const result = ({
  visible,
  onClose,
  value,
  onChange,
  title,
}) => {
  useStyles(s);

  const [finalValue, setFinalValue] = useState(value);
  useEffect(() => {
    setFinalValue(value || []);
  }, value);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setFinalValue((items) => {
        const oldIndex = findIndex(propEq('cId', active.id))(items);
        const newIndex = findIndex(propEq('cId', over.id))(items);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, [setFinalValue]);

  return (
    <Modal
      title={title}
      visible={visible}
      onClose={onClose}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={finalValue} strategy={verticalListSortingStrategy}>
          {map(({ cId, cnames }) => (
            <SortableItem key={cId} id={cId}>
              {cnames}
            </SortableItem>
          ))(finalValue)}
        </SortableContext>
      </DndContext>

      <Button onClick={onClose}>取消</Button>
      <Button onClick={onChange} type="primary">提交</Button>
    </Modal>
  );
};

result.displayName = __filename;

result.propTypes = {
  visible: bool.isRequired,
  onClose: func.isRequired,
  value: array,
  onChange: func.isRequired,
  title: string,
};

export default result;
