import React, { useCallback, useEffect, useState } from 'react';
import { func, string } from 'prop-types';
import { Input } from 'antd';

const { Search } = Input;

const format = (value) => {
  if (!value) {
    return '';
  }
  return value.replace(/^(command:\/\/)+/, '');
};

const result = ({
  value,
  onChange,
}) => {
  const [finalValue, setFinalValue] = useState(format(value));
  useEffect(() => {
    setFinalValue(format(value));
  }, [value]);

  const onInputChange = useCallback(({ target }) => {
    setFinalValue(format(target.value));
  }, [setFinalValue]);
  const onSave = useCallback(() => {
    onChange(`${finalValue}`);
  }, [finalValue, onChange]);

  return (
    <div>
      <Search
        addonBefore="command://"
        onSearch={onSave}
        onChange={onInputChange}
        value={finalValue}
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
