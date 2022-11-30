import React, { useCallback, useEffect } from 'react';
import { Form, Input, Button, Switch } from 'antd';

const { Item, useForm } = Form;

const result = ({
  standardId,
  createSentence,
  readSentenceAction,
}) => {
  const [createForm] = useForm();

  const onFinish = useCallback(async (value) => {
    await createSentence({ ...value });
    await readSentenceAction({ id: standardId });
  }, [createForm]);

  useEffect(() => {
    createForm.setFieldsValue({ homePageShow: true, appSkillId: standardId });
  }, [standardId]);

  return (
    <Form
      form={createForm}
      onFinish={onFinish}
      style={{
        margin: '20px 0',
      }}
      layout="inline"
    >
      <Item
        label="说法名"
        name="sentenceName"
        rules={[{ required: true }]}
      >
        <Input placeholder="请输入说法名" autoComplete="off" allowClear />
      </Item>

      <Item
        label="主页显示"
        name="homePageShow"
        valuePropName="checked"
      >
        <Switch defaultChecked />
      </Item>

      <Item
        hidden
        name="appSkillId"
        rules={[{ required: true }]}
      >
        <Input />
      </Item>

      <Item>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Item>
    </Form>
  );
};

result.displayName = __filename;

export default result;
