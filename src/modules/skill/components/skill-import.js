import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { func } from 'prop-types';
import {
  Table,
  message,
  Select,
  Input,
  Modal,
  Form,
  Button,
  Tooltip,
  Upload,
} from 'antd';
import { readAll } from 'shared/actions/skill';
import { readAll as readAllBuiltinIntent } from 'shared/actions/builtin-intent';
import { readAll as readAllIntent } from 'shared/actions/intent';
import { readAll as readAllOutput } from 'shared/actions/output';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import {
  readAll as readAllSkillVersion,
} from 'shared/actions/skill-version';
import { find, propEq, flow, prop, map, slice, filter, head } from 'lodash/fp';
import getConfig from 'relient/config';
import { getWithBaseUrl } from 'relient/url';
import { columns } from './skill-test-columns';

import selector from '../skill-selector';

const { Option } = Select;

const mapWithIndex = map.convert({ cap: false });

const result = ({
  getDataSource,
}) => {
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
  // 保存upload使用得action值
  const [action, setAction] = useState('');
  // 输入框是否显示
  const [isInputShow, setIsInputShow] = useState(true);
  // 保存render所需的skillVersion数组，直接用getFieldValue表单不会rerender
  const [versionArray, setVersionArray] = useState([]);

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
      if (value !== '') {
        // 防止用户改变skillCode后skillName还保留
        uploadForm.setFieldsValue({ skillCode: value });
        setVersionArray(
          slice(1, 4)(prop('skillVersions')(head(filter(propEq('code', value))(getDataSource(skills))))),
        );
        setIsInputShow(false);
      } else {
        setIsInputShow(true);
      }
    }, [isInputShow, uploadFlag, versionArray],
  );

  const onVersionChange = useCallback(
    () => {
      setUploadFlag(true);
    }, [uploadFlag],
  );

  const beforeUpload = useCallback(
    () => {
      const base = isUpload
        ? '/skill/edit/skill/excel-import/v2?skillName='
        : '/skill/edit/skill/excel-import/test/v2?skillName=';
      const skillName = uploadForm.getFieldValue('skillName');
      const skillCode = uploadForm.getFieldValue('skillCode');
      const skillVersion = uploadForm.getFieldValue('skillVersion');
      const temp = find((o) => o.code === skillCode)(getDataSource(skills));
      if (isInputShow) {
        setAction(`${base}${skillName}`);
      } else {
        setAction(`${base}${temp.name}&skillCode=${skillCode}&skillVersion=${skillVersion}`);
      }
      return true;
    }, [action, isInputShow, isUpload, versionArray],
  );

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
      // 需要在此setIsupload，否则上方得promise会在此行代码后执行，导致即使是测试也会发送刷新数据的请求
      setIsUpload(true);
    } else if (status === 'error') {
      message.error(response ? response.msg : '上传失败，请稍后再试');
      setIsUpload(true);
    }
    setUploadFlag(false);
    setUploading(false);
    uploadForm.resetFields();
    setVisible(false);
    setIsInputShow(true);
    setVersionArray([]);
  }, [isUpload, uploadFlag, uploading, visible, isInputShow, versionArray]);

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
                ))(getDataSource(skills))
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
                    ))(versionArray)
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
              action={action}
              onChange={onUpload}
              showUploadList={false}
              headers={{ token }}
              beforeUpload={beforeUpload}
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
  getDataSource: func.isRequired,
};

export default result;
