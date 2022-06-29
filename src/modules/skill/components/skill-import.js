import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Input, message, Modal, Select, Table, Tooltip, Upload } from 'antd';
import { readAll } from 'shared/actions/skill';
import { readAll as readAllBuiltinIntent } from 'shared/actions/builtin-intent';
import { readAll as readAllIntent } from 'shared/actions/intent';
import { readAll as readAllOutput } from 'shared/actions/output';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { readAll as readAllSkillVersion } from 'shared/actions/skill-version';
import { filter, find, flow, head, map, prop, propEq, slice } from 'lodash/fp';
import getConfig from 'relient/config';
import { getWithBaseUrl } from 'relient/url';
import { columns } from './skill-test-columns';

import selector from '../skill-selector';

const { Option } = Select;

const mapWithIndex = map.convert({ cap: false });

const result = () => {
  const [uploadForm] = Form.useForm();
  const {
    skills,
    token,
  } = useSelector(selector);

  const dispatch = useDispatch();

  // modal是否可见
  const [visible, setVisible] = useState(false);
  // upload是否可用,false不可用，true表示可用
  const [uploadFlag, setUploadFlag] = useState(false);
  // upload的类型，当uploadFlag为true时，uploadType为true表示正式上传，为false表示测试
  const [isUpload, setIsUpload] = useState(true);
  // 输入框是否显示
  const [isInputShow, setIsInputShow] = useState(true);

  const openImportForm = useCallback(
    () => {
      setVisible(true);
      setIsUpload(true);
    },
    [visible, setVisible, isUpload, setIsUpload],
  );

  const openTestForm = useCallback(
    () => {
      setVisible(true);
      setIsUpload(false);
    },
    [visible, isUpload],
  );

  const closeForm = useCallback(
    () => {
      setVisible(false);
      setUploadFlag(false);
      uploadForm.resetFields();
      setIsInputShow(true);
    },
    [visible, uploadFlag, isInputShow],
  );

  const onNameChange = useCallback(
    (value) => {
      if (value.target.value !== '') {
        setUploadFlag(true);
      } else if (value.target.value === '') {
        setUploadFlag(false);
      }
    }, [uploadFlag],
  );

  const onCodeChange = useCallback(
    (value) => {
      setUploadFlag(false);
      uploadForm.resetFields();
      uploadForm.setFieldsValue({ skillCode: value });
      if (value !== '') {
        setIsInputShow(false);
      } else {
        setIsInputShow(true);
      }
    }, [isInputShow, uploadFlag],
  );

  const onVersionChange = useCallback(
    () => {
      setUploadFlag(true);
    }, [uploadFlag],
  );

  const beforeUpload = () => (isUpload
    ? `/skill/edit/skill/excel-import/v2?skillName=${isInputShow
      ? `${uploadForm.getFieldValue('skillName')}`
      : `${prop('name')(find((o) => o.code === uploadForm.getFieldValue('skillCode'))(skills))}&skillCode=${
        uploadForm.getFieldValue('skillCode')}&skillVersion=${uploadForm.getFieldValue('skillVersion')}`}`
    : `/skill/edit/skill/excel-import/test/v2?skillName=${isInputShow
      ? `${uploadForm.getFieldValue('skillName')}`
      : `${prop('name')(find((o) => o.code === uploadForm.getFieldValue('skillCode'))(skills))}&skillCode=${
        uploadForm.getFieldValue('skillCode')}&skillVersion=${uploadForm.getFieldValue('skillVersion')}`}`);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState([]);
  const onUpload = useCallback(async ({ file: { status, response } }) => {
    setUploading(true);
    if (status === 'done') {
      if (response.code === 'SUCCESS') {
        message.success('检查完成，测试文件格式正确');
        if (isUpload) {
          await Promise.all([
            dispatch(readAll()),
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
      setUploadFlag(false);
      setUploading(false);
      uploadForm.resetFields();
      setVisible(false);
      setIsInputShow(true);
    } else if (status === 'error') {
      message.error(response ? response.msg : '上传失败，请稍后再试');
      setUploadFlag(false);
      setUploading(false);
      uploadForm.resetFields();
      setVisible(false);
      setIsInputShow(true);
    }
  }, [isUpload, uploadFlag, uploading, visible, isInputShow]);

  const closeErrorInfo = useCallback(
    () => {
      setError([]);
    },
    [setError],
  );

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
        destroyOnClose
      >
        <Form
          form={uploadForm}
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
          {
            isInputShow
            && (
              <Form.Item
                label="技能名"
                name="skillName"
                rules={[{ required: true }]}
              >
                <Input
                  placeholder="请输入技能名"
                  onChange={onNameChange}
                  allowClear
                />
              </Form.Item>
            )
          }
          <Form.Item
            label="技能代号"
            name="skillCode"
          >
            <Select
              onChange={onCodeChange}
            >
              <Option value=""><b>无</b></Option>
              {
                map((item) => (
                  <Option style={{ position: 'relative' }} value={item.code} key={item.id}>
                    <b
                      style={{
                        width: '55%',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.name}
                    </b>
                  </Option>
                ))(skills)
              }
            </Select>
          </Form.Item>
          {
            !isInputShow
            && (
              <Form.Item
                label="技能版本"
                name="skillVersion"
                rules={[{ required: true }]}
              >
                <Select
                  onChange={onVersionChange}
                >
                  {
                    map((item) => (
                      <Option style={{ position: 'relative' }} value={item.version} key={item.id}>
                        {item.version}
                      </Option>
                    ))(slice(1, 4)(prop('skillVersions')(head(filter(propEq('code', uploadForm.getFieldValue('skillCode')))(skills)))))
                  }
                </Select>
              </Form.Item>
            )
          }
          <Form.Item
            label="选择文件"
          >
            <Upload
              name="file"
              onChange={onUpload}
              showUploadList={false}
              action={beforeUpload}
              headers={{ token }}
            >
              <Button
                icon={<UploadOutlined />}
                loading={uploading}
                disabled={!uploadFlag}
              >
                {isUpload ? '上传' : '测试'}
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
        destroyOnClose
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

result.propTypes = {
};

export default result;
