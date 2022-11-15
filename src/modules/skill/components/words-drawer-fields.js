import { includes } from 'lodash/fp';
import { Checkbox } from 'antd';
import { appGroundTypeOption, duplexTypeOption } from 'shared/constants/config';
import WordsContent from './words-content';

export default [{
  label: '名称',
  name: 'name',
  labelAlign: 'left',
  type: 'text',
  rules: [{
    required: true,
  }, {
    validator: async (_, value) => {
      if (includes(',')(value)) {
        throw new Error('词库名不能包含,');
      }
    },
  }],
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}, {
  label: 'app前台/app后台',
  name: 'appGroundType',
  labelAlign: 'left',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  component: Checkbox.Group,
  options: appGroundTypeOption,
}, {
  label: '全双工/半双工',
  name: 'duplexType',
  labelAlign: 'left',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  component: Checkbox.Group,
  options: duplexTypeOption,
}, {
  label: '词条',
  name: 'content',
  labelAlign: 'left',
  component: WordsContent,
  labelCol: { span: 2 },
  wrapperCol: { span: 22 },
}];
