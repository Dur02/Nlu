import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from 'shared/components/layout';
import { Button, Input, Form, message, Switch } from 'antd';
import { useForm } from 'relient-admin/hooks';
import { getCurrentUser } from 'shared/selectors';
import { updateMine } from 'shared/actions/user';
import {
  ACTIVE,
  formatNormalStatus,
  getUserStatusText,
  INACTIVE,
  parseNormalStatus,
} from '../../shared/constants/user-status';

const { Item } = Form;

const result = () => {
  const {
    currentUser,
  } = useSelector((state) => ({
    currentUser: getCurrentUser(state),
  }));

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
          rules={[{ required: true }]}
          name="openMfa"
          label="打开MFA"
          valuePropName="checked"
        >
          <Switch />
        </Item>
        <Item
          name="password"
          label="密码"
        >
          <Input placeholder="密码" type="password" />
        </Item>
        <Item
          rules={[{ required: true }]}
          name="status"
          label="状态"
          valuePropName="checked"
          getValueFromEvent={formatNormalStatus}
          normalize={parseNormalStatus}
        >
          <Switch
            checkedChildren={getUserStatusText(ACTIVE)}
            unCheckedChildren={getUserStatusText(INACTIVE)}
          />
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
