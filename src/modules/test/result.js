import React, { useCallback, useState } from 'react';
import Layout from 'shared/components/layout';
import { Row, Col, Select, Statistic, Table } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useAction } from 'relient/actions';
import { readAll as readAllResult } from 'shared/actions/test-job-result';
import { flow, map, prop, propEq, find, concat, filter, at, split } from 'lodash/fp';
import { getEntityArray } from 'relient/selectors';
import { useSelector } from 'react-redux';
import { getPassed } from 'shared/constants/test-job';
import useStyles from 'isomorphic-style-loader/useStyles';
import { resultColumns } from './test-job-columns';
import s from './result.less';
import ResultExpandable from './component/result-expandable';

const { Option } = Select;
const mapWithIndex = map.convert({ cap: false });

const result = ({
  jobId,
  title,
  numData,
  initResultId,
  errorDetail,
  errorCodeType,
}) => {
  useStyles(s);

  // 此方法实现redux取值，并在滚动时重新加载数据的一个问题就是可能已经存储的数据在滚动的时候可能还是会请求一次
  // 优化方法1:保留redux取值，但在滚动的时候判断当前类型的数据总量和total值是否相同进行加载。
  // 但如果加载中间页的时候，怎么通过判断数据个数阻止请求重复数据，以及如何获知滚动到何处才要发送请求
  // 优化方法2:通过state保留数据，在切换类型时重置空数组，在滚动时拼接数据。但state的数据量可能会很多
  // 建议通过state保存数据，通过redux如果想要取得合适的性能效果可能十分困难
  const {
    testJobResult,
  } = useSelector((state) => ({
    testJobResult: flow(
      getEntityArray('testJobResult'),
      filter(propEq('testJobId', jobId)),
    )(state),
  }));

  const readAllJobResult = useAction(readAllResult);

  const [loading, setLoading] = useState(false);
  const [isMore, setIsMore] = useState(initResultId.length !== numData.totalNum);
  // 记录滚动到第几页
  const [page, setPage] = useState(1);
  // Select下拉选择框的选项变更会导致passedFlag的变化
  const [passedFlag, setPassedFlag] = useState(-1);
  const [errorCode, setErrorCode] = useState('');
  // result的目前所有数据的id，通过这个state决定要显示的数据
  const [resultId, setResultId] = useState(initResultId);
  const [total, setTotal] = useState(numData.totalNum);

  const expandable = {
    expandedRowRender: (record) => {
      const expandedColumns = [{
        title: '测试项',
        dataIndex: 'assertion',
        render: (assertion) => (
          <span
            style={{
              color: '#207ab7',
              fontSize: '10px',
            }}
          >
            {assertion}
          </span>
        ),
      }, {
        title: '期待值',
        dataIndex: 'expected',
        render: (expected, jobResult) => {
          switch (jobResult.assertion) {
            case 'api params':
            case 'command params':
              return (
                <ResultExpandable
                  record={jobResult}
                  isExpected
                />
              );
            case 'slots':
              return (
                mapWithIndex((item, index) => {
                  if (find(item)(split(',')(jobResult.actual))) {
                    return (
                      <p
                        style={{
                          color: '#207ab7',
                          margin: 0,
                        }}
                        key={index}
                      >
                        {item}
                      </p>
                    );
                  }
                  return (
                    <p
                      style={{
                        color: '#ff0000',
                        margin: 0,
                      }}
                      key={index}
                    >
                      {item}
                    </p>
                  );
                })(split(',')(expected))
              );
            default:
              return (
                <span
                  style={{
                    color: '#207ab7',
                    fontSize: '10px',
                  }}
                >
                  {expected}
                </span>
              );
          }
        },
      }, {
        title: '实际值',
        dataIndex: 'actual',
        render: (actual, jobResult) => {
          switch (jobResult.assertion) {
            case 'api params':
            case 'command params':
              return (
                <ResultExpandable
                  record={jobResult}
                  isExpected={false}
                />
              );
            case 'slots':
              return (
                mapWithIndex((item, index) => {
                  if (find(item)(split(',')(jobResult.expected))) {
                    return (
                      <p
                        style={{
                          color: '#207ab7',
                          margin: 0,
                        }}
                        key={index}
                      >
                        {item}
                      </p>
                    );
                  }
                  return (
                    <p
                      style={{
                        color: '#ff0000',
                        margin: 0,
                      }}
                      key={index}
                    >
                      {item}
                    </p>
                  );
                })(split(',')(actual))
              );
            default:
              return (
                <span
                  style={{
                    color: '#207ab7',
                    fontSize: '10px',
                  }}
                >
                  {actual}
                </span>
              );
          }
        },
      }, {
        title: '是否通过',
        dataIndex: 'passed',
        render: (passed) => (
          <span
            style={{
              color: getPassed(passed) === '失败' ? 'red' : 'green',
              fontSize: '10px',
            }}
          >
            {getPassed(passed)}
          </span>
        ),
      }];

      return (
        <>
          <Table
            dataSource={mapWithIndex((item, index) => ({
              ...item, key: index,
            }))(JSON.parse(record.jobResult))}
            tableLayout="fixed"
            rowKey="key"
            columns={expandedColumns}
            pagination={false}
            size="small"
            bordered
          />
        </>
      );
    },
    rowExpandable: ({ jobResult }) => jobResult && jobResult !== '' && jobResult !== '[]',
  };

  const onScrollCapture = useCallback(async (e) => {
    const { scrollHeight, scrollTop, clientHeight } = e.target;
    // 滑到离底部还有100px时发送请求，isMore避免发送超过总数的页码获得空数据，!loading避免重复发送相同请求
    if (scrollHeight - scrollTop - clientHeight <= 100 && isMore && !loading) {
      setLoading(true);
      const {
        data: {
          data: resultData,
          total: resultTotal,
        },
      } = await readAllJobResult({
        jobId,
        page: 1 + page,
        pageSize: 100,
        passed: passedFlag === -1 ? '' : passedFlag,
        errorCode,
      });
      setPage(page + 1);
      setIsMore(concat(resultId, map(prop('id'))(resultData)).length !== resultTotal);
      setResultId(concat(resultId, map(prop('id'))(resultData)));
      setLoading(false);
    }
  }, [jobId, page, setPage, isMore, setIsMore, passedFlag, errorCode, testJobResult]);

  const getResultData = useCallback(() => map((id) => find(propEq('id', id))(testJobResult))(resultId),
    [resultId, testJobResult, setResultId],
  );

  return (
    <Layout subTitle={`${title}`}>
      <div className="tableContainer" onScrollCapture={onScrollCapture}>
        <Row gutter={32} justify="center" align="middle">
          <Col offset={3} span={5}>
            <Statistic title="成功" value={numData.passedNum} valueStyle={{ color: '#3f8600' }} />
          </Col>
          <Col span={5}>
            <Statistic title="失败" value={numData.failNum} valueStyle={{ color: '#cf1322' }} />
          </Col>
          <Col span={5}>
            <Statistic title="成功比" value={100 * numData.passedPercent} precision={2} suffix="%" />
          </Col>
          <Col span={5}>
            <Statistic title="总数" value={numData.totalNum} />
          </Col>
        </Row>
        <div className={s.ErrorDetail}>
          {
            map((item) => (
              <Statistic
                key={item.errorCode}
                title={at(item.errorCode)(errorCodeType)}
                value={item.failNum}
                style={{
                  flex: 1,
                  textAlign: 'center',
                }}
                valueStyle={{
                  color: '#cf1322',
                  fontSize: '12px',
                }}
              />
            ))(errorDetail)
          }
        </div>
        <Select
          defaultValue={-1}
          style={{
            width: 150,
            margin: '22px auto',
          }}
          onSelect={async (value) => {
            setLoading(true);
            // 切换结果类型后把滚动条重新移动到最上方，否则会进行多次请求直至上次滚动到的页数
            document.querySelector('#resultTable .ant-table-body').scrollTop = 0;
            if (typeof value === 'number') {
              try {
                const {
                  data: {
                    data: resultData,
                    total: resultTotal,
                  },
                } = await readAllJobResult({
                  jobId,
                  page: 1,
                  pageSize: 100,
                  passed: value === -1 ? '' : value,
                });
                setLoading(false);
                // setIsMore(testJobResult !== resultTotal);
                setTotal(resultTotal);
                setIsMore(map(prop('id'))(resultData).length !== resultTotal);
                setPage(1);
                setPassedFlag(value);
                setErrorCode('');
                setResultId(map(prop('id'))(resultData));
              } catch (e) {
                setLoading(false);
              }
            } else {
              try {
                const {
                  data: {
                    data: resultData,
                    total: resultTotal,
                  },
                } = await readAllJobResult({
                  jobId,
                  page: 1,
                  pageSize: 100,
                  errorCode: value,
                });
                setLoading(false);
                // setIsMore(testJobResult !== resultTotal);
                setTotal(resultTotal);
                setIsMore(map(prop('id'))(resultData).length !== resultTotal);
                setPage(1);
                setPassedFlag(-1);
                setErrorCode(value);
                setResultId(map(prop('id'))(resultData));
              } catch (e) {
                setLoading(false);
              }
            }
          }}
        >
          <Option value={-1}>全部</Option>
          <Option value={0}>未通过</Option>
          <Option value={1}>通过</Option>
          {
            mapWithIndex((item, index) => (
              <Option value={index} key={index}>{item}</Option>
            ))(errorCodeType)
          }
        </Select>
        <Table
          id="resultTable"
          className={s.ResultTable}
          dataSource={getResultData()}
          columns={resultColumns()}
          rowKey="id"
          size="small"
          pagination={false}
          expandable={expandable}
          bordered
          rowClassName={() => s.TableTr}
          scroll={{
            scrollToFirstRowOnChange: true,
            y: 'calc(90vh - 384px)',
          }}
        />
        <div style={{ textAlign: 'center' }}>当前类型共{total}条</div>
        { loading ? <div style={{ textAlign: 'center' }}><LoadingOutlined />加载中...</div> : null }
        { !isMore ? <div style={{ textAlign: 'center' }}>已全部加载</div> : null }
      </div>
    </Layout>
  );
};

result.displayName = __filename;

export default result;
