import {
  string,
} from 'prop-types';
import React, { useCallback, useRef, useState } from 'react';
import { readWordGraph as readWordGraphAction } from 'shared/actions/skill';
import { Input, message } from 'antd';
import { useDispatch } from 'react-redux';
import useStyles from 'isomorphic-style-loader/useStyles';
import { map, values, flatten, flow, prop, nth, filter, isObject } from 'lodash/fp';
import { volcano, orange, gold, yellow, lime, green, cyan, blue, purple, magenta } from '@ant-design/colors';
import classNames from 'classnames';
import s from './word-graph.less';

const mapWithIndex = map.convert({ cap: false });
const { Search } = Input;

const presetColors = [lime, volcano, orange, cyan, gold, yellow, green, blue, purple, magenta];
const getColor = (index) => flow(
  map(nth(6)),
  nth(index % presetColors.length),
)(presetColors);
const getLightColor = (index) => flow(
  map(nth(2)),
  nth(index % presetColors.length),
)(presetColors);

const createLine = (textIndex, nodeIndex) => new global.LeaderLine(
  document.getElementById(`text-underline-${textIndex}`),
  document.getElementById(`node-${nodeIndex}`),
  { color: getColor(nodeIndex), size: 2, startSocket: 'bottom', path: 'magnet' },
);

const result = ({
  skillCode,
}) => {
  useStyles(s);
  const [input, setInput] = useState('');
  const [activeNodeIndex, setActiveNodeIndex] = useState();
  const [activeTextIndex, setActiveTextIndex] = useState();
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const onSubmit = useCallback(async () => {
    if (!input) {
      message.error('请输入内容');
      return;
    }
    if (input && response && response.input === input) {
      message.warn('内容未变化');
      return;
    }
    if (input) {
      setLoading(true);
      const data = await dispatch(readWordGraphAction({ input, skillCode }));
      setResponse(data[skillCode]);
      setLoading(false);
    }
  }, [dispatch, input, response && response.input]);
  const onChange = useCallback(({ target }) => setInput(target.value), [setInput]);
  const nodes = flow(
    prop('dictNodes'),
    values,
    flatten,
    mapWithIndex((item, index) => ({ ...item, index })),
  )(response);
  const activeNode = nodes[activeNodeIndex];

  const lines = useRef();

  return (
    <div>
      <Search
        enterButton="提交"
        onChange={onChange}
        onSearch={onSubmit}
        loading={loading}
        placeholder="请输入内容"
        value={input}
      />
      {response && (
        <div
          className={classNames(s.Container, {
            [s.textEntered]: activeTextIndex >= 0,
            [s.nodeEntered]: activeNodeIndex >= 0,
          })}
        >
          <div className={s.Input}>
            {mapWithIndex((text, index) => (
              <span
                className={classNames(s.Text, {
                  [s.activeText]: activeTextIndex === index
                  || (activeNode
                    && index >= activeNode.pos
                    && index < activeNode.pos + activeNode.length),
                })}
                onMouseEnter={() => {
                  lines.current = flow(
                    filter(({ pos, length }) => index >= pos && index < pos + length),
                    map((node) => createLine(index, node.index)),
                  )(nodes);
                  setActiveTextIndex(index);
                }}
                onMouseLeave={() => {
                  lines.current.forEach((line) => line.remove());
                  setActiveTextIndex(undefined);
                }}
              >
                {text}
                <span
                  id={`text-underline-${index}`}
                  className={s.Underline}
                  style={{ backgroundColor: getColor(activeNodeIndex) }}
                />
              </span>
            ))(response.input)}
          </div>
          <div className={s.Nodes}>
            {map(({ dictName, value, index, pos, length }) => (
              <div
                className={classNames(s.Node, {
                  [s.activeNode]: activeNodeIndex === index
                  || (activeTextIndex >= pos && activeTextIndex < pos + length),
                })}
                key={index}
                id={`node-${index}`}
                style={{ backgroundColor: getLightColor(index), borderColor: getColor(index) }}
                onMouseEnter={() => {
                  lines.current = [createLine(pos, index)];
                  setActiveNodeIndex(index);
                }}
                onMouseLeave={() => {
                  lines.current.forEach((line) => line.remove());
                  setActiveNodeIndex(undefined);
                }}
              >
                <div>词典名：{dictName}</div>
                <div>值：{isObject(value) ? value.value : value}</div>
              </div>
            ))(nodes)}
          </div>
          {nodes.length === 0 && <div className={s.Empty}>未解析出词图</div>}
        </div>
      )}
    </div>
  );
};

result.propTypes = {
  skillCode: string,
};

result.displayName = __filename;

export default result;
