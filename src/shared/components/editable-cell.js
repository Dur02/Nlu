/* eslint-disable react/jsx-props-no-spreading,jsx-a11y/no-static-element-interactions */
import {
  string,
  func,
} from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Input, Spin } from 'antd';

const result = ({
  onSubmit,
  value,
  inputClassName,
}) => {
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingValue, setEditingValue] = useState(value);
  useEffect(() => {
    setEditingValue(value);
  }, [value]);
  const onChange = useCallback(({ target }) => {
    setEditingValue(target.value);
  }, [setEditingValue]);
  const onClick = useCallback(({ detail }) => {
    if (detail === 2) {
      setEditing(true);
    }
  }, [setEditing]);
  const onBlur = useCallback(() => {
    setEditing(false);
  }, [setEditing]);
  const onKeyPress = useCallback(async ({ key }) => {
    if (key === 'Enter') {
      setSubmitting(true);
      await onSubmit(editingValue);
      setSubmitting(false);
      setEditing(false);
    }
  }, [editingValue]);

  return editing ? (
    <Spin spinning={submitting}>
      <Input
        autoFocus
        className={inputClassName}
        value={editingValue}
        onChange={onChange}
        onBlur={onBlur}
        onKeyPress={onKeyPress}
      />
    </Spin>
  ) : (
    <div onClick={onClick}>{value}</div>
  );
};

result.propTypes = {
  onSubmit: func.isRequired,
  value: string,
  inputClassName: string,
};

result.displayName = __filename;

export default result;
