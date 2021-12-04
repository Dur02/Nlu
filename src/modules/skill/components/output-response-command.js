import React, { useCallback, useEffect, useState } from 'react';
import { func, string } from 'prop-types';
import { Input } from 'antd';

const { Search } = Input;

const result = ({
  value,
  onChange,
}) => {
  const [finalValue, setFinalValue] = useState(value || '');
  useEffect(() => {
    setFinalValue(value || '');
  }, [value]);

  const onInputChange = useCallback(({ target }) => {
    setFinalValue(target.value);
  }, [setFinalValue]);
  const onSave = useCallback(() => {
    onChange(`command://${finalValue}`);
  }, [finalValue, onChange]);

  return (
    <div>
      <Search
        addonBefore="command://"
        onSearch={onSave}
        onChange={onInputChange}
        value={finalValue.replace('command://', '')}
        enterButton="保存"
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
