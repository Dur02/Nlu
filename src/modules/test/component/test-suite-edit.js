import React, { useCallback, useState } from 'react';
import {
  Button,
  Modal,
  Radio,
  Table,
  Form,
  Input,
  message,
  Upload,
} from 'antd';
import { flow, map } from 'lodash/fp';
import { UploadOutlined } from '@ant-design/icons';
import { errorColumns } from './test-suite-import-columns';

const mapWithIndex = map.convert({ cap: false });
const { useForm, useWatch } = Form;

// 暂时没使用，避免后端想把修改和导入合并在一起而准备
const result = ({
  editorItem,
  closeEditor,
  onUpdate,
  editorVisible,
  token,
  reload,
}) => {
  const [editorForm] = useForm();
  const formTitle = useWatch('title', editorForm);
  const formSuiteType = useWatch('suiteType', editorForm);

  const [error, setError] = useState([]);
  const [creating, setCreating] = useState(false);
  const [Uploading, setUploading] = useState(false);

  const editorFormSubmit = useCallback(async (values, id) => {
    setCreating(true);
    try {
      const { msg } = await onUpdate({ id, ...values });
      message.success(msg);
    } catch (e) {
      // message.error(e.msg);
    }
    editorForm.resetFields();
    await reload();
    setCreating(false);
    closeEditor();
  }, []);

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
      editorForm.resetFields();
      closeEditor();
    } else if (status === 'error') {
      message.error(response ? response.msg : '上传失败，请稍后再试');
      setUploading(false);
      editorForm.resetFields();
      closeEditor();
    }
  }, [setUploading, closeEditor, editorForm]);

  return (
    <>
      {editorItem && (
        <Modal
          visible={editorVisible}
          destroyOnClose
          onCancel={() => {
            closeEditor();
          }}
          footer={null}
          title={`${editorItem.title}编辑`}
          zIndex={10}
        >
          <Form
            form={editorForm}
            name="basic"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 14 }}
            initialValues={{
              title: editorItem.title,
              suiteType: editorItem.suiteType,
              description: editorItem.description,
            }}
            autoComplete="off"
            onFinish={(values) => {
              editorFormSubmit(values, editorItem.id);
            }}
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
                  disabled={!editorForm.getFieldValue('title') && !editorForm.getFieldValue('suiteType')}
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
                loading={creating}
              >
                创建
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
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

export default result;
