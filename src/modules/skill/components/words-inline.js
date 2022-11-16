import React from 'react';
import { Collapse, Form, Modal, Input, Checkbox } from 'antd';
import { array, bool, func, number, object } from 'prop-types';
import { compact, find, flow, includes, map, propEq } from 'lodash/fp';
import { appGroundTypeOption, duplexTypeOption } from 'shared/constants/config';
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
  console.log(createWords);
  // eslint-disable-next-line no-console
  console.log(updateWords);
  // eslint-disable-next-line no-console
  console.log(removeWords);
  // eslint-disable-next-line no-console
  console.log(skillId);

  const selectedWords = flow(
    map((name) => find(propEq('name', name))(words)),
    compact,
  )(selectedSlots.lexiconsNames);

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
        // width={1000}
      >
        <Collapse>
          <Panel header="新建意图">
            <Form
              className={s.Words}
              autoComplete="off"
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
                label="app前台/app后台"
                name="appGroundType"
              >
                <Checkbox.Group options={appGroundTypeOption} />
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
                labelCol={{ span: 1 }}
                wrapperCol={{ span: 20 }}
              >
                <WordsContent />
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
