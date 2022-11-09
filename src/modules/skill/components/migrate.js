import React, { useCallback, useState } from 'react';
import { array, bool, func, object } from 'prop-types';
import { Button, Form, Input, message, Modal, Select } from 'antd';
import { find, flow, map, prop, propEq, reject } from 'lodash/fp';
import { getSkillsWithVersions } from 'shared/selectors';
import { useSelector, useDispatch } from 'react-redux';
import { readAll as readAllIntent, intentMigrate } from 'shared/actions/intent';
import { ruleMigrate } from 'shared/actions/rule';

const { useForm } = Form;

const result = ({
  skill,
  intents,
  migrateVisible,
  setMigrateVisible,
}) => {
  const {
    skillsWithVersion,
  } = useSelector((state) => ({
    skillsWithVersion: flow(
      getSkillsWithVersions,
      reject(propEq('id', skill.id)),
    )(state),
  }));

  const dispatch = useDispatch();

  const [migrateForm] = useForm();
  const [migrateOption, setMigrateOption] = useState('intent');
  const [versionOption, setVersionOption] = useState([]);
  const [ruleOption, setRuleOption] = useState([]);
  const [targetIntentOption, setTargetIntentOption] = useState([]);
  const [inputHidden, setInputHidden] = useState(false);

  // 处理源intent变化时改变rule下拉框的选项，迁移类型为说法时用
  const handleIntentChange = useCallback((value) => {
    migrateForm.setFieldValue('skillRuleIds', undefined);
    setRuleOption(() => map(({ id, sentence }) => ({
      label: sentence,
      value: id,
    }))(
      flow(
        find(propEq('id', value)),
        prop('rules'),
      )(intents),
    ));
  }, [intents, skill, migrateForm, setRuleOption]);

  // 处理code变化时reset技能版本下拉框的option，迁移类型为意图和说法都可用
  const handleSkillCodeChange = useCallback((value) => {
    migrateForm.setFieldsValue({
      targetSkillId: undefined,
      targetIntentId: undefined,
      targetIntentName: undefined,
    });
    setInputHidden(false);
    setVersionOption(() => map(({ id, version }) => ({
      label: version,
      value: id,
    }))(
      flow(
        find(propEq('code', value)),
        prop('skillVersions'),
      )(skillsWithVersion),
    ));
  }, [
    migrateForm,
    setInputHidden,
    setVersionOption,
    skillsWithVersion,
    intents,
    skill,
    skillsWithVersion,
  ]);

  // 处理目标技能改变时，发送请求获取获取选中目标技能下的意图，迁移类型为说法时用
  const handleTargetSkillChange = useCallback(async (value) => {
    try {
      migrateForm.setFieldsValue({ targetIntentId: undefined, targetIntentName: undefined });
      setInputHidden(false);
      if (value) {
        const { data: { records } } = await dispatch(readAllIntent({ skillId: value }));
        setTargetIntentOption(records);
        message.success('获取目标技能意图成功');
      } else {
        setTargetIntentOption([]);
      }
    } catch (e) {
      message.error('出错了');
    }
  }, [intents, skill, setInputHidden, setTargetIntentOption]);

  // 处理表单的提交
  const submitForm = useCallback(async (value) => {
    try {
      if (value.migrateOption === 'intent') {
        const { code, msg } = await dispatch(intentMigrate({ ...value, sourceSkillId: skill.id }));
        if (code === 'SUCCESS') {
          message.success(msg);
          // 此接口会导致部分源技能的数据被删除，但redux中还有存储过期导致页面数据没统一
          // 后端说此处钱以后刷新页面，如果需要改进需要把变动的数据从redux中去除
          window.location.reload();
        } else {
          message.error(msg);
        }
      } else {
        const { code, msg } = await dispatch(ruleMigrate({
          ...value,
          sourceSkillId: skill.id,
          sourceIntentName: prop('name')(find(propEq('id', value.sourceIntentId))(intents)),
        }));
        if (code === 'SUCCESS') {
          message.success(msg);
          window.location.reload();
        } else {
          message.error(msg);
        }
      }
      setMigrateVisible(false);
    } catch (e) {
      message.error('出错了');
    }
  }, [intents, skill, migrateForm]);

  // console.log(skill);
  // console.log(intents);
  // console.log(skillsWithVersion);

  return (
    <>
      <Modal
        visible={migrateVisible}
        onCancel={() => {
          setMigrateVisible(false);
        }}
        footer={null}
        title="迁移"
        width={400}
      >
        <Form
          initialValues={{
            migrateOption,
            defaultValue: ['a10', 'c12'],
          }}
          form={migrateForm}
          onFinish={submitForm}
        >
          <Form.Item name="migrateOption" label="迁移选项" rules={[{ required: true }]}>
            <Select
              style={{ width: '100%' }}
              onChange={(value) => {
                setMigrateOption(value);
                migrateForm.resetFields();
                migrateForm.setFieldValue('migrateOption', value);
              }}
              options={[
                {
                  value: 'intent',
                  label: '迁移意图',
                },
                {
                  value: 'rule',
                  label: '迁移说法',
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            name={migrateOption === 'intent' ? 'intentIds' : 'sourceIntentId'}
            label="意图"
            rules={[{ required: true }]}
            // hidden={migrateOption !== 'intent'}
          >
            <Select
              mode={migrateOption === 'intent' ? 'multiple' : ''}
              allowClear
              optionFilterProp="label"
              style={{ width: '100%' }}
              placeholder="Please select"
              options={map(({ id, name }) => ({ label: name, value: id }))(intents)}
              onChange={migrateOption === 'rule' ? handleIntentChange : () => {}}
            />
          </Form.Item>
          {
            migrateOption === 'rule' && (
              <>
                <Form.Item
                  name="skillRuleIds"
                  label="说法"
                  rules={[{ required: true }]}
                  hidden={migrateOption !== 'rule'}
                >
                  <Select
                    mode="multiple"
                    allowClear
                    optionFilterProp="label"
                    style={{ width: '100%' }}
                    placeholder="Please select"
                    options={ruleOption}
                  />
                </Form.Item>
              </>
            )
          }
          <Form.Item
            name="targetSkillCode"
            label="目标技能"
            rules={[{ required: true }]}
          >
            <Select
              // mode="multiple"
              showSearch
              allowClear
              optionFilterProp="label"
              style={{ width: '100%' }}
              placeholder="Please select"
              onChange={handleSkillCodeChange}
              options={map(({ code, name }) => ({ label: name, value: code }))(skillsWithVersion)}
            />
          </Form.Item>
          <Form.Item
            name="targetSkillId"
            label="目标技能版本"
            rules={[{ required: true }]}
          >
            <Select
              // mode="multiple"
              showSearch
              allowClear
              optionFilterProp="label"
              style={{ width: '100%' }}
              placeholder="Please select"
              options={versionOption}
              onChange={migrateOption === 'rule' ? handleTargetSkillChange : () => {}}
            />
          </Form.Item>
          {
            migrateOption === 'rule' && (
              <>
                <Form.Item
                  name="targetIntentId"
                  label="目标意图"
                  // rules={[{ required: true }]}
                >
                  <Select
                    // mode="multiple"
                    showSearch
                    allowClear
                    optionFilterProp="label"
                    style={{ width: '100%' }}
                    placeholder="Please select"
                    options={map(({ id, name }) => ({
                      label: name,
                      value: id,
                    }))(targetIntentOption)}
                    onChange={(value) => {
                      if (value) {
                        migrateForm.setFieldValue(
                          'targetIntentName',
                          prop('name')(find(propEq('id', value))(targetIntentOption)),
                        );
                        setInputHidden(true);
                      } else {
                        migrateForm.setFieldValue('targetIntentName', undefined);
                        setInputHidden(false);
                      }
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="targetIntentName"
                  label="目标意图名"
                  rules={[{ required: true }]}
                  hidden={inputHidden}
                >
                  <Input allowClear placeholder="输入意图名" style={{ width: '100%' }} />
                </Form.Item>
              </>
            )
          }
          <Form.Item wrapperCol={{ offset: 10 }}>
            <Button type="primary" htmlType="submit">迁移</Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

result.displayName = __filename;

result.propTypes = {
  skill: object.isRequired,
  intents: array.isRequired,
  migrateVisible: bool.isRequired,
  setMigrateVisible: func.isRequired,
};

export default result;
