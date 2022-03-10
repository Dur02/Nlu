import {
  string,
} from 'prop-types';
import React, { useCallback, useRef, useState } from 'react';
import { readWordGraph as readWordGraphAction } from 'shared/actions/skill';
import { Input, message } from 'antd';
import { useDispatch } from 'react-redux';
import useStyles from 'isomorphic-style-loader/useStyles';
import { map, values, flatten, flow, prop, nth, filter, propEq, join } from 'lodash/fp';
import { volcano, orange, gold, yellow, lime, green, cyan, blue, purple, magenta } from '@ant-design/colors';
import classNames from 'classnames';
import s from './word-graph.less';

const mapWithIndex = map.convert({ cap: false });
const { Search } = Input;

const presetColors = [lime, volcano, orange, cyan, gold, yellow, green, blue, purple, magenta];
const getColor = (index) => flow(
  map(nth(7)),
  nth(index % presetColors.length),
)(presetColors);
const getLightColor = (index) => flow(
  map(nth(3)),
  nth(index % presetColors.length),
)(presetColors);

const result = ({
  skillCode,
}) => {
  useStyles(s);
  const [input, setInput] = useState('');
  const [activeIndex, setActiveIndex] = useState();
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
  const dictNodes = flow(
    prop('dictNodes'),
    values,
    flatten,
    mapWithIndex((item, index) => ({ ...item, index })),
  )(response);
  const inputHtml = flow(
    prop('input'),
    mapWithIndex((text, index) => {
      const startWithThisText = filter(propEq('pos', index))(dictNodes);
      const endWithThisText = filter(({ pos, length }) => pos + length === index + 1)(dictNodes);
      return `${flow(
        map(({ index: nodeIndex }) => `<span class="${s.Node}" id="input-${nodeIndex}"><div class="${s.Underline}" style="background-color: ${getColor(
          nodeIndex)}"></div>`),
        join(''),
      )(startWithThisText)}${text}${flow(
        map(() => '</span>'),
        join(''),
      )(endWithThisText)}`;
    }),
    join(''),
  )(response);

  const line = useRef();

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
        <div className={classNames(s.Container, { [s.entered]: activeIndex >= 0 })}>
          <div className={s.Input} dangerouslySetInnerHTML={{ __html: inputHtml }} />
          <div className={s.Annotations}>
            {map(({ dictName, value, index }) => (
              <div
                className={classNames(s.Annotation, { [s.active]: activeIndex === index })}
                key={index}
                id={`dict-${index}`}
                style={{ backgroundColor: getLightColor(index), borderColor: getColor(index) }}
                onMouseEnter={() => {
                  line.current = new global.LeaderLine(
                    document.getElementById(`input-${index}`),
                    document.getElementById(`dict-${index}`),
                    { color: getColor(index), size: 2, startSocket: 'bottom' },
                  );
                  setActiveIndex(index);
                }}
                onMouseLeave={() => {
                  line.current.remove();
                  setActiveIndex(undefined);
                }}
              >
                <div>词典名：{dictName}</div>
                <div>值：{value}</div>
              </div>
            ))(dictNodes)}
          </div>
          {dictNodes.length === 0 && <div className={s.Empty}>未解析出词图</div>}
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
