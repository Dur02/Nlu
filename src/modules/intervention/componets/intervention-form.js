import React from 'react';
import { Button, Form, Input, Modal, Select, Switch, Radio } from 'antd';
import { map } from 'lodash/fp';

const result = (
  editorVisible,
  closeEditor,
  editorItem,
  products,
  skillSelect,
  intentSelect,
) => {
  const { Item } = Form;
  return (
    <>
      <Modal
        visible={editorVisible}
        onCancel={closeEditor}
        title="修改"
        width={600}
        destroyOnClose="true"
        footer={null}
      >
        <Form
          // onFinish={submit}
          // form={form}
          // initialValues={currentUser}
          labelCol={{ offset: 0, span: 7 }}
          wrapperCol={{ span: 12 }}
          autoComplete="off"
          initialValues={{
            type: 1,
          }}
        >
          <Item name="id" style={{ display: 'none' }}>{editorItem.id}</Item>
          <Item
            name="productId"
            label="产品"
            rules={[{ required: true }]}
          >
            <Select>
              {
                map((item) => (
                  <Select.Option value={item.id} key={item.id}>
                    {item.name}
                  </Select.Option>
                ))(products)
              }
            </Select>
          </Item>
          <Item
            name="skillId"
            label="技能"
            rules={[{ required: true }]}
          >
            <Select>
              {
                map((item) => (
                  <Select.Option value={item.id} key={item.id}>
                    {item.name}
                  </Select.Option>
                ))(skillSelect)
              }
            </Select>
          </Item>
          <Item
            name="intentId"
            label="意图"
            rules={[{ required: true }]}
          >
            <Select>
              {
                map((item) => (
                  <Select.Option value={item.id} key={item.id}>
                    {item.name}
                  </Select.Option>
                ))(intentSelect)
              }
            </Select>
          </Item>
          <Item
            name="sentence"
            label="对话"
            rules={[{ required: true }]}
          >
            <Input />
          </Item>
          <Item
            name="response"
            label="回复"
            rules={[{ required: true }]}
          >
            <Input />
          </Item>
          <Item
            name="type"
            label="类型"
            rules={[{ required: true }]}
          >
            <Radio.Group>
              <Radio value={1}>DM</Radio>
              <Radio value={2}>NLU</Radio>
            </Radio.Group>
          </Item>
          <Item
            name="wildLeft"
            label="左模糊匹配"
            valuePropName="checked"
          >
            <Switch />
          </Item>
          <Item
            name="wildRight"
            label="右模糊匹配"
            valuePropName="checked"
          >
            <Switch />
          </Item>
          <Item
            labelCol={{ offset: 0, span: 10 }}
            wrapperCol={{ span: 14 }}
          >
            <Button
              htmlType="submit"
              type="primary"
              ghost
              style={{
                margin: '0 auto',
                float: 'right',
              }}
            >
              修改
            </Button>
          </Item>
        </Form>
      </Modal>
    </>
  );
};

result.displayName = __filename;

result.propTypes = {};

export default result;
