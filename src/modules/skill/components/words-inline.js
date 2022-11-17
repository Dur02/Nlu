import React, { useCallback } from 'react';
import { Collapse, Form, Modal, Input, Checkbox, Button, message } from 'antd';
import { array, bool, func, number, string } from 'prop-types';
import { compact, eq, find, flow, includes, map, propEq, reject } from 'lodash/fp';
import { useDispatch } from 'react-redux';
import { duplexTypeOption, getConfigValue } from 'shared/constants/config';
import { readAll as readAllIntent } from 'shared/actions/intent';
import useStyles from 'isomorphic-style-loader/useStyles';
import WordsContent from './words-content';
import s from './words-inline.less';

const { Panel } = Collapse;

const result = ({
  slots,
  slotName,
  // eslint-disable-next-line no-unused-vars
  setSlotName,
  isModalOpen,
  setIsModalOpen,
  onUpdateSlot,
  words,
  createWords,
  // eslint-disable-next-line no-unused-vars
  updateWords,
  // eslint-disable-next-line no-unused-vars
  removeWords,
  skillId,
}) => {
  useStyles(s);

  const selectedSlot = flow(
    find(propEq('name', slotName)),
  )(slots) || [];

  const selectedWords = flow(
    map((name) => find(propEq('name', name))(words)),
    compact,
  )(selectedSlot.lexiconsNames || []);

  const dispatch = useDispatch();
  const [createWordsForm] = Form.useForm();

  const onAttachWords = useCallback(
    ({ name }) => onUpdateSlot(
      { ...selectedSlot, lexiconsNames: [name, ...(selectedSlot.lexiconsNames || [])] },
      undefined,
      selectedSlot,
    ),
    [selectedSlot, onUpdateSlot],
  );

  // eslint-disable-next-line no-unused-vars
  const onDetachWords = useCallback(
    ({ name }) => onUpdateSlot(
      {
        ...selectedSlot,
        lexiconsNames: [
          reject(eq(name))(selectedSlot.lexiconsNames),
          ...(selectedSlot.lexiconsNames || []),
        ],
      },
      undefined,
      selectedSlot,
    ),
    [selectedSlot, onUpdateSlot],
  );

  const onFinish = useCallback(async (value) => {
    try {
      const duplexType = getConfigValue(value.duplexType || [], 'duplexType');
      await createWords({
        ...value,
        wordConfig: {
          duplexType,
          skillId,
        },
      });
      await onAttachWords({ name: value.name });
      await dispatch(readAllIntent({ skillId }));
      createWordsForm.resetFields();
    } catch (e) {
      message.error('出错了');
    }
  }, [selectedSlot, getConfigValue, onAttachWords]);

  return (
    <>
      <Modal
        title={selectedSlot.name}
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        width={700}
      >
        <Collapse>
          <Panel header="新建词库">
            <Form
              form={createWordsForm}
              className={s.Words}
              autoComplete="off"
              onFinish={onFinish}
            >
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
                <Input />
              </Form.Item>
              <Form.Item
                label="全双工/半双工"
                name="duplexType"
              >
                <Checkbox.Group options={duplexTypeOption} />
              </Form.Item>
              <Form.Item
                label="词条"
                name="content"
                labelAlign="left"
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 22 }}
              >
                <WordsContent />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 10, span: 14 }}>
                <Button type="primary" htmlType="submit">
                  创建词库
                </Button>
              </Form.Item>
            </Form>
          </Panel>
          {
            selectedSlot && map((item) => (
              <Panel header={item.name} key={item.code}>
                <p>test1</p>
              </Panel>
            ))(selectedWords)
          }
        </Collapse>
      </Modal>
    </>
  );
};

result.displayName = __filename;

result.propTypes = {
  slots: array.isRequired,
  slotName: string.isRequired,
  setSlotName: func.isRequired,
  isModalOpen: bool.isRequired,
  setIsModalOpen: func.isRequired,
  // selectedSlot: object.isRequired,
  // setselectedSlot: func.isRequired,
  onUpdateSlot: func.isRequired,
  words: array.isRequired,
  createWords: func.isRequired,
  updateWords: func.isRequired,
  removeWords: func.isRequired,
  skillId: number.isRequired,
};

export default result;
