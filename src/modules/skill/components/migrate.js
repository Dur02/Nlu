import React, { useCallback, useState } from 'react';
import { array, bool, func, object } from 'prop-types';
import { Button, Form, Modal, Select } from 'antd';
import { find, flatten, flow, map, propEq } from 'lodash/fp';
import { getSkillsWithVersions } from 'shared/selectors';
import { useSelector } from 'react-redux';

const { useForm } = Form;

const result = ({
  // skill,
  intents,
  migrateVisible,
  setMigrateVisible,
}) => {
  const {
    skillsWithVersion,
  } = useSelector((state) => ({
    skillsWithVersion: flow(
      getSkillsWithVersions,
    )(state),
  }));

  const [migrateForm] = useForm();
  const [migrateOption, setMigrateOption] = useState('intent');
  const [versionOption, setVersionOption] = useState([]);

  // 处理迁移类型的改变
  const handleMigrateOptionChange = useCallback((value) => {
    setMigrateOption(value);
  }, []);

  // 处理code变化时reset技能版本下拉框的option，迁移类型为意图时用
  const handleSkillCodeChange = useCallback((value) => {
    setVersionOption(() => map(({ id, version }) => ({
      label: version,
      value: id,
    }))(find(propEq('code', value))(skillsWithVersion).skillVersions));
  }, []);

  // 处理表单的提交
  // const submitForm = useCallback((value) => {
  //   console.log(value);
  // }, []);

  // console.log(skill);
  // console.log(intents);
  // console.log(flatten(map(({ rules }) => rules)(intents)));
  // console.log(skillsWithVersion);
  // console.log(targetSkillCode);

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
            migrateOption: 'intent',
            defaultValue: ['a10', 'c12'],
          }}
          form={migrateForm}
          // onFinish={submitForm}
        >
          <Form.Item name="migrateOption" label="迁移选项" rules={[{ required: true }]}>
            <Select
              style={{ width: '100%' }}
              onChange={handleMigrateOptionChange}
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
          {
            migrateOption === 'intent' ? (
              <Form.Item
                name="intentIds"
                label="意图"
                rules={[{ required: true }]}
                hidden={migrateOption !== 'intent'}
              >
                <Select
                  mode="multiple"
                  allowClear
                  optionFilterProp="label"
                  style={{ width: '100%' }}
                  placeholder="Please select"
                  options={map(({ id, name }) => ({ label: name, value: id }))(intents)}
                />
              </Form.Item>
            ) : (
              <>
                <Form.Item
                  name="sourceIntentId"
                  label="源意图"
                  rules={[{ required: true }]}
                  // hidden={migrateOption !== 'intent'}
                >
                  <Select
                    mode="multiple"
                    allowClear
                    optionFilterProp="label"
                    style={{ width: '100%' }}
                    placeholder="Please select"
                    options={map(({ id, name }) => ({ label: name, value: id }))(intents)}
                  />
                </Form.Item>
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
                    options={
                      map(({ id, sentence }) => ({
                        label: sentence, value: id,
                      }))(flatten(map(({ rules }) => rules)(intents)))
                    }
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
            name="targetSkillId "
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
            />
          </Form.Item>
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
