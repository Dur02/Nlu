import React, { useCallback, useEffect, useState } from 'react';
import { func, string } from 'prop-types';
import { Input, message } from 'antd';

const result = ({
  value,
  onChange,
}) => {
  const [finalValue, setFinalValue] = useState(value || []);
  useEffect(() => {
    setFinalValue(value || []);
  }, [value]);

  const onInputChange = useCallback(({ target }) => {
    setFinalValue(target.value);
  }, []);
  const onInputBlur = useCallback(({ target }) => {
    if (!target.value) {
      message.error('请输入指令');
      return;
    }
    onChange(target.value);
  }, []);

  return (
    <div>
      <Input
        addonBefore="command://"
        value={finalValue}
        onChange={onInputChange}
        onBlur={onInputBlur}
      />
    </div>
  );
};

result.displayName = __filename;

result.propTypes = {
  value: string,
  onChange: func.isRequired,
};

export default result;
