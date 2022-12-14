/* eslint-disable react/jsx-props-no-spreading,jsx-a11y/no-static-element-interactions */
import { string, func } from 'prop-types';
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
    return () => {
      setSubmitting(false);
      setEditing(false);
      setEditingValue(value);
    };
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
    setEditingValue(value);
    setEditing(false);
  }, [setEditingValue, setEditing, value]);

  const onKeyPress = useCallback(async ({ key }) => {
    if (key === 'Enter') {
      setSubmitting(true);
      try {
        await onSubmit(editingValue);
      } catch (e) {
        setEditingValue(value);
        setSubmitting(false);
      }
      setSubmitting(false);
      setEditing(false);
    }
  }, [editingValue, submitting]);

  const getHeight = () => ((value === '' || !value) ? '14px' : '100%');

  return editing ? (
    <Spin spinning={submitting}>
      <Input.TextArea
        autoFocus
        autoSize
        className={inputClassName}
        value={editingValue}
        onChange={onChange}
        onBlur={onBlur}
        onKeyPress={onKeyPress}
        // style={{ height: "50px" }}
      />
    </Spin>
  ) : (
    // 防止value为空，设置与字体等高的高度
    <div style={{ height: getHeight() }} onClick={onClick}>{value}</div>
  );
};

result.propTypes = {
  onSubmit: func.isRequired,
  value: string,
  inputClassName: string,
};

result.displayName = __filename;

export default result;
