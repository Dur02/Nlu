import React, { useEffect, useState } from 'react';
import { func, array } from 'prop-types';
import { Button } from 'antd';
import ListEditor from 'shared/components/list-editor';

const result = ({
  value,
  onChange,
  onCancel,
}) => {
  const [prompts, setPrompts] = useState(value);

  useEffect(() => {
    setPrompts(value);
  }, [value]);

  return (
    <div>
      <ListEditor
        placeholder="请输入提问"
        onChange={setPrompts}
        value={prompts}
      />

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
