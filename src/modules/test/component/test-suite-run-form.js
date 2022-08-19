import React from 'react';
import {
  Button,
  Modal,
  Form,
  Input,
  message,
  Select,
} from 'antd';
import { map } from 'lodash/fp';
import { bool, func } from 'prop-types';
import { useForm } from 'relient-admin/hooks';

const { Option } = Select;

const result = ({
  runFormItem,
  runFormVisible,
  closeRunForm,
  onCreateJob,
  product,
}) => {
  const { submit, submitting, form } = useForm(async (values) => {
    try {
      const { msg } = await onCreateJob({ ...values, jobConfig: { productId: values.productId } });
      message.success(msg);
    } catch (e) {
      message.error(e.msg);
    }
    form.resetFields();
    closeRunForm();
  });

  return (
    <>
      {runFormItem && (
        <Modal
          visible={runFormVisible}
          destroyOnClose
          onCancel={() => {
            closeRunForm();
          }}
          footer={null}
          title={`Run${runFormItem.title}`}
          zIndex={10}
        >
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            initialValues={{ testSuiteId: runFormItem.id }}
            autoComplete="off"
            onFinish={submit}
            form={form}
          >
            <Form.Item
              label="标题"
              name="title"
              rules={[{ required: true, message: '请输入标题!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
              <b style={{ position: 'relative', left: '3%' }}>Job配置项</b>
            </Form.Item>
            <Form.Item
              label="产品"
              name="productId"
              rules={[{ required: true, message: '请输入产品!' }]}
            >
              <Select>
                {
                  map(({ name, id }) => <Option value={id} key={id}>{name}</Option>)(product)
                }
              </Select>
            </Form.Item>
            <Form.Item
              label="测试集ID"
              name="testSuiteId"
              style={{
                display: 'none',
              }}
            >
              <Input />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                新增任务
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </>
  );
};

result.displayName = __filename;

result.propTypes = {
  // runFormItem: array.isRequired,
  runFormVisible: bool.isRequired,
  closeRunForm: func.isRequired,
  onCreateJob: func.isRequired,
};

export default result;
