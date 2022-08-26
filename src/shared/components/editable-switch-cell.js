/* eslint-disable react/jsx-props-no-spreading */
import {
  string,
  func,
  bool,
} from 'prop-types';
import React, { useCallback, useState } from 'react';
import { Switch } from 'antd';

const result = ({
  onChange,
  value,
  className,
  ...props
}) => {
  const [submitting, setSubmitting] = useState(false);
  const change = useCallback(async (checked) => {
    setSubmitting(true);
    try {
      await onChange(checked);
      setSubmitting(false);
    } catch (e) {
      setSubmitting(false);
    }
  }, [onChange, setSubmitting]);

  return (
    <Switch
      className={className}
      onChange={change}
      loading={submitting}
      checked={value}
      {...props}
    />
  );
};

result.propTypes = {
  onChange: func.isRequired,
  value: bool,
  className: string,
};

result.displayName = __filename;

export default result;
