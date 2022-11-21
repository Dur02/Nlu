/* eslint-disable react/jsx-props-no-spreading,jsx-a11y/no-static-element-interactions */
import {
  string,
  func,
} from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Input, Spin } from 'antd';
import { flow, compact, map, split, flatten, difference } from 'lodash/fp';

const result = ({
  onSubmit,
  value,
  inputClassName,
  slotNames,
}) => {
  const splitRuleName = flow(
    split('#'),
    compact,
    map((item) => split('｜')(item)),
    flatten,
  )(value);
  const compareArray = difference(splitRuleName, slotNames);

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
    <div style={{ color: compareArray.length === 0 ? '#000' : '#FF8D75' }} onClick={onClick}>{value}</div>
  );
};

result.propTypes = {
  onSubmit: func.isRequired,
  value: string,
  inputClassName: string,
};

result.displayName = __filename;

export default result;
