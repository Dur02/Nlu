import React, { useCallback } from 'react';
import { Collapse, Form, Modal, Input, Checkbox, Button, message } from 'antd';
import { array, bool, func, number, string } from 'prop-types';
import { readAll as readAllIntent } from 'shared/actions/intent';
import { useDispatch } from 'react-redux';
import { compact, eq, find, flow, includes, map, propEq, reject } from 'lodash/fp';
import { duplexTypeOption, getConfigValue } from 'shared/constants/config';
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
  updateWords,
  skillId,
}) => {
  useStyles(s);

  const dispatch = useDispatch();

  const selectedSlot = flow(
    find(propEq('name', slotName)),
  )(slots) || [];

  const selectedWord = flow(
    map((name) => find(propEq('name', name))(words)),
    compact,
  )(selectedSlot.lexiconsNames || []);

  const [createWordsForm] = Form.useForm();

  const onAttachWords = useCallback(
    ({ name }) => onUpdateSlot(
      {
        ...selectedSlot,
        lexiconsNames: [name, ...(selectedSlot.lexiconsNames || [])],
      },
      undefined,
      selectedSlot,
    ),
    [selectedSlot, onUpdateSlot],
  );

  const onDetachWords = useCallback(
    ({ name }) => onUpdateSlot(
      {
        ...selectedSlot,
        lexiconsNames: reject(eq(name))(selectedSlot.lexiconsNames),
      },
      undefined,
      selectedSlot,
    ),
    [selectedSlot, onUpdateSlot],
  );

  const onCreateWord = useCallback(async (value) => {
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
      createWordsForm.resetFields();
    } catch (e) {
      message.error('出错了');
    }
  }, [selectedSlot, getConfigValue, onAttachWords]);

  const onUpdateWord = useCallback(async (value) => {
    try {
      const duplexType = getConfigValue(value.duplexType || [], 'duplexType');
      await updateWords({
        ...value,
        wordConfig: {
          duplexType,
          skillId,
        },
      });
      await dispatch(readAllIntent({ skillId }));
    } catch (e) {
      message.error('出错了');
    }
  }, [selectedSlot, getConfigValue, onAttachWords]);

  return (
    <>
      {
        // 强制modal和Form生命周期一致，在关闭后可以实现用户修改数据后再打开也可以更新值，否则可能因为生命周期不一致导致
        // initialValues没有重新获取，也可以通过setFieldsValue或者resetFields实现，但如何对循环selectedWord
        // 生成的form元素使用useForm方法?
        isModalOpen && (
          <Modal
            forceRender
            title={selectedSlot.name}
            open={isModalOpen}
            footer={null}
            onCancel={() => {
              createWordsForm.resetFields();
              setSlotName('');
              setIsModalOpen(false);
            }}
            width={700}
          >
            <div className={s.CollapseContainer}>
              <Collapse>
                <Panel header="新建词库" key="createWord">
                  <Form
                    form={createWordsForm}
                    className={s.WordsForm}
                    autoComplete="off"
                    onFinish={onCreateWord}
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
                    <Panel
                      header={(
                        <>
                          {item.name}
                          <Button
                            style={{ float: 'right' }}
                            type="danger"
                            size="small"
                            ghost
                            onClick={() => onDetachWords({ name: item.name })}
                          >
                            解绑词库
                          </Button>
                        </>
                      )}
                      key={item.code}
                    >
                      <Form
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
                            更新词库
                          </Button>
                        </Form.Item>
                      </Form>
                    </Panel>
                  ))(selectedWord)
                }
              </Collapse>
            </div>
          </Modal>
        )
      }
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
  skillId: number.isRequired,
};

export default result;
