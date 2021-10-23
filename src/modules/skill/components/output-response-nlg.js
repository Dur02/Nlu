import React, { useCallback, useEffect, useState } from 'react';
import { func, array } from 'prop-types';
import { Input, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { map, reject } from 'lodash/fp';
import useStyles from 'isomorphic-style-loader/useStyles';

import s from './output-response-nlg.less';

const mapWithIndex = map.convert({ cap: false });
const rejectWithIndex = reject.convert({ cap: false });
const { Search } = Input;

const result = ({
  value,
  onChange,
}) => {
  useStyles(s);

  const [newItem, setNewItem] = useState('');
  const [finalValue, setFinalValue] = useState(value || []);
  useEffect(() => {
    setFinalValue(value || []);
  }, [value]);

  const onChangeItem = useCallback((index) => ({ target }) => {
    setFinalValue(mapWithIndex((originalValue, currentIndex) => {
      if (index === currentIndex) {
        return target.value;
      }
      return originalValue;
    })(finalValue));
  }, [finalValue]);
  const onRemove = useCallback((index) => {
    onChange(rejectWithIndex((_, currentIndex) => currentIndex === index)(finalValue));
  }, [finalValue]);

  const onUpdate = useCallback((index) => ({ target }) => {
    if (!target.value) {
      message.error('请输入回复内容');
      return;
    }
    onChange(mapWithIndex((originalValue, currentIndex) => {
      if (index === currentIndex) {
        return target.value;
      }
      return originalValue;
    })(finalValue));
  }, [finalValue]);

  const onAdd = useCallback(() => {
    if (newItem) {
      onChange([newItem, ...finalValue]);
    }
    setNewItem('');
  }, [newItem, finalValue]);

  const onChangeNewItem = useCallback(({ target }) => setNewItem(target.value), []);

  return (
    <div>
      <Search
        enterButton="添加回复内容"
        onChange={onChangeNewItem}
        onSearch={onAdd}
        placeholder="请输入回复内容"
        value={newItem}
        className={s.Add}
      />

      {mapWithIndex((item, index) => (
        <div key={index} className={s.Item}>
          <Input
            value={item}
            onChange={onChangeItem(index)}
            onBlur={onUpdate(index)}
            suffix={<CloseOutlined className={s.Clear} onClick={() => onRemove(index)} />}
          />
        </div>
      ))(finalValue)}
    </div>
  );
};

result.displayName = __filename;

result.propTypes = {
  value: array,
  onChange: func.isRequired,
};

export default result;
