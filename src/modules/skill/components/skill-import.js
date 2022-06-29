import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Input, message, Modal, Select, Table, Tooltip, Upload } from 'antd';
import { readAll as readAllBuiltinIntent } from 'shared/actions/builtin-intent';
import { readAll as readAllIntent } from 'shared/actions/intent';
import { readAll as readAllOutput } from 'shared/actions/output';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { readAll as readAllSkillVersion } from 'shared/actions/skill-version';
import { filter, flow, head, map, prop, propEq, slice } from 'lodash/fp';
import getConfig from 'relient/config';
import { getWithBaseUrl } from 'relient/url';
import { columns } from './skill-test-columns';

import selector from './skill-import-selector';

const { Option } = Select;
const { useForm, useWatch } = Form;

const mapWithIndex = map.convert({ cap: false });

const getAction = ({
  isTesting,
  skillName,
  skillCode,
  skillVersion,
}) => `/skill/edit/skill/excel-import/${isTesting ? 'test' : ''}/v2?skillName=${skillName}&skillCode=${skillCode}&skillVersion=${skillVersion}`;

const result = () => {
  const {
    skills,
    skillsWithCodeKey,
    token,
  } = useSelector(selector);

  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const [form] = useForm();
  const skillName = useWatch('skillName', form);
  const skillCode = useWatch('skillCode', form);
  const defaultSkillName = prop([skillCode, 'name'])(skillsWithCodeKey);

  const openImportForm = useCallback(
    () => {
      setVisible(true);
      setIsTesting(false);
    },
    [setVisible, setIsTesting],
  );

  const openTestForm = useCallback(() => {
    setVisible(true);
    setIsTesting(true);
  }, [setVisible, setIsTesting]);

  const closeForm = useCallback(() => {
    setVisible(false);
    form.resetFields();
  }, [setVisible, form]);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState([]);
  const onUpload = useCallback(async ({ file: { status, response } }) => {
    setUploading(true);
    if (status === 'done') {
      if (response.code === 'SUCCESS') {
        message.success('检查完成，测试文件格式正确');
        if (!isTesting) {
          await Promise.all([
            dispatch(readAllBuiltinIntent()),
            dispatch(readAllIntent()),
            dispatch(readAllOutput()),
            dispatch(readAllSkillVersion()),
          ]);
          message.success('上传成功');
        }
      } else if (response.data && response.data.length > 0) {
        flow(mapWithIndex((item, index) => ({ ...item, key: index + 1 })), setError)(response.data);
      } else {
        message.error(response.msg);
      }
      setUploading(false);
      form.resetFields();
      setVisible(false);
    } else if (status === 'error') {
      message.error(response ? response.msg : '上传失败，请稍后再试');
      setUploading(false);
      form.resetFields();
      setVisible(false);
    }
  }, [isTesting, setUploading, setVisible, form, dispatch]);

  const closeErrorInfo = useCallback(() => setError([]), [setError]);

  return (
    <>
      <Button
        icon={<UploadOutlined />}
        type="primary"
        loading={uploading}
        onClick={openImportForm}
        size="large"
        style={{
          position: 'absolute',
          top: 24,
          left: 140,
        }}
      >
        上传技能
      </Button>
      <Button
        icon={<UploadOutlined />}
        loading={uploading}
        onClick={openTestForm}
        size="large"
        type="primary"
        ghost
        style={{
          position: 'absolute',
          top: 24,
          left: 280,
        }}
      >
        测试上传文件
      </Button>
      <a
        href={`${getWithBaseUrl('/template.xlsx', getConfig('baseUrl'))}`}
        download="语料模板.xlsx"
      >
        <Tooltip
          title="下载模板"
          placement="top"
        >
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            size="large"
            ghost
            style={{
              position: 'absolute',
              top: 24,
              left: 450,
            }}
          />
        </Tooltip>
      </a>
      <Modal
        footer={null}
        onCancel={closeForm}
        visible={visible}
      >
        <Form
          form={form}
          autoComplete="off"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 16 }}
          initialValues={{
            skillCode: '',
          }}
          style={{
            marginTop: '40px',
          }}
        >
          {!skillCode && (
            <Form.Item
              label="技能名"
              name="skillName"
              rules={[{ required: true }]}
            >
              <Input
                placeholder="请输入技能名"
                allowClear
              />
            </Form.Item>
          )}
          <Form.Item
            label="技能代号"
            name="skillCode"
          >
            <Select>
              <Option value=""><b>无</b></Option>
              {map(({ code, id, name }) => (
                <Option style={{ position: 'relative' }} value={code} key={id}>
                  <b
                    style={{
                      width: '55%',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {name}
                  </b>
                </Option>
              ))(skills)}
            </Select>
          </Form.Item>
          {skillCode && (
            <Form.Item
              label="技能版本"
              name="skillVersion"
              rules={[{ required: true }]}
            >
              <Select>
                {
                  map((item) => (
                    <Option style={{ position: 'relative' }} value={item.version} key={item.id}>
                      {item.version}
                    </Option>
                  ))(slice(1, 4)(prop('skillVersions')(head(filter(propEq('code', form.getFieldValue('skillCode')))(skills)))))
                }
              </Select>
            </Form.Item>
          )}
          <Form.Item
            label="选择文件"
            shouldUpdate={(prevValue, curValue) => prevValue.skillVersion !== curValue.skillVersion}
          >
            <Upload
              name="file"
              onChange={onUpload}
              showUploadList={false}
              action={getAction({
                isTesting,
                skillName: skillName || defaultSkillName,
                skillCode,
                skillVersion: form.getFieldValue('skillVersion'),
              })}
              headers={{ token }}
            >
              <Button
                icon={<UploadOutlined />}
                loading={uploading}
                disabled={!skillCode && !skillName}
              >
                {isTesting ? '测试' : '上传'}
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        visible={error.length > 0}
        onOk={closeErrorInfo}
        onCancel={closeErrorInfo}
        title="错误提示"
        width={1000}
      >
        <Table
          columns={columns}
          dataSource={error}
        />
      </Modal>
    </>
  );
};

result.displayName = __filename;

result.propTypes = {};

export default result;
