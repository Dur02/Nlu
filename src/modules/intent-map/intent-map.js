import React, { useCallback, useState } from 'react';
import Layout from 'shared/components/layout';
import { readAll, remove as removeIntentMap, update, create } from 'shared/actions/intent-map';
import { useAction } from 'relient/actions';
import {
  flow,
  map,
  prop,
  find,
  propEq,
  findKey,
  concat,
  reject,
} from 'lodash/fp';
import { getEntity } from 'relient/selectors';
import { useSelector } from 'react-redux';
import { Modal, Table, Select, Button, Form, message, Input } from 'antd';
import { useDetails } from 'relient-admin/hooks';
// import useStyles from 'isomorphic-style-loader/useStyles';
import columns from './intent-map-columns';
// import s from './intent-map.less';

const { useForm } = Form;

const result = ({
  initialData,
}) => {
  // useStyles(s);

  const readAllIntentMap = useAction(readAll);
  const onRemove = useAction(removeIntentMap);
  const onUpdate = useAction(update);
  const onCreate = useAction(create);

  const {
    detailsVisible: editorVisible,
    openDetails: openEditor,
    closeDetails: closeEditor,
    detailsItem: editorItem,
  } = useDetails();

  const [createForm] = useForm();
  const [updateForm] = useForm();

  const [intentOption, setIntentOption] = useState([]);
  const [data, setData] = useState({ // Table数据
    records: initialData.records,
    total: initialData.total,
    current: initialData.current,
    size: initialData.size,
  });
  const [createVisible, setCreateVisible] = useState(false);
  // const [intentMapName, setIntentMapName] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const {
    intentMapInfoOptions,
    skillInfos,
  } = useSelector((state) => ({
    intentMapInfoOptions: concat([{ label: '全部', value: '全部' }], flow(
      getEntity('intentMapInfo'),
      prop('intentMapNames'),
      map((item) => ({
        label: item,
        value: item,
      })),
    )(state)),
    skillInfos: flow(
      getEntity('intentMapInfo'),
      prop('skillInfos'),
    )(state),
  }));

  const paginationProps = {
    defaultCurrent: 1,
    defaultPageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: [10, 20, 50, 100],
    current: data.current,
    total: data.total,
    pageSize: data.size,
    onChange: async (newPage, newPageSize) => {
      const {
        data: dataTemp,
      } = await readAllIntentMap({
        page: newPage,
        pageSize: newPageSize,
        // intentMapName: intentMapName === '全部' ? '' : intentMapName,
        intentMapName: searchValue,
      });
      setData(dataTemp);
    },
    showTotal: (total) => `共 ${total} 条`,
  };

  const reload = async (current) => {
    const {
      data: dataTemp,
    } = await readAllIntentMap({
      // intentMapName: intentMapName === '全部' ? '' : intentMapName,
      page: current,
      pageSize: paginationProps.pageSize,
      intentMapName: searchValue,
    });
    setData(dataTemp);
  };

  const onSearch = useCallback(async (values) => {
    try {
      const {
        data: dataTemp,
      } = await readAllIntentMap({
        // intentMapName: intentMapName === '全部' ? '' : intentMapName,
        page: 1,
        pageSize: paginationProps.pageSize,
        intentMapName: values.intentMapName,
      });
      setSearchValue(values.intentMapName);
      setData(dataTemp);
    } catch (e) {
      setSearchValue('');
    }
  }, []);

  const createSubmit = useCallback(async (values) => {
    setLoading(true);
    try {
      const { msg } = await onCreate({
        ...values,
      });
      await reload(paginationProps.current);
      message.success(msg);
    } catch (e) {
      message.error(e.msg);
    }
    createForm.resetFields();
    setLoading(false);
    setCreateVisible(false);
  }, [loading, setLoading, createForm, createVisible, setCreateVisible]);

  const updateSubmit = useCallback(async (values) => {
    setLoading(true);
    try {
      const { msg } = await onUpdate({
        id: editorItem.id,
        ...values,
      });
      await reload(paginationProps.current);
      message.success(msg);
    } catch (e) {
      message.error(e.msg);
    }
    updateForm.resetFields();
    closeEditor();
    setLoading(false);
  }, [updateForm, editorItem, loading, setLoading]);

  return (
    <Layout>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
        <Button
          type="primary"
          size="large"
          onClick={() => {
            setCreateVisible(true);
          }}
          style={{
            marginBottom: '16px',
          }}
        >
          创建映射
        </Button>
        <Form
          style={{
            marginTop: '6px',
          }}
          layout="inline"
          onFinish={onSearch}
          autoComplete={false}
        >
          <Form.Item
            name="intentMapName"
            label="统计意图名"
          >
            <Input
              placeholder="输入统计意图名"
              allowClear
              autoComplete="off"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              ghost
            >
              查询
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Table
        // tableLayout="fixed"
        dataSource={data.records}
        columns={columns({
          onRemove,
          paginationProps,
          reload,
          openEditor,
          setIntentOption,
          skillInfos,
          updateForm,
        })}
        scroll={{
          y: 600,
        }}
        rowKey="id"
        pagination={paginationProps}
      />
      <Modal
        visible={createVisible}
        onOk={() => {
          createForm.resetFields();
          setIntentOption([]);
          setCreateVisible(false);
        }}
        onCancel={() => {
          createForm.resetFields();
          setIntentOption([]);
          setCreateVisible(false);
        }}
        title="创建映射"
        width={500}
        footer={null}
      >
        <Form
          form={createForm}
          name="basic"
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 14 }}
          autoComplete="off"
          onFinish={createSubmit}
        >
          <Form.Item
            label="技能"
            name="skillCode"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              allowClear
              optionFilterProp="label"
              options={
                map(({ skillCode, skillName }) => ({
                  label: skillName,
                  value: skillCode,
                }))(skillInfos)
              }
              onChange={async (skillCode) => {
                const selectedSkill = flow(
                  find(propEq('skillCode', skillCode)),
                  prop('intentNames'),
                )(skillInfos);
                setIntentOption(
                  map((item) => ({
                    label: findKey((o) => o === item)(selectedSkill),
                    value: findKey((o) => o === item)(selectedSkill),
                  }))(selectedSkill),
                );
                createForm.setFieldsValue({ intentName: null });
              }}
            />
          </Form.Item>
          <Form.Item
            label="意图"
            name="intentName"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              allowClear
              options={intentOption}
              onChange={(value) => {
                if (findKey((o) => o.label === value)(intentMapInfoOptions)) {
                  createForm.setFieldsValue({ intentMapName: `${value}` });
                }
              }}
            />
          </Form.Item>
          <Form.Item
            label="意图映射"
            name="intentMapName"
            rules={[{ required: true }]}
          >
            <Select
              options={reject({ label: '全部', value: '全部' })(intentMapInfoOptions)}
              showSearch
              allowClear
            />
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
              // loading={submitting}
              htmlType="submit"
              loading={loading}
            >
              创建
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {
        editorItem && (
          <Modal
            visible={editorVisible}
            onCancel={() => {
              closeEditor();
            }}
            destroyOnClose
            title={`${editorItem.id}修改`}
            width={500}
            footer={null}
          >
            <Form
              // 当使用useForm控制表单时，resetFields时初始值会是上一次的值而不能动态变化，因为modal和form的生命周期不一致
              // 当modal内嵌form，而form需要动态变化初始值时
              // 使用useForm搭配setFieldsValue或者不使用useForm使modal和form生命一致，通过initialValues设置初始值
              form={updateForm}
              name="basic"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 14 }}
              autoComplete="off"
              onFinish={updateSubmit}
              // initialValues={{
              //   refText: updateCaseItem.refText,
              //   expectedSkill: updateCaseItem.expectedSkill,
              //   expectedIntent: updateCaseItem.expectedIntent,
              //   jossShareUrl: updateCaseItem.jossShareUrl,
              //   level: updateCaseItem.level,
              // }}
            >
              <Form.Item
                label="技能"
                name="skillCode"
                rules={[{ required: true }]}
              >
                <Select
                  showSearch
                  allowClear
                  optionFilterProp="label"
                  options={
                    map(({ skillCode, skillName }) => ({
                      label: skillName,
                      value: skillCode,
                    }))(skillInfos)
                  }
                  onChange={async (skillCode) => {
                    const selectedSkill = flow(
                      find(propEq('skillCode', skillCode)),
                      prop('intentNames'),
                    )(skillInfos);
                    setIntentOption(
                      map((item) => ({
                        label: findKey((o) => o === item)(selectedSkill),
                        value: findKey((o) => o === item)(selectedSkill),
                      }))(selectedSkill),
                    );
                    updateForm.setFieldsValue({ intentName: null });
                  }}
                />
              </Form.Item>
              <Form.Item
                label="意图"
                name="intentName"
                rules={[{ required: true }]}
              >
                <Select
                  showSearch
                  allowClear
                  options={intentOption}
                />
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
                  修改
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        )
      }
    </Layout>
  );
};

result.displayName = __filename;

export default result;
