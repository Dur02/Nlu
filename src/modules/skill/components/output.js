import React, { useCallback, useState } from 'react';
import { func, object } from 'prop-types';
import { Button, Form, Input, message, Select } from 'antd';
import useStyles from 'isomorphic-style-loader/useStyles';
import { outputComponentOptions, CUSTOM } from 'shared/constants/output-component';

import s from './output.less';

const { Item, useForm } = Form;

const result = ({
  output,
  updateOutput,
}) => {
  useStyles(s);

  const [nameVisible, setNameVisible] = useState(output.component === CUSTOM);
  const onUpdateOutput = useCallback(async (values) => {
    const finalValues = { ...values };
    if (finalValues.component && finalValues.component !== CUSTOM) {
      finalValues.name = 'default';
    }
    await updateOutput({ id: output.id, ...finalValues });
    message.success('编辑成功');
  }, [output.id]);

  const [componentForm] = useForm();
  const onValuesChange = useCallback((values) => {
    if (values.component) {
      setNameVisible(values.component === CUSTOM);
    }
  }, []);

  return (
    <div>
      <h3>选择控件</h3>
      <div className={s.Tips}>
        平台提供多种默认控件类型和样式。每种控件类型，对数据格式、对话流程、终端UI（有屏设备）配置各有不同。若您有更多的创意，可以上传自定义控件。
      </div>
      <Form
        layout="inline"
        initialValues={output}
        onFinish={onUpdateOutput}
        form={componentForm}
        onValuesChange={onValuesChange}
      >
        <Item name="component" label="控件类型">
          <Select options={outputComponentOptions} />
        </Item>
        {nameVisible && (
          <Item name="name" label="控件名称">
            <Input type="text" />
          </Item>
        )}
        <Item>
          <Button type="primary" htmlType="submit">保存</Button>
        </Item>
      </Form>
    </div>
  );
};

result.displayName = __filename;

result.propTypes = {
  output: object.isRequired,
  updateOutput: func.isRequired,
};

export default result;
