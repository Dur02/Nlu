import React, { useCallback, useState } from 'react';
import { Form, Modal, Input, Button, Checkbox } from 'antd';
import { includes, map, prop, replace } from 'lodash/fp';
import useStyles from 'isomorphic-style-loader/useStyles';
import { duplexTypeOption, getConfigValue } from 'shared/constants/config';
import s from './quick-create-words.less';
import WordsContent from './words-content';

const { Item, useForm } = Form;

const result = ({
  createWordOpen,
  setCreateWordOpen,
  skillId,
  createWords,
}) => {
  useStyles(s);

  const [createForm] = useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = useCallback(async (param) => {
    setLoading(true);
    const formatSynonym = () => (
      map(({ word, synonym }) => ({
        word,
        synonym: replace('，', ',')(synonym),
      }))(param.content)
    );
    const tempParam = {
      ...param,
      content: prop('content')(param) ? formatSynonym() : prop('content')(param),
    };
    // const appGroundType = getConfigValue(param.appGroundType, 'appGroundType');
    const duplexType = getConfigValue(param.duplexType || [], 'duplexType');
    try {
      await createWords({
        ...tempParam,
        wordConfig: {
          // appGroundType,
          duplexType,
          skillId,
        },
      });
      setCreateWordOpen(false);
      createForm.resetFields();
      setLoading(false);
    } catch (e) {
      setCreateWordOpen(false);
      createForm.resetFields();
      setLoading(false);
    }
  }, []);

  return (
    <Modal
      open={createWordOpen}
      onCancel={() => {
        setCreateWordOpen(false);
        createForm.resetFields();
      }}
      width={800}
      footer={null}
    >
      <Form
        form={createForm}
        onFinish={onFinish}
        style={{
          marginTop: '16px',
        }}
        className={s.Words}
      >
        <Item
          name="name"
          label="名称"
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
          <Input autoComplete="off" />
        </Item>
        <Item
          name="duplexType"
          label="全双工/半双工"
        >
          <Checkbox.Group
            options={duplexTypeOption}
          />
        </Item>
        <Item
          name="content"
          label="词条"
        >
          <WordsContent />
        </Item>
        <Item wrapperCol={{ offset: 11, span: 13 }}>
          <Button loading={loading} type="primary" htmlType="submit">提交</Button>
        </Item>
      </Form>
    </Modal>
  );
};

result.displayName = __filename;

result.propTypes = {
};

export default result;
