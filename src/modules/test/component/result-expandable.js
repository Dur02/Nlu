import React from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';
import { flow, map, prop, split, fromPairs, orderBy } from 'lodash/fp';
import s from './result-expandable.less';

const mapWithIndex = map.convert({ cap: false });

const result = ({
  record,
  isExpected,
}) => {
  useStyles(s);

  const getActual = () => {
    if (record.actual) {
      return (
        flow(
          prop('actual'),
          split(','),
          map((item) => split(': ')(item)),
          orderBy([0], 'asc'),
          fromPairs,
        )(record)
      );
    }
    return {};
  };

  const getExpected = () => {
    if (record.actual) {
      return (
        flow(
          prop('expected'),
          split(','),
          map((item) => split(': ')(item)),
          orderBy([0], 'asc'),
          fromPairs,
        )(record)
      );
    }
    return {};
  };

  const actual = getActual();
  const expected = getExpected();

  return (
    <>
      <div className={s.ExpandableTableCell}>
        {
          isExpected ? (
            mapWithIndex((item, index) => (
              (actual[index] !== item) ? (
                <p style={{ color: '#ff0000' }} key={index}>{index}: {item}</p>
              ) : (
                <p style={{ color: '#207ab7' }} key={index}>{index}: {item}</p>
              )
            ))(expected)
          ) : (
            mapWithIndex((item, index) => (
              (expected[index] !== item) ? (
                <p style={{ color: '#ff0000' }} key={index}>{index}: {item}</p>
              ) : (
                <p style={{ color: '#207ab7' }} key={index}>{index}: {item}</p>
              )
            ))(actual)
          )
        }
      </div>
    </>
  );
};

result.displayName = __filename;

export default result;
