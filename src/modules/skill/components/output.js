import React, { useCallback, useEffect, useState } from 'react';
import { func, number, object, string } from 'prop-types';
import { Button, Form, Input, message, Select, Radio } from 'antd';
import useStyles from 'isomorphic-style-loader/useStyles';
import { outputComponentOptions, CUSTOM } from 'shared/constants/output-component';
import { outputResourceOptions, WEBHOOK } from 'shared/constants/output-resource';

import Params from './output-params';
import Responses from './output-responses';
import s from './output.less';

const { Item, useForm } = Form;

const result = ({
  output,
  updateOutput,
  intentName,
  intentId,
}) => {
  useStyles(s);

  const [nameVisible, setNameVisible] = useState(output.component === CUSTOM);
  const [component, setComponent] = useState(output.component);
  const [locationVisible, setLocationVisible] = useState(output.resource === WEBHOOK);
  const onUpdateOutput = useCallback(async (values) => {
    const finalValues = { ...values };
    if (finalValues.component && finalValues.component !== CUSTOM) {
      finalValues.name = 'default';
    }
    await updateOutput({ id: output.id, ...finalValues });
    message.success('编辑成功');
  }, [output.id]);

  const onValuesChange = useCallback((values) => {
    if (values.component) {
      setNameVisible(values.component === CUSTOM);
      setComponent(values.component);
    }
    if (values.resource) {
      setLocationVisible(values.resource === WEBHOOK);
    }
  }, []);

  const [componentForm] = useForm();
  const [resourceForm] = useForm();

  useEffect(() => {
    componentForm.resetFields();
    resourceForm.resetFields();
  }, [intentId]);

  return (
    <div>
      <h3 className={s.Title}>选择控件</h3>
      <div className={s.Tips}>
        平台提供多种默认控件类型和样式。每种控件类型，对数据格式、对话流程、终端UI（有屏设备）配置各有不同。若您有更多的创意，可以上传自定义控件。
      </div>
      <Form
        layout="inline"
        initialValues={output}
        onFinish={onUpdateOutput}
        onValuesChange={onValuesChange}
        form={componentForm}
      >
        <Item name="component" label="控件类型">
          <Select options={outputComponentOptions} />
        </Item>
        {nameVisible && (
          <Item name="name" label="控件名称" rules={[{ required: true }]}>
            <Input type="text" />
          </Item>
        )}
        <Item>
          <Button type="primary" htmlType="submit">保存</Button>
        </Item>
      </Form>

      <h3 className={s.Title}>资源调用</h3>
      <Form
        initialValues={output}
        onFinish={onUpdateOutput}
        onValuesChange={onValuesChange}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 12 }}
        form={resourceForm}
      >
        <Item name="resource" label="调用方式">
          <Radio.Group options={outputResourceOptions} />
        </Item>
        {locationVisible && (
          <>
            <Item name="location" label="API地址" rules={[{ required: true }]}>
              <Input type="text" />
            </Item>
            <Item name="params" label="API参数">
              <Params intentName={intentName} component={component} />
            </Item>
          </>
        )}
        <Item wrapperCol={{ span: 12, offset: 4 }}>
          <Button type="primary" htmlType="submit">保存</Button>
        </Item>
      </Form>

      <h3 className={s.Title}>对话回复</h3>
      <Responses outputId={output.id} updateOutput={updateOutput} responses={output.responses} />
    </div>
  );
};

result.displayName = __filename;

result.propTypes = {
  output: object.isRequired,
  updateOutput: func.isRequired,
  intentName: string.isRequired,
  intentId: number.isRequired,
};

export default result;
