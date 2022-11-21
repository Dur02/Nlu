import { Button, Input, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { string, func } from 'prop-types';
import { concat } from 'lodash/fp';
import { outputComponentOptions } from 'shared/constants/output-component';

const result = ({
  widgetName,
  duiWidget,
  onChange,
}) => {
  const [widgetNameValue, setWidgetNameValue] = useState(widgetName);
  const [duiWidgetVisible, setDuiWidgetVisible] = useState(widgetName === 'custom');
  const [duiWidgetValue, setDuiWidgetValue] = useState(duiWidget);

  useEffect(() => {
    setWidgetNameValue(widgetName);
    setDuiWidgetVisible(widgetName === 'custom');
    setDuiWidgetValue(duiWidget);
  }, [widgetName, duiWidget]);

  return (
    <div style={{ display: 'flex' }}>
      <Select
        value={widgetNameValue}
        style={{ width: 100 }}
        options={concat([{ label: '无', value: '' }], outputComponentOptions)}
        onChange={(value) => {
          setWidgetNameValue(value);
          switch (value) {
            case 'custom':
              setDuiWidgetVisible(true);
              break;
            default:
              setDuiWidgetVisible(false);
              break;
          }
        }}
      />
      {duiWidgetVisible && (
        <Input
          value={duiWidgetValue}
          // defaultValue={duiWidget || ''}
          type="text"
          onChange={(e) => setDuiWidgetValue(e.target.value)}
        />
      )}
      <Button
        type="primary"
        onClick={async () => {
          switch (widgetNameValue) {
            case 'custom':
              await onChange({
                newWidgetName: widgetNameValue,
                newDuiWidget: duiWidgetValue,
              });
              break;
            case 'list':
            case 'text':
              await onChange({
                newWidgetName: widgetNameValue,
                newDuiWidget: 'default',
              });
              break;
            default:
              await onChange({
                newWidgetName: '',
                newDuiWidget: 'default',
              });
              break;
          }
        }}
      >
        保存
      </Button>
      {
        // <Form
        //   form={componentForm}
        //   layout="inline"
        //   initialValues={{
        //     component: widgetName || '',
        //     name: duiWidget || '',
        //   }}
        //   onFinish={async ({ component, name }) => {
        //     // 因为不同panel的表单有一样的form={componentForm}的值，所以此处console.log(cId)的值跟跟其他控此表单行为跟其他
        //     // 组件有不一致的点，也许应该在之后改为把表单去除分为select和input两部分独立控制
        //     switch (component) {
        //       case 'custom':
        //         await onUpdateResponse({
        //           cId: selectedCId,
        //           widgetName: component,
        //           duiWidget: name,
        //         });
        //         break;
        //       case 'list':
        //       case 'text':
        //         await onUpdateResponse({
        //           cId: selectedCId,
        //           widgetName: component,
        //           duiWidget: 'default',
        //         });
        //         break;
        //       default:
        //         await onUpdateResponse({
        //           cId: selectedCId,
        //           widgetName: '',
        //           duiWidget: 'default',
        //         });
        //         break;
        //     }
        //   }}
        // >
        // </Form>
      }
    </div>
  );
};

result.displayName = __filename;

result.propTypes = {
  widgetName: string.isRequired,
  duiWidget: string.isRequired,
  onChange: func.isRequired,
};

export default result;
