import React, { useCallback, useState } from 'react';
import { Button, Form, Input, Modal, Table, Tooltip, Radio, Upload, message } from 'antd';
import { getWithBaseUrl } from 'relient/url';
import getConfig from 'relient/config';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { flow, map } from 'lodash/fp';
import { string, func } from 'prop-types';
import { create } from 'shared/actions/test-suite';
import { useAction } from 'relient/actions';
import { errorColumns } from './test-suite-import-columns';

const mapWithIndex = map.convert({ cap: false });
const { useForm, useWatch } = Form;

const result = ({
  token,
  reload,
}) => {
  const createSuite = useAction(create);

  const [suiteForm] = useForm();
  const formTitle = useWatch('title', suiteForm);
  const formSuiteType = useWatch('suiteType', suiteForm);

  const [suiteVisible, setSuiteVisible] = useState(false);
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);
  const [Uploading, setUploading] = useState(false);
  // const [intentOption, setIntentOption] = useState([]);

  const suiteSubmit = useCallback(async (values) => {
    setLoading(true);
    try {
      const { msg } = await createSuite({ ...values });
      message.success(msg);
    } catch (e) {
      // message.error(e.msg);
    }
    suiteForm.resetFields();
    await reload();
    setLoading(false);
    setSuiteVisible(false);
  }, [loading, setLoading, suiteForm, suiteVisible, setSuiteVisible]);

  const onUpload = useCallback(async ({ file: { status, response } }) => {
    setUploading(true);
    if (status === 'done') {
      if (response.code === 'SUCCESS') {
        message.success('检查完成，测试文件格式正确');
        await reload();
        message.success('上传成功');
      } else if (response.data && response.data.length > 0) {
        flow(mapWithIndex((item, index) => ({ ...item, key: index + 1 })), setError)(response.data);
      } else {
        message.error(response.msg);
      }
      setUploading(false);
      suiteForm.resetFields();
      setSuiteVisible(false);
    } else if (status === 'error') {
      message.error(response ? response.msg : '上传失败，请稍后再试');
      setUploading(false);
      suiteForm.resetFields();
      setSuiteVisible(false);
    }
  }, [setUploading, setSuiteVisible, suiteForm]);

  return (
    <>
      <Button
        type="primary"
        size="large"
        style={{
          position: 'absolute',
          top: 20,
          left: 24,
        }}
        onClick={() => {
          setSuiteVisible(true);
        }}
      >
        创建测试集
      </Button>
      <a
        href={`${getWithBaseUrl('/template2.xlsx', getConfig('baseUrl'))}`}
        download="用例导入模板.xlsx"
      >
        <Tooltip
          title="下载模板"
          placement="top"
        >
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            size="large"
            ghost
            style={{
              position: 'absolute',
              top: 20,
              left: 156,
            }}
          />
        </Tooltip>
      </a>
      <Modal
        visible={suiteVisible}
        onOk={() => {
          suiteForm.resetFields();
          setSuiteVisible(false);
        }}
        onCancel={() => {
          suiteForm.resetFields();
          setSuiteVisible(false);
        }}
        title="创建测试集"
        width={500}
        footer={null}
      >
        <Form
          form={suiteForm}
          name="basic"
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 14 }}
          initialValues={{
            suiteType: 0,
          }}
          autoComplete="off"
          onFinish={suiteSubmit}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入标题!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="类型"
            name="suiteType"
            rules={[{ required: true, message: '请输入类型!' }]}
          >
            <Radio.Group>
              <Radio value={0}>普通文本/语音测试</Radio>
              <Radio value={1}>端到端结果测试</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="描述"
            name="description"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="文件导入"
            shouldUpdate={(preValues, curValues) => preValues.title !== curValues.title}
          >
            <Upload
              name="file"
              onChange={onUpload}
              showUploadList={false}
              action={
                () => `/skill/edit/test/suite/import?title=${formTitle}&suiteType=${formSuiteType}`
              }
              headers={{ token }}
            >
              <Button
                icon={<UploadOutlined />}
                loading={Uploading}
                disabled={!formTitle && !formSuiteType}
              >
                导入
              </Button>
            </Upload>
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
      <Modal
        visible={error.length > 0}
        onOk={() => {
          setError([]);
        }}
        onCancel={() => {
          setError([]);
        }}
        title="错误提示"
        width={1000}
      >
        <Table
          columns={errorColumns}
          dataSource={error}
        />
      </Modal>
    </>
  );
};

result.displayName = __filename;

result.propTypes = {
  token: string.isRequired,
  reload: func.isRequired,
};

export default result;
