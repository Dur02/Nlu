import React, { useCallback, useState } from 'react';
import { Modal, Form, Input, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useAction } from 'relient/actions';
import { readAll, create } from 'shared/actions/skill-app-info';

const { Item, useForm } = Form;

const result = ({
  createVisible,
  setCreateVisible,
  token,
}) => {
  const readAllAction = useAction(readAll);
  const createAction = useAction(create);

  const [createForm] = useForm();
  const [iconFileList, setIconFileList] = useState([]);

  const onFinish = useCallback(async (value) => {
    await createAction({ ...value });
    await readAllAction();
    setCreateVisible(false);
  }, []);

  const onUpload = useCallback(({ file, fileList }) => {
    let newFileList = [...fileList];
    if (file.status === 'done') {
      if (file.response.code === 'SUCCESS') {
        createForm.setFieldsValue({ skillIcon: file.response.data.resourceName });
        message.success('上传成功');
      } else {
        message.error(file.response.msg);
        newFileList = [];
        createForm.setFieldsValue({ skillIcon: null });
      }
    } else if (file.status === 'error') {
      newFileList = [];
      createForm.setFieldsValue({ skillIcon: null });
      message.error(file.response && file.response.msg ? file.response.msg : '上传失败，检查文件格式或稍后再试');
    }
    setIconFileList(newFileList);
  }, []);

  return (
    <Modal
      open={createVisible}
      footer={null}
      onCancel={() => {
        setCreateVisible(false);
        setIconFileList([]);
        createForm.resetFields();
      }}
    >
      <Form
        form={createForm}
        onFinish={onFinish}
        style={{
          marginTop: '25px',
        }}
      >
        <Item
          label="技能名"
          name="skillName"
          rules={[{ required: true }]}
        >
          <Input placeholder="请输入技能名" autoComplete="off" allowClear />
        </Item>

        <Item
          label="上传图标"
          name="uploadIcon"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e && e.fileList;
          }}
          rules={[{ required: true }]}
        >
          <Upload
            maxCount={1}
            fileList={iconFileList}
            action="/skill/edit/skill-app/resource/upload"
            listType="picture"
            onChange={onUpload}
            headers={{ token }}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Item>

        <Item
          hidden
          name="skillIcon"
          rules={[{ required: true }]}
        >
          <Input />
        </Item>

        <Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Item>
      </Form>
    </Modal>
  );
};

result.displayName = __filename;

export default result;
