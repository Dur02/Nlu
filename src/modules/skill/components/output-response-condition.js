import React, { useCallback, useEffect, useState } from 'react';
import { func, string, array, bool } from 'prop-types';
import { Drawer, message, Button, Input, Select } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { map, any, reject } from 'lodash/fp';
import { EXIST, REQUIRED, EQUAL, conditionTypeOptions } from 'shared/constants/condition-type';
import useStyles from 'isomorphic-style-loader/useStyles';

import s from './output-response-condition.less';

const mapWithIndex = map.convert({ cap: false });
const rejectWithIndex = reject.convert({ cap: false });

const result = ({
  visible,
  onClose,
  value,
  onChange,
  title,
}) => {
  useStyles(s);

  const [finalValue, setFinalValue] = useState();
  const onAdd = useCallback(() => {
    if (any(({ params, type }) => {
      if (type === EXIST || type === REQUIRED) {
        if (!params[0]) {
          return true;
        }
      }
      // else if (!params[0] || !params[1]) {
      //   return true;
      // }
      return false;
    })(finalValue)) {
      message.error('请完善条件');
      return;
    }
    setFinalValue([{ params: [], type: EQUAL }, ...finalValue]);
  }, [finalValue]);
  const onParamUpdate = useCallback(
    (index, paramIndex) => ({ target }) => setFinalValue(
      mapWithIndex((item, currentIndex) => {
        if (index === currentIndex) {
          return {
            ...item,
            params: paramIndex === 0
              ? [target.value, item.params[1]]
              : [item.params[0], target.value],
          };
        }
        return item;
      })(finalValue)),
    [finalValue],
  );
  const onTypeUpdate = useCallback(
    (index) => (type) => setFinalValue(
      mapWithIndex((item, currentIndex) => {
        if (index === currentIndex) {
          return {
            ...item,
            type,
          };
        }
        return item;
      })(finalValue)),
    [finalValue],
  );
  const onRemove = useCallback((index) => () => setFinalValue(
    rejectWithIndex((_, currentIndex) => index === currentIndex)(finalValue),
  ), [finalValue]);
  const onConfirm = useCallback(() => {
    if (finalValue.length === 0) {
      message.error('请至少填写一个条件');
      return;
    }
    onChange(finalValue);
  }, [finalValue, onChange]);

  useEffect(() => {
    setFinalValue(value || []);
  }, [value]);

  return (
    <Drawer
      title={title}
      visible={visible}
      onClose={onClose}
      width={600}
    >
      <ol>
        <li>可根据语义槽取值，API资源的查询结果，以及客户端的状态，输出不同的对话回复。“#”引用语义槽，“$”引用查询结果。</li>
        <li>设定对话条件，根据上一轮的意图输出不同的对话回复</li>
      </ol>

      <div className={s.AddWrapper}>
        <Button type="primary" onClick={onAdd}>新增条件项</Button>
      </div>

      {mapWithIndex(({ params, type }, index) => (
        <div key={index} className={s.Item}>
          <Input
            value={params[0]}
            onChange={onParamUpdate(index, 0)}
            placeholder="请输入内容"
          />
          <Select
            options={conditionTypeOptions}
            value={type}
            onChange={onTypeUpdate(index)}
            className={s.Select}
          />
          <Input
            value={params[1]}
            onChange={onParamUpdate(index, 1)}
            placeholder="请输入数字或字符"
          />
          <Button size="small" shape="circle" icon={<CloseOutlined />} onClick={onRemove(index)} />
        </div>
      ))(finalValue)}

      <div>
        <Button type="primary" onClick={onConfirm}>确定</Button>
        &nbsp;&nbsp;
        <Button onClick={onClose}>取消</Button>
      </div>
    </Drawer>
  );
};

result.displayName = __filename;

result.propTypes = {
  visible: bool.isRequired,
  onClose: func.isRequired,
  value: array,
  onChange: func.isRequired,
  title: string,
};

export default result;
