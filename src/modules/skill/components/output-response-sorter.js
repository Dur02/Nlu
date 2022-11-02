import React, { useCallback, useEffect, useState } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { func, string, array, bool } from 'prop-types';
import { Modal } from 'antd';
import { filter, find, map } from 'lodash/fp';
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

  // 后端要求默认值一直排最后不可变动
  const [defaultItem] = useState(find((item) => item.isDefault)(value));
  const [finalValue, setFinalValue] = useState(filter((item) => !item.isDefault)(value));

  useEffect(() => {
    setFinalValue(filter((item) => !item.isDefault)(value) || []);
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
      onOk={() => onChange([...finalValue, defaultItem])}
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
