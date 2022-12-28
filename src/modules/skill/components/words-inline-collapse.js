import React, { useCallback } from 'react';
import { Form, Input, Checkbox, Button, Table, message } from 'antd';
import { func, number } from 'prop-types';
import { readAll as readAllIntent } from 'shared/actions/intent';
import { useDispatch } from 'react-redux';
import { eq, flow, includes, prop, reject, replace, any } from 'lodash/fp';
import { duplexTypeOption, getConfigValue } from 'shared/constants/config';
import useStyles from 'isomorphic-style-loader/useStyles';
import s from './words-inline-collapse.less';
import columns from './words-inline-collapse-columns';

const { useForm } = Form;

const result = ({
  item,
  updateWords,
  skillId,
}) => {
  useStyles(s);

  const dispatch = useDispatch();
  const [updateLexiconsForm] = useForm();

  const onUpdateWord = useCallback(async (value) => {
    const duplexType = getConfigValue(value.duplexType || [], 'duplexType');
    const { code, msg } = await updateWords({
      ...value,
      wordConfig: {
        duplexType,
        skillId,
      },
    });
    switch (code) {
      case 'SUCCESS':
        message.success(msg);
        break;
      default:
        message.error(msg);
        break;
    }
    await dispatch(readAllIntent({ skillId }));
  }, [getConfigValue, updateLexiconsForm]);

  const onCreateLexicon = useCallback(async ({ word, synonym }) => {
    if (any(flow(prop('word'), eq(word)))(item.content)) {
      message.error('取值已存在');
    } else {
      await updateWords({
        id: item.id,
        name: item.name,
        content: [{
          word,
          synonym: replace('，', ',')(synonym),
        }, ...(item.content || [])],
      });
      updateLexiconsForm.resetFields();
    }
  }, [getConfigValue, updateLexiconsForm, item]);

  const onRemove = useCallback(async ({ word }) => {
    await updateWords({
      id: item.id,
      name: item.name,
      content: reject(flow(prop('word'), eq(word)))(item.content),
    });
  }, [item.content]);

  return (
    <>
      <Form
        layout="inline"
        className={s.WordsForm}
        autoComplete="off"
        onFinish={onUpdateWord}
        initialValues={{
          ...item,
        }}
      >
        <Form.Item
          name="id"
          hidden
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="名称"
          name="name"
          rules={[{
            required: true,
          }, {
            validator: async (_, value) => {
              if (includes(',')(value)) {
                throw new Error('词库名不能包含,');
              }
            },
          }]}
        >
          <Input placeholder="输入词库名" style={{ width: 525 }} />
        </Form.Item>
        <Form.Item
          // label="全双工/半双工"
          name="duplexType"
          wrapperCol={{ offset: 2, span: 22 }}
        >
          <Checkbox.Group options={duplexTypeOption} style={{ width: 175 }} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 7, span: 17 }}>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>

      <Form
        form={updateLexiconsForm}
        layout="inline"
        className={s.WordsForm}
        autoComplete="off"
        onFinish={onCreateLexicon}
      >
        <Form.Item
          label="取值"
          name="word"
          rules={[{ required: true }]}
        >
          <Input placeholder="输入取值" style={{ width: 270 }} />
        </Form.Item>
        <Form.Item
          label="同义词"
          name="synonym"
        >
          <Input placeholder="输入同义词" style={{ width: 375 }} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 7, span: 17 }}>
          <Button type="primary" htmlType="submit">
            添加
          </Button>
        </Form.Item>
      </Form>

      <Table
        size="small"
        dataSource={item.content}
        columns={columns({
          onRemove,
          updateWords,
          item,
        })}
        rowKey="word"
        pagination={false}
        // scroll={{
        //   y: 150,
        // }}
      />
    </>
  );
};

result.displayName = __filename;

result.propTypes = {
  // selectedSlot: object.isRequired,
  // onDetachWords: func.isRequired,
  updateWords: func.isRequired,
  skillId: number.isRequired,
};

export default result;
