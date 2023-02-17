import { at, map } from 'lodash/fp';
import React from 'react';
import { getPassed } from 'shared/constants/test-result';

export default ({
  errorCodeType,
}) => [{
  title: '测试用例ID',
  dataIndex: 'testCaseId',
}, {
  title: '用户说',
  dataIndex: 'refText',
}, {
  title: 'Joss链接',
  dataIndex: 'jossResult',
  render: (jossResult) => (jossResult ? <a href={jossResult} target="_blank" rel="noreferrer">点击跳转</a> : '无'),
}, {
  title: 'error',
  dataIndex: 'error',
  render: (error) => {
    // error可能用'[]'、''和null表示无错误，或者用json格式的array和字符串表示有错误
    if (error[0] !== '[' && error !== 'null') {
      return <span>{String(error)}</span>;
    }
    return map((item) => <p key={item}>{at(item)(errorCodeType)}</p>)(JSON.parse(error));
  },
}, {
  title: '是否通过',
  dataIndex: 'passed',
  render: (passed) => (
    <span
      style={{
        color: getPassed(passed) === '失败' ? 'red' : 'green',
      }}
    >
      {getPassed(passed)}
    </span>
  ),
}];
