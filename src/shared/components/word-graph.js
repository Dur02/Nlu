import {
  string,
} from 'prop-types';
import React, { useCallback, useState } from 'react';
import { readWordGraph as readWordGraphAction } from 'shared/actions/skill';
import { Input, message, Divider } from 'antd';
import { useDispatch } from 'react-redux';
import useStyles from 'isomorphic-style-loader/useStyles';
import { map, values, flatten, flow, prop, nth, isObject } from 'lodash/fp';
import { volcano, orange, gold, yellow, lime, green, cyan, blue, purple, magenta } from '@ant-design/colors';
import classNames from 'classnames';
import { time } from 'relient/formatters';
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

const result = ({
  skillCode,
}) => {
  useStyles(s);
  const [input, setInput] = useState('');
  const [activeNodeIndex, setActiveNodeIndex] = useState();
  const [activeDocumentIndex, setActiveDocumentIndex] = useState();
  const [activeTextIndex, setActiveTextIndex] = useState();
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const onSubmit = useCallback(async () => {
    if (!input) {
      message.error('请输入内容');
      return;
    }
    if (input && prop(['wordGraph', 'input'])(response) === input) {
      message.warn('内容未变化');
      return;
    }
    if (input) {
      setLoading(true);
      try {
        const data = await dispatch(readWordGraphAction({ input, skillCode }));
        setResponse(data.data);
        setLoading(false);
      } catch (err) {
        // if (err.code === 'NOT_FIND_DATA') {
        //   // console.log('111');
        //   message.error(err.msg);
        // }
        setLoading(false);
      }
    }
  }, [dispatch, input, prop(['wordGraph', 'input'])(response)]);
  const onChange = useCallback(({ target }) => setInput(target.value), [setInput]);
  const nodes = flow(
    prop(['wordGraph', 'dictNodes']),
    values,
    flatten,
    mapWithIndex((item, index) => ({ ...item, index })),
  )(response);
  const activeNode = nodes && nodes[activeNodeIndex];
  const documents = prop('documents')(response);
  const activeDocument = documents && documents[activeDocumentIndex];
  const events = prop('tracker.events')(response);
  const { ReactJsonView } = global;

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
            [s.tagEntered]: activeNodeIndex >= 0 || activeDocumentIndex >= 0,
          })}
        >
          <div className={s.Input}>
            {flow(
              prop(['wordGraph', 'input']),
              mapWithIndex((text, index) => (
                <span
                  key={index}
                  className={classNames(s.Text, {
                    [s.activeText]: activeTextIndex === index
                    || (activeNode
                      && index >= activeNode.pos
                      && index < activeNode.pos + activeNode.length)
                    || (activeDocument
                      && index >= activeDocument.start
                      && index < activeDocument.end),
                  })}
                  onMouseEnter={() => setActiveTextIndex(index)}
                  onMouseLeave={() => setActiveTextIndex(undefined)}
                >
                  {text}
                  <span
                    className={s.Underline}
                    style={{
                      backgroundColor: getColor(activeNode ? activeNodeIndex : activeDocumentIndex),
                    }}
                  />
                </span>
              )),
            )(response)}
          </div>
          <Divider>词图</Divider>
          <div className={s.Tags}>
            {map(({ dictName, value, index, pos, length }) => (
              <div
                key={index}
                className={classNames(s.Tag, {
                  [s.activeTag]: activeNodeIndex === index
                  || (activeTextIndex >= pos && activeTextIndex < pos + length),
                })}
                style={{ backgroundColor: getLightColor(index), borderColor: getColor(index) }}
                onMouseEnter={() => setActiveNodeIndex(index)}
                onMouseLeave={() => setActiveNodeIndex(undefined)}
              >
                <div>词典名：{dictName}</div>
                <div>值：{isObject(value) ? value.value : value}</div>
              </div>
            ))(nodes)}
          </div>
          {nodes.length === 0 && <div className={s.Empty}>未解析出词图</div>}

          <Divider>文档</Divider>
          <div className={s.Tags}>
            {mapWithIndex(({ doc: { content, intentName }, weight, start, end }, index) => (
              <div
                key={index}
                className={classNames(s.Tag, {
                  [s.activeTag]: activeDocumentIndex === index
                  || (activeTextIndex >= start && activeTextIndex < end),
                })}
                style={{ backgroundColor: getLightColor(index), borderColor: getColor(index) }}
                onMouseEnter={() => setActiveDocumentIndex(index)}
                onMouseLeave={() => setActiveDocumentIndex(undefined)}
              >
                <div>内容：{content}</div>
                <div>权重：{weight}</div>
                <div>意图名：{intentName}</div>
              </div>
            ))(documents)}
          </div>
          {documents.length === 0 && <div className={s.Empty}>未解析出文档</div>}

          <Divider>日志</Divider>
          <div><b>Skill Code: </b>{prop('tracker.skillCode')(response)}</div>
          <div><b>Skill Version: </b>{prop('tracker.skillVersion')(response)}</div>
          <div><b>Request ID: </b>{prop('tracker.context.requestId')(response)}</div>
          <div><b>Skill Name: </b>{prop('tracker.skillName')(response)}</div>
          <Divider>日志详情</Divider>
          <div>
            {mapWithIndex(({ ts, message: eventMessage, data }, index) => (
              <div key={index}>
                <div><b>{time()(ts)}: </b>{eventMessage}</div>
                <ReactJsonView src={data} collapsed />
              </div>
            ))(events)}
          </div>
          {events.length === 0 && <div className={s.Empty}>无日志</div>}
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
