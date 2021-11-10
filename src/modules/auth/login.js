import React, { useEffect, useState } from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';
import { Form, Button, message, Input } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { push as pushAction } from 'relient/actions/history';
import { useForm } from 'relient-admin/hooks';
import { login as loginAction } from 'shared/actions/auth';
import { PRODUCT } from 'shared/constants/features';
import getPreloader from 'shared/utils/preloader';
import Layout from './layout';

import s from './base.less';

const { Item } = Form;
const layout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 0 },
};

const result = () => {
  useStyles(s);
  const dispatch = useDispatch();
  const { submit, submitting, form } = useForm(async (values) => {
    await dispatch(loginAction({ ...values }));
    await Promise.all(getPreloader(dispatch));
    message.success('登录成功');
    dispatch(pushAction(PRODUCT));
  });
  const [disabled, setDisabled] = useState(true);
  useEffect(() => {
    setDisabled(false);
  }, []);

  return (
    <Layout className={s.Root}>
      <Form onFinish={submit} form={form}>
        <Item
          rules={[{ required: true }]}
          layout={layout}
          name="username"
          messageVariables={{ label: '帐号' }}
        >
          <Input placeholder="帐号" type="text" size="large" prefix={<UserOutlined />} />
        </Item>
        <Item
          rules={[{ required: true }]}
          layout={layout}
          name="password"
          messageVariables={{ label: '密码' }}
        >
          <Input placeholder="密码" type="password" size="large" prefix={<LockOutlined />} />
        </Item>
        <Item className={s.Operation}>
          <Button
            disabled={disabled}
            size="large"
            loading={submitting}
            className={s.Submit}
            type="primary"
            htmlType="submit"
          >
            登录
          </Button>
        </Item>
      </Form>
    </Layout>
  );
};

result.displayName = __filename;

export default result;
