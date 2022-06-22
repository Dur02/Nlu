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
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(-1);
  const [qrSrc, setQrSrc] = useState('');

  const { submit, submitting, form } = useForm(async (values) => {
    const userInfo = await dispatch(loginAction({ ...values }));
    setVisible(userInfo.data.openMfa);
    if (userInfo.data.openMfa === true && userInfo.data.hasMfaSecret === false) {
      const imgSrc = await dispatch(readQRImage());
      setQrSrc(imgSrc.data);
      setVisible(true);
    }
  });

  const handleQrClose = useCallback(
    () => {
      mfaForm.resetFields();
      setQrSrc('');
      setVisible(false);
    },
    [visible, setVisible],
  );

  const toMfaLogin = useCallback(
    () => {
      setQrSrc('');
    },
    [visible, setVisible],
  );

  const onMfaLogin = useCallback(
    async (values) => {
      setLoading(true);
      try {
        await dispatch(qrLogin({ ...values }));
        setLoading(false);
        setVisible(false);
        await Promise.all(getPreloader(dispatch));
        message.success('登录成功');
        dispatch(pushAction(PRODUCT));
      } catch (err) {
        setLoading(false);
      }
      mfaForm.resetFields();
    },
    [setVisible, setLoading, code, setCode],
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
        onCancel={handleQrClose}
        footer={null}
        visible={visible}
        centered="true"
        width={400}
      >
        {
          qrSrc !== '' && (
          <>
            <br />
            <div
              style={{
                position: 'relative',
                height: '350px',
              }}
            >
              <img
                src={qrSrc}
                alt="加载失败"
                style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
              />
              <Button
                type="primary"
                onClick={toMfaLogin}
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
          </>
          )
}
        {
          qrSrc === '' && (
          <>
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
                rules={[
                  {
                    required: true,
                    message: 'MFA不能为空!',
                  },
                ]}
              >
                <Input placeholder="MFA" prefix={<LockOutlined />} />
              </Form.Item>
              <Form.Item
                wrapperCol={{
                  offset: 10,
                  span: 14,
                }}
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
          </>
          )
}
      </Modal>
    </Layout>
  );
};

result.displayName = __filename;

export default result;
