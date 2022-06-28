import React, { useEffect, useState, useCallback } from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';
import { Form, Button, message, Input, Modal } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { push as pushAction } from 'relient/actions/history';
import { useForm } from 'relient-admin/hooks';
import { login as loginAction, readQRImage, qrLogin } from 'shared/actions/auth';
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
  const [mfaForm] = Form.useForm();
  useStyles(s);
  const dispatch = useDispatch();
  const [mfaVisible, setMfaVisible] = useState(false);
  const [mfaSecretVisible, setMfaSecretVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrBase64, setQrBase64] = useState(null);

  const { submit, submitting, form } = useForm(async (values) => {
    const { data: { openMfa, hasMfaSecret, roles } } = await dispatch(loginAction({ ...values }));
    global.ignoreAuthRedirection = true;
    global.ignoreGlobalWarning = true;
    try {
      await Promise.all(getPreloader(dispatch, roles));
    } catch (e) {
      console.error(e);
    }
    global.ignoreAuthRedirection = undefined;
    global.ignoreGlobalWarning = undefined;
    if (!openMfa) {
      message.success('登录成功');
      dispatch(pushAction(PRODUCT));
    } else if (!hasMfaSecret) {
      setMfaSecretVisible(true);
      const imgSrc = await dispatch(readQRImage());
      setQrBase64(imgSrc.data);
    } else {
      setMfaVisible(true);
    }
  });

  const onMfaClose = useCallback(() => {
    mfaForm.resetFields();
    setMfaVisible(false);
  }, [setMfaVisible, setQrBase64, mfaForm]);

  const onMfaSecretClose = useCallback(() => {
    setMfaSecretVisible(false);
    setQrBase64(null);
  }, [setQrBase64, setMfaSecretVisible]);

  const onBindFinish = useCallback(() => {
    setMfaSecretVisible(false);
    setQrBase64(null);
    setMfaVisible(true);
  }, [setQrBase64, setMfaSecretVisible, setMfaVisible]);

  const onMfaLogin = useCallback(
    async (values) => {
      setLoading(true);
      try {
        await dispatch(qrLogin(values));
        setLoading(false);
        setMfaVisible(false);
        await Promise.all(getPreloader(dispatch));
        message.success('登录成功');
        dispatch(pushAction(PRODUCT));
      } catch (err) {
        setLoading(false);
      }
      mfaForm.resetFields();
    },
    [setMfaVisible, setLoading],
  );

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
      <Modal
        title="使用验证器扫码"
        onCancel={onMfaSecretClose}
        footer={null}
        visible={mfaSecretVisible}
        centered="true"
        width={400}
      >
        <div
          style={{
            position: 'relative',
            height: 350,
            marginTop: 40,
          }}
        >
          {qrBase64 ? (
            <img
              src={qrBase64}
              alt="加载失败"
              style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            />
          ) : '加载二维码中...'}
          <Button
            type="primary"
            onClick={onBindFinish}
            style={{
              position: 'absolute',
              top: '320px',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            绑定完成
          </Button>
        </div>
      </Modal>
      <Modal
        title="输入MFA验证码"
        onCancel={onMfaClose}
        footer={null}
        visible={mfaVisible}
        centered="true"
        width={400}
      >
        <Form
          form={mfaForm}
          autoComplete="off"
          onFinish={onMfaLogin}
          style={{
            width: '80%',
            margin: '0 auto',
          }}
        >
          <Form.Item
            label="MFA"
            name="code"
            rules={[{ required: true, message: 'MFA不能为空!' }]}
          >
            <Input placeholder="MFA" prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item
            wrapperCol={{ offset: 10, span: 14 }}
          >
            <Button
              type="primary"
              loading={loading}
              htmlType="submit"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

result.displayName = __filename;

export default result;
