import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from 'shared/components/layout';
import { Button, Input, Form, message } from 'antd';
import { useForm } from 'relient-admin/hooks';
import { getCurrentUser } from 'shared/selectors';
import { updateMine } from 'shared/actions/user';
import useRules from 'shared/hooks/use-rules';

const { Item } = Form;

const result = () => {
  const {
    currentUser,
  } = useSelector((state) => ({
    currentUser: getCurrentUser(state),
  }));

  const { sameAsRule } = useRules();
  const dispatch = useDispatch();
  const { submit, submitting, form } = useForm(async (values) => {
    await dispatch(updateMine({ id: currentUser.id, ...values }));
    message.success('编辑成功');
  }, [currentUser.id]);

  return (
    <Layout>
      <Form
        onFinish={submit}
        form={form}
        initialValues={currentUser}
        labelCol={{ offset: 3, span: 6 }}
        wrapperCol={{ span: 6 }}
      >
        <Item
          name="password"
          label="新密码"
          rules={[{ required: true }]}
        >
          <Input type="password" />
        </Item>
        <Item
          name="repeatedPassword"
          label="重复新密码"
          rules={[{ required: true }, sameAsRule('password', '新密码')]}
          dependencies={['password']}
        >
          <Input type="password" />
        </Item>
        <Item
          wrapperCol={{ span: 6, offset: 9 }}
        >
          <Button
            loading={submitting}
            type="primary"
            htmlType="submit"
          >
            保存
          </Button>
        </Item>
      </Form>
    </Layout>
  );
};

result.displayName = __filename;

export default result;
