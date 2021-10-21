import React, { useCallback, useEffect, useState } from 'react';
import { func, string, array } from 'prop-types';
import { Input } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { map, reject } from 'lodash/fp';
import useStyles from 'isomorphic-style-loader/useStyles';

import s from './list-editor.less';

const mapWithIndex = map.convert({ cap: false });
const rejectWithIndex = reject.convert({ cap: false });
const { Search } = Input;

const result = ({
  value,
  onChange,
  enterButton = '添加',
  placeholder = '请输入要添加的内容',
}) => {
  useStyles(s);

  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    onChange(value);
  }, [value]);

  const onRemove = useCallback((index) => {
    onChange(rejectWithIndex((_, currentIndex) => currentIndex === index)(value));
  }, [value]);

  const onUpdate = useCallback((index) => ({ target }) => {
    onChange(mapWithIndex((originalValue, currentIndex) => {
      if (index === currentIndex) {
        return target.value;
      }
      return originalValue;
    })(value));
  }, [value]);

  const onAdd = useCallback(() => {
    if (newItem) {
      onChange([newItem, ...(value || [])]);
    }
    setNewItem('');
  }, [newItem]);

  const onChangeNewItem = useCallback(({ target }) => setNewItem(target.value), []);

  return (
    <div>
      <Search
        enterButton={enterButton}
        onChange={onChangeNewItem}
        onSearch={onAdd}
        placeholder={placeholder}
        value={newItem}
        className={s.Add}
      />

      {mapWithIndex((item, index) => (
        <div key={index} className={s.Item}>
          <Input
            value={item}
            onChange={onUpdate(index)}
            suffix={<CloseOutlined className={s.Clear} onClick={() => onRemove(index)} />}
          />
        </div>
      ))(value)}
    </div>
  );
};

result.displayName = __filename;

result.propTypes = {
  value: array,
  onChange: func.isRequired,
  enterButton: string,
  placeholder: string,
};

export default result;
