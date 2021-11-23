import React, { useCallback, useEffect, useState } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { func, string, array, bool } from 'prop-types';
import { Modal } from 'antd';
import { map } from 'lodash/fp';
import useStyles from 'isomorphic-style-loader/useStyles';
import { arrayMoveImmutable } from 'shared/utils/helper';

import s from './output-response-sorter.less';

const mapWithIndex = map.convert({ cap: false });

const SortableItem = SortableElement(({ cnames }) => <div className={s.Item}>{cnames}</div>);

const SortableList = SortableContainer(({ items }) => (
  <div>
    {mapWithIndex(({ cId, cnames }, index) => (
      <SortableItem key={cId} index={index} cnames={cnames} />
    ))(items)}
  </div>
));

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
  }, [value]);
  const onSortEnd = useCallback(({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      setFinalValue((items) => arrayMoveImmutable(items, oldIndex, newIndex));
    }
  }, [setFinalValue]);

  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={onClose}
      onOk={() => onChange(finalValue)}
    >
      <SortableList helperClass={s.List} items={finalValue} onSortEnd={onSortEnd} />
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
