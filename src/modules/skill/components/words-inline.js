import React, { useCallback, useState } from 'react';
import { Form, Modal, Input, Checkbox, Button, message, Collapse } from 'antd';
import { array, bool, func, number, string } from 'prop-types';
import { compact, eq, find, flow, includes, map, propEq, reject } from 'lodash/fp';
import { duplexTypeOption, getConfigValue } from 'shared/constants/config';
import useStyles from 'isomorphic-style-loader/useStyles';
import WordsInlineCollapse from './words-inline-collapse';
import s from './words-inline.less';

const { Panel } = Collapse;
const { Search } = Input;

const result = ({
  slots,
  slotName,
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

  const [isSearching, setIsSearching] = useState(false);

  // 为什么不直接传record，而是通过name寻找选中的槽位？
  // 如果直接传record，在改变槽位内容后内容还是传过来的值，需要重新设置selectedSlot和selectedWord的值
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

  const onSearch = useCallback(async (value) => {
    switch (value) {
      case '':
        setIsSearching(false);
        break;
      default:
        setIsSearching(true);
        break;
    }
  }, []);

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
            width={650}
          >
            <div className={s.Container}>
              <div className={s.ContentArea}>
                <Form
                  layout="inline"
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
                    <Input placeholder="请输入词库名" />
                  </Form.Item>
                  <Form.Item
                    // label="全双工/半双工"
                    name="duplexType"
                    style={{
                      width: 180,
                    }}
                    wrapperCol={{ offset: 3, span: 21 }}
                  >
                    <Checkbox.Group options={duplexTypeOption} />
                  </Form.Item>
                  {
                    // <Form.Item
                    //   label="词条"
                    //   name="content"
                    //   labelAlign="left"
                    //   labelCol={{ span: 2 }}
                    //   wrapperCol={{ span: 22 }}
                    // >
                    //   <WordsContent />
                    // </Form.Item>
                  }
                  <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
                    <Button type="primary" htmlType="submit">
                      创建词库
                    </Button>
                  </Form.Item>
                </Form>
                <Search
                  className={s.Search}
                  placeholder="输入搜索值"
                  onSearch={onSearch}
                />
                {
                  !isSearching ? (
                    <Collapse>
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
                            key={item.id}
                          >
                            <WordsInlineCollapse
                              item={item}
                              skillId={skillId}
                              updateWords={updateWords}
                              onUpdateSlot={onUpdateSlot}
                            />
                          </Panel>
                        ))(selectedWord)
                      }
                    </Collapse>
                  ) : (
                    <p>111</p>
                  )
                }
              </div>
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
  onUpdateSlot: func.isRequired,
  words: array.isRequired,
  createWords: func.isRequired,
  updateWords: func.isRequired,
  skillId: number.isRequired,
};

export default result;
