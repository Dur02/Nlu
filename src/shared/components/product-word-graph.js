import {
  string,
} from 'prop-types';
import React, { useCallback, useState } from 'react';
import { Input, message, Divider, Card } from 'antd';
import { useDispatch } from 'react-redux';
import useStyles from 'isomorphic-style-loader/useStyles';
import { map, values, flatten, flow, prop, nth, isObject } from 'lodash/fp';
import { volcano, orange, gold, yellow, lime, green, cyan, blue, purple, magenta } from '@ant-design/colors';
import classNames from 'classnames';
// import { time } from 'relient/formatters';
import { readWordGraph as readWordGraphAction } from '../actions/product';
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
  productId,
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
      const data = await dispatch(readWordGraphAction({ input, productId }));
      setResponse(data.data);
      setLoading(false);
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
      {
        response && (
          <div className={s.Input} style={{ marginTop: '20px' }}>
            {flow(
              prop(['wordGraph', 'input']),
              mapWithIndex((text, index2) => (
                <span
                  key={index2}
                  className={classNames(s.Text, {
                    [s.activeText]: activeTextIndex === index2
                    || (activeNode
                      && index2 >= activeNode.pos
                      && index2 < activeNode.pos + activeNode.length)
                    || (activeDocument
                      && index2 >= activeDocument.start
                      && index2 < activeDocument.end),
                  })}
                  onMouseEnter={() => setActiveTextIndex(index2)}
                  onMouseLeave={() => setActiveTextIndex(undefined)}
                >
                  {text}
                  <span
                    className={s.Underline}
                    style={{
                      backgroundColor: getColor(activeNode ? activeNodeIndex
                        : activeDocumentIndex),
                    }}
                  />
                </span>
              )),
            )(response[0])}
          </div>
        )
      }
      {
        mapWithIndex((item, index) => (
          <div
            key={index}
            className={classNames(s.Container, {
              [s.textEntered]: activeTextIndex >= 0,
              [s.tagEntered]: activeNodeIndex >= 0 || activeDocumentIndex >= 0,
            })}
          >
            <Card>
              <Divider>词图</Divider>

              <div className={s.Tags}>
                {flow(
                  prop(['wordGraph', 'dictNodes']),
                  values,
                  flatten,
                  mapWithIndex(({ dictName, value, pos, length }, index2) => (
                    <div
                      key={index2}
                      className={classNames(s.Tag, {
                        [s.activeTag]: activeNodeIndex === index2
                        || (activeTextIndex >= pos
                        && activeTextIndex < pos + length),
                      })}
                      style={{
                        backgroundColor: getLightColor(index2),
                        borderColor: getColor(index2),
                      }}
                      onMouseEnter={() => setActiveNodeIndex(index2)}
                      onMouseLeave={() => setActiveNodeIndex(undefined)}
                    >
                      <div>词典名：{dictName}</div>
                      <div>值：{isObject(value) ? value.value : value}</div>
                    </div>
                  )),
                )(item)}
              </div>
              {
                // eslint-disable-next-line no-console
                console.log(item)
              }
              {item.wordGraph.dictNodes.length === 0
              && <div className={s.Empty}>未解析出词图</div>}

              <Divider>文档</Divider>
              <div className={s.Tags}>
                {mapWithIndex(({ doc: { content, intentName }, weight, start, end }, index2) => (
                  <div
                    key={index2}
                    className={classNames(s.Tag, {
                      [s.activeTag]: activeDocumentIndex === index2
                      || (activeTextIndex >= start && activeTextIndex < end),
                    })}
                    style={{
                      backgroundColor: getLightColor(index2),
                      borderColor: getColor(index2),
                    }}
                    onMouseEnter={() => setActiveDocumentIndex(index2)}
                    onMouseLeave={() => setActiveDocumentIndex(undefined)}
                  >
                    <div>内容：{content}</div>
                    <div>权重：{weight}</div>
                    <div>意图名：{intentName}</div>
                  </div>
                ))(item.documents)}
              </div>
              {item.documents.length === 0 && <div className={s.Empty}>未解析出文档</div>}

              <Divider>日志</Divider>
              <div><b>Skill Code: </b>{prop('tracker.skillCode')(item)}</div>
              <div><b>Skill Version: </b>{prop('tracker.skillVersion')(item)}</div>
              <div><b>Request ID: </b>{prop('tracker.context.requestId')(item)}</div>
              <div><b>Skill Name: </b>{prop('tracker.skillName')(item)}</div>
            </Card>
          </div>
        ))(response)
      }
    </div>
  );
};

result.propTypes = {
  skillCode: string,
};

result.displayName = __filename;

export default result;
