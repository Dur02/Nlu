/* eslint-disable react/jsx-props-no-spreading,jsx-a11y/no-static-element-interactions */
import { string, func } from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Input, Spin, Tooltip } from 'antd';
import { flow, compact, map, split, flatten, difference, toString, includes, replace } from 'lodash/fp';
import { WarningOutlined } from '@ant-design/icons';

const result = ({
  onSubmit,
  value,
  inputClassName,
  slotNames,
}) => {
  // 为rule.js修改的editable-input-cell组件

  // 已添加说法的说法名经处理后去除#和|的数组
  const getSplitRuleName = () => {
    // 如果说法中有表示槽位的分隔符就进行处理,否则没有槽位直接返回slotNames
    if ((includes('{')(value) && includes('}')(value)) || (includes('#')(value))) {
      // 处理老说法中特有的以{}表示槽位,用##替代{},新说法也不会影响
      const str = flow(
        replace(/{/g, '#'),
        replace(/}/g, '#'),
      )(value);
      // 用正则表达式截取所有#之间的值作为一个数组
      const array = str.match(/#(.+?)#/g);
      // 最终获得包含所有槽位的数组
      return flow(
        map((item) => (replace(/#/g, '')(item))),
        // split('#'),
        compact,
        // 中文和英文的分隔符都要去除
        map((item) => split('｜')(item)),
        flatten,
        map((item) => split('|')(item)),
        flatten,
      )(array);
    }
    return slotNames;
  };

  // 与存在slots的名字进行对比确认是否有遗漏的语义槽未添加
  const compareArray = difference(getSplitRuleName(), slotNames);

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
    <div
      style={{
        color: compareArray.length === 0 ? '#000' : '#FF8D75',
      }}
      onClick={onClick}
    >
      {value}
      {
        compareArray.length !== 0 && (
          <Tooltip title={() => `缺失语义槽数据: ${toString(compareArray)}`}>
            <WarningOutlined />
          </Tooltip>
        )
      }
    </div>
  );
};

result.propTypes = {
  onSubmit: func.isRequired,
  value: string,
  inputClassName: string,
};

result.displayName = __filename;

export default result;
