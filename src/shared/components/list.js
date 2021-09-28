/* eslint-disable react/jsx-props-no-spreading */
import {
  object,
  string,
  arrayOf,
  shape,
  func,
  oneOfType,
  oneOf,
  bool,
  node,
} from 'prop-types';
import React, { Fragment } from 'react';
import { map, prop, isFunction, flow, reduce, last, dropRight, isUndefined, filter } from 'lodash/fp';
import { Row, Col } from 'antd';
import useStyles from 'isomorphic-style-loader/useStyles';
import s from './list.less';

const mapWithIndex = map.convert({ cap: false });

const getDefaultTitleSpan = (perRow) => {
  if (perRow === 1) {
    return 4;
  }
  if (perRow === 3) {
    return 3;
  }
  return 8 / perRow;
};

const getDefaultContentSpan = (perRow) => (24 - getDefaultTitleSpan(perRow) * perRow) / perRow;

const result = ({
  items,
  dataSource,
  labelLayout,
  dataLayout,
  title,
  perRow = 1,
  operations,
}) => {
  useStyles(s);

  return (
    <div>
      {title && (
        <div className={s.Title}>
          <h3>{title}</h3>
          <div>{operations}</div>
        </div>
      )}
      {flow(
        filter(({ dataIndex, display }) => display === true
          || isUndefined(display)
          || (isFunction(display)
            && display(dataIndex ? prop(dataIndex)(dataSource) : dataSource, dataSource)),
        ),
        reduce((results, item) => {
          const lastResult = last(results);
          if (!lastResult) {
            return [[item]];
          }
          if (flow(last, prop('breakLine'))(lastResult) || lastResult.length >= perRow) {
            return [...results, [item]];
          }
          return [...dropRight(1, results), [...lastResult, item]];
        }, []),
        mapWithIndex((columns, index) => (
          <Row
            key={index}
            style={{ margin: '10px 0' }}
          >
            {map(({ dataIndex, title: itemTitle, render, rowClassName }) => (
              <Fragment key={dataIndex || itemTitle}>
                <Col
                  {...labelLayout || { span: getDefaultTitleSpan(perRow) }}
                  style={{ textAlign: 'right' }}
                  className={isFunction(rowClassName)
                    ? rowClassName(dataIndex ? prop(dataIndex)(dataSource) : dataSource, dataSource)
                    : rowClassName}
                >
                  {itemTitle}
                  ：
                </Col>
                <Col
                  {...dataLayout || { span: getDefaultContentSpan(perRow) }}
                  className={isFunction(rowClassName)
                    ? rowClassName(dataIndex ? prop(dataIndex)(dataSource) : dataSource, dataSource)
                    : rowClassName}
                >
                  {render
                    ? render(dataIndex ? prop(dataIndex)(dataSource) : dataSource, dataSource)
                    : prop(dataIndex)(dataSource)}
                </Col>
              </Fragment>
            ))(columns)}
          </Row>
        )),
      )(items)}
    </div>
  );
};

result.propTypes = {
  dataSource: object,
  title: string,
  items: arrayOf(
    shape({
      title: string.isRequired,
      dataIndex: string,
      render: func,
      display: bool,
      rowClassName: oneOfType([string, func]),
      breakLine: bool,
    }),
  ).isRequired,
  labelLayout: object,
  dataLayout: object,
  perRow: oneOf([1, 2, 3, 4]),
  operations: node,
};

result.displayName = __filename;

export default result;
