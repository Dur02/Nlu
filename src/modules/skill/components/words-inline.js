import React, { useCallback } from 'react';
import { Collapse, Form, Modal, Input, Checkbox, Button } from 'antd';
import { array, bool, func, number, object } from 'prop-types';
import { compact, find, flow, includes, map, propEq } from 'lodash/fp';
import { duplexTypeOption, getConfigValue } from 'shared/constants/config';
import useStyles from 'isomorphic-style-loader/useStyles';
import WordsContent from './words-content';
import s from './words-inline.less';

const { Panel } = Collapse;

const result = ({
  isModalOpen,
  setIsModalOpen,
  selectedSlots,
  setSelectedSlots,
  words,
  createWords,
  updateWords,
  removeWords,
  skillId,
}) => {
  useStyles(s);

  // eslint-disable-next-line no-console
  console.log(updateWords);
  // eslint-disable-next-line no-console
  console.log(removeWords);

  const selectedWords = flow(
    map((name) => find(propEq('name', name))(words)),
    compact,
  )(selectedSlots.lexiconsNames);

  const onFinish = useCallback(async (value) => {
    const duplexType = getConfigValue(value.duplexType, 'duplexType');
    await createWords({
      ...value,
      wordConfig: {
        duplexType,
        skillId,
      },
    });
  }, [getConfigValue]);

  // eslint-disable-next-line no-console
  console.log(selectedWords);

  return (
    <>
      <Modal
        title={selectedSlots.name}
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedSlots({});
        }}
        width={700}
      >
        <Collapse>
          <Panel header="新建意图">
            <Form
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
            map((item) => (
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
  isModalOpen: bool.isRequired,
  setIsModalOpen: func.isRequired,
  selectedSlots: object.isRequired,
  setSelectedSlots: func.isRequired,
  words: array.isRequired,
  createWords: func.isRequired,
  updateWords: func.isRequired,
  removeWords: func.isRequired,
  skillId: number.isRequired,
};

export default result;
