import React, { useCallback, useEffect, useState } from 'react';
import Layout from 'shared/components/layout';
import { Row, Col, Modal, Select, Statistic, Table, Form, Radio, Button, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useAction } from 'relient/actions';
import { readAll, create, update, cancel as cancelTestJob } from 'shared/actions/test-job';
import { readAll as readAllResult, readNum, resultExport } from 'shared/actions/test-job-result';
import { useAPITable, useDetails } from 'relient-admin/hooks';
import moment from 'moment';
import { flow, map, prop, propEq, remove, find, concat } from 'lodash/fp';
import { getEntity, getEntityArray } from 'relient/selectors';
import { useSelector } from 'react-redux';
import { getAllProduct } from 'shared/selectors';
import { getPassed } from 'shared/constants/test-job';
import useStyles from 'isomorphic-style-loader/useStyles';
import { testJobColumns, resultColumns } from './test-job-columns';
import s from './job.less';

// const { Item } = Form;
const { Option } = Select;
const mapWithIndex = map.convert({ cap: false });

const getDataSource = (state) => flow(
  map((id) => getEntity(`testJob.${id}`)(state)),
  remove((o) => o === undefined),
);

const result = ({
  ids,
  total,
  current,
  size,
  caseData,
}) => {
  useStyles(s);

  const {
    product,
    testJobResult,
  } = useSelector((state) => ({
    product: getAllProduct(state),
    testJobResult: getEntityArray('testJobResult')(state),
  }));

  const {
    detailsVisible: resultVisible,
    openDetails: openResult,
    closeDetails: closeResult,
    detailsItem: resultItem,
  } = useDetails();

  const {
    detailsVisible: exportVisible,
    openDetails: openExport,
    closeDetails: closeExport,
    detailsItem: exportItem,
  } = useDetails();

  const readAllTestJob = useAction(readAll);
  const onCreate = useAction(create);
  const onUpdate = useAction(update);
  const onCancel = useAction(cancelTestJob);
  const readAllJobResult = useAction(readAllResult);
  const readResultNum = useAction(readNum);
  const onResultExport = useAction(resultExport);

  const [loading, setLoading] = useState(false);
  const [isMore, setIsMore] = useState(true);
  const [page, setPage] = useState(1);
  const [passedFlag, setPassedFlag] = useState('');
  const [resultId, setResultId] = useState([]);
  const [resultDetail, setResultDetail] = useState([]);

  const getFields = [{
    label: '标题',
    name: 'title',
    type: 'text',
    autoComplete: 'off',
    rules: [{ required: true }],
  }, {
    label: '测试集名',
    name: 'testSuiteId',
    component: Select,
    options: caseData,
    allowClear: true,
    rules: [{ required: true }],
  }, {
    element: <b style={{ position: 'relative', left: '80%' }}>Job配置项</b>,
    name: 'jonConfig',
  }, {
    name: ['jobConfig', 'productId'],
    label: '产品',
    placeholder: '产品',
    component: Select,
    options: map((i) => ({ ...i, value: i.id, label: i.name, key: i.id }))(product),
    allowClear: true,
    rules: [{ required: true }],
  }];

  const {
    tableHeader,
    pagination,
    data,
    openEditor,
    reload,
  } = useAPITable({
    paginationInitialData: {
      ids,
      total,
      current,
      size,
    },
    createButton: {
      text: '创建任务',
    },
    creator: {
      title: '创建任务',
      onSubmit: onCreate,
      fields: getFields,
      component: Modal,
    },
    editor: {
      title: '编辑任务',
      onSubmit: onUpdate,
      fields: getFields,
      component: Modal,
    },
    getDataSource,
    readAction: async (values) => {
      const {
        data: response,
      } = await readAllTestJob({
        ...values,
        status: values.status === -1 ? '' : values.status,
        page: values.page + 1,
        pageSize: values.size,
        startTime: moment(new Date(values.createTimeAfter)).startOf('day').toISOString(),
        endTime: moment(new Date(values.createTimeBefore)).endOf('day').toISOString(),
      });
      return {
        content: response.data,
        number: response.currentPage - 1,
        size: response.pageSize,
        totalElements: response.total,
      };
    },
    showReset: true,
    query: {
      fields: [{
        dataKey: 'title',
        label: '标题',
      }],
      searchWhenValueChange: false,
    },
    filters: [{
      dataKey: 'status',
      label: '状态',
      defaultValue: -1,
      options: [{
        value: -1,
        label: '全部',
      }, {
        value: 0,
        label: '未执行',
      }, {
        value: 1,
        label: '已执行',
      }, {
        value: 2,
        label: '已取消',
      }, {
        value: 3,
        label: '执行中',
      }],
    }],
    datePickers: [{
      dataKey: 'createTime',
      label: '起止日期',
      disabledDate: (date) => date.isAfter(new Date()),
    }],
  });

  const expandable = {
    expandedRowRender: (record) => {
      const expandedColumns = [{
        title: '实际值 ',
        dataIndex: 'actual',
        render: (actual) => (
          <span
            style={{
              color: '#207ab7',
              fontSize: '10px',
            }}
          >
            {actual}
          </span>
        ),
      }, {
        title: '期待值',
        dataIndex: 'expected',
        render: (expected) => (
          <span
            style={{
              color: '#207ab7',
              fontSize: '10px',
            }}
          >
            {expected}
          </span>
        ),
      }, {
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
    const flag1 = page;
    let flag2 = page;
    if (Math.floor(e.target.scrollTop / 3500) === page) {
      setPage(page + 1);
      flag2 += 1;
    }
    if (flag2 !== flag1) {
      setLoading(true);
      const {
        data: {
          data: resultData,
          total: resultTotal,
        },
      } = await readAllJobResult({
        jobId: resultItem.id,
        page: 1 + Math.floor(e.target.scrollTop / 3500),
        pageSize: 100,
        passed: passedFlag === -1 ? '' : passedFlag,
      });
      setLoading(false);
      setIsMore(concat(resultId, map(prop('id'))(resultData)).length !== resultTotal);
      setResultId(concat(resultId, map(prop('id'))(resultData)));
    }
  }, [page, setPage, resultItem, passedFlag, resultId, setResultId]);

  const getResultData = useCallback(
    () => map((id) => find(propEq('id', id))(testJobResult))(resultId),
    [resultId, testJobResult, setResultId]);

  const exportSubmit = useCallback(async (values) => {
    setLoading(true);
    try {
      const res = await onResultExport({ jobId: exportItem.id, passed: values.passed === -1 ? '' : values.passed });
      const blob = new Blob([res], { type: 'text/plain; charset=utf-8' });
      const blobURL = window.URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.style.display = 'none';
      tempLink.href = blobURL;
      const date = new Date();
      tempLink.setAttribute(
        'download',
        `${exportItem.title}(自动化测试结果导出)-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.csv`,
      );
      if (typeof tempLink.download === 'undefined') {
        tempLink.setAttribute('target', '_blank');
      }
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(blobURL);
      message.success('导出成功');
    } catch (e) {
      message.error('导出失败');
    }
    setLoading(false);
    closeExport();
  }, [exportItem, loading, setLoading]);

  useEffect(() => {
    const timer = setInterval(async () => {
      await reload();
    }, 10000);
    return () => {
      clearInterval(timer);
    };
  }, [reload]);

  return (
    <Layout>
      {tableHeader}
      <Table
        tableLayout="fixed"
        dataSource={data}
        columns={testJobColumns({
          openResult,
          readAllJobResult,
          onCancel,
          openEditor,
          product,
          caseData,
          setResultId,
          readResultNum,
          setResultDetail,
          openExport,
        })}
        rowKey="id"
        pagination={pagination}
      />
      {
        exportItem && (
          <Modal
            visible={exportVisible}
            onCancel={() => {
              closeExport();
            }}
            destroyOnClose
            title={`${exportItem.title}导出`}
            width={500}
            footer={null}
          >
            <Form
              name="basic"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 14 }}
              autoComplete="off"
              initialValues={{
                passed: -1,
              }}
              onFinish={exportSubmit}
            >
              <Form.Item
                label="类型"
                name="passed"
                rules={[{ required: true, message: '请输入类型!' }]}
              >
                <Radio.Group>
                  <Radio value={-1}>全部</Radio>
                  <Radio value={0}>未通过</Radio>
                  <Radio value={1}>已通过</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                wrapperCol={{
                  offset: 10,
                }}
              >
                <Button
                  type="primary"
                  ghost
                  size="middle"
                  htmlType="submit"
                  loading={loading}
                >
                  导出
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        )
      }
      {resultItem && (
        <Modal
          visible={resultVisible}
          destroyOnClose
          onCancel={async () => {
            // resultReset();
            setPage(1);
            setLoading(false);
            setIsMore(true);
            setResultId([]);
            setPassedFlag(-1);
            closeResult();
          }}
          footer={null}
          title={`${resultItem.title}结果查看`}
          width={800}
        >
          <div className="tableContainer" onScrollCapture={onScrollCapture}>
            <Row gutter={32} justify="center" align="middle">
              <Col offset={3} span={5}>
                <Statistic title="成功" value={resultDetail.passedNum} valueStyle={{ color: '#3f8600' }} />
              </Col>
              <Col span={5}>
                <Statistic title="失败" value={resultDetail.failNum} valueStyle={{ color: '#cf1322' }} />
              </Col>
              <Col span={5}>
                <Statistic title="成功比" value={100 * resultDetail.passedPercent} precision={2} suffix="%" />
              </Col>
              <Col span={5}>
                <Statistic title="总数" value={resultDetail.totalNum} />
              </Col>
            </Row>
            <Select
              defaultValue={-1}
              style={{
                width: 120,
                margin: '22px auto',
              }}
              onSelect={async (value) => {
                setLoading(true);
                const {
                  data: {
                    data: resultData,
                    total: resultTotal,
                  },
                } = await readAllJobResult({
                  jobId: resultItem.id,
                  page: 1,
                  pageSize: 100,
                  passed: value === -1 ? '' : value,
                });
                setLoading(false);
                setIsMore(map(prop('id'))(resultData).length !== resultTotal);
                setPage(1);
                setPassedFlag(value);
                setResultId(map(prop('id'))(resultData));
              }}
            >
              <Option value={-1}>全部</Option>
              <Option value={0}>未通过</Option>
              <Option value={1}>通过</Option>
            </Select>
            <Table
              dataSource={getResultData()}
              columns={resultColumns()}
              rowKey="id"
              size="small"
              pagination={false}
              expandable={expandable}
              bordered
              rowClassName={() => s.fuck}
              scroll={{
                scrollToFirstRowOnChange: true,
                y: 400,
              }}
            />
            { loading ? <div style={{ textAlign: 'center' }}><LoadingOutlined />加载中...</div> : null }
            { !isMore ? <div style={{ textAlign: 'center' }}>已全部加载</div> : null }
          </div>
        </Modal>
      )}
    </Layout>
  );
};

result.displayName = __filename;

export default result;
