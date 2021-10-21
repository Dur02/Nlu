import React, { useCallback, useEffect, useState } from 'react';
import { func, array } from 'prop-types';
import { Button, Input } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { map, reject } from 'lodash/fp';
import useStyles from 'isomorphic-style-loader/useStyles';

import s from './intent-slot-prompt.less';

const mapWithIndex = map.convert({ cap: false });
const rejectWithIndex = reject.convert({ cap: false });
const { Search } = Input;

const result = ({
  value,
  onChange,
  onCancel,
}) => {
  useStyles(s);

  const [prompts, setPrompts] = useState(value);
  const [newPrompt, setNewPrompt] = useState('');

  useEffect(() => {
    setPrompts(value);
  }, [value]);

  const onRemove = useCallback((index) => {
    setPrompts(rejectWithIndex((_, currentIndex) => currentIndex === index)(prompts));
  }, [prompts]);

  const onUpdate = useCallback((index) => ({ target }) => {
    setPrompts(mapWithIndex((originalValue, currentIndex) => {
      if (index === currentIndex) {
        return target.value;
      }
      return originalValue;
    })(prompts));
  }, [prompts]);

  const onAdd = useCallback(() => {
    if (newPrompt) {
      setPrompts([newPrompt, ...(prompts || [])]);
    }
    setNewPrompt('');
  }, [newPrompt]);

  const onChangeNewPrompt = useCallback(({ target }) => setNewPrompt(target.value), []);

  return (
    <div>
      <Search
        enterButton="添加"
        onChange={onChangeNewPrompt}
        onSearch={onAdd}
        placeholder="请输入提问"
        value={newPrompt}
        className={s.Add}
      />

      {mapWithIndex((prompt, index) => (
        <div key={index} className={s.Item}>
          <Input
            value={prompt}
            onChange={onUpdate(index)}
            suffix={<CloseOutlined className={s.Clear} onClick={() => onRemove(index)} />}
          />
        </div>
      ))(prompts)}

      <div>
        <Button type="primary" onClick={() => onChange(prompts)}>保存</Button>
        &nbsp;&nbsp;
        <Button onClick={onCancel}>取消</Button>
      </div>
    </div>
  );
};

result.displayName = __filename;

result.propTypes = {
  value: array,
  onChange: func.isRequired,
  onCancel: func.isRequired,
};

export default result;
