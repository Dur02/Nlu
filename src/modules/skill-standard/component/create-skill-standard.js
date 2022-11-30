import React, { useCallback, useState } from 'react';
import { Modal, Form, Input, Upload, Button, message, Image } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Item, useForm } = Form;

const result = ({
  createVisible,
  setCreateVisible,
  token,
  readAllInfo,
  createInfo,
}) => {
  const [createForm] = useForm();
  const [iconFileList, setIconFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const onFinish = useCallback(async (value) => {
    await createInfo({ ...value });
    await readAllInfo();
    setCreateVisible(false);
    setIconFileList([]);
    createForm.resetFields();
  }, [createVisible, iconFileList, createForm]);

  const handleChange = useCallback(({ file, fileList }) => {
    let newFileList = [...fileList];
    if (file.status === 'done') {
      if (file.response.code === 'SUCCESS') {
        createForm.setFieldsValue({ skillIcon: file.response.data.resourceName });
        message.success('上传成功');
      } else {
        message.error(file.response.msg);
        newFileList = [];
        createForm.setFieldsValue({ uploadIcon: null, skillIcon: null });
      }
    } else if (file.status === 'error') {
      newFileList = [];
      createForm.setFieldsValue({ uploadIcon: null, skillIcon: null });
      message.error(file.response && file.response.msg ? file.response.msg : '上传失败，检查文件格式或稍后再试');
    }
    setIconFileList(newFileList);
  }, [createForm, iconFileList]);

  const handlePreview = useCallback((file) => {
    if (file.status === 'done' && file.response.code === 'SUCCESS') {
      setPreviewTitle(file.name);
      setPreviewImage(file.response.data.resourceUrl);
    }
    setPreviewOpen(true);
  }, [previewTitle, previewImage, previewOpen]);

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
            action="/skill/edit/skill-standard/resource/upload"
            listType="picture-card"
            onChange={handleChange}
            headers={{ token }}
            onPreview={handlePreview}
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
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

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <Image alt="example" style={{ width: '100%', marginTop: '20px' }} src={previewImage} />
      </Modal>
    </Modal>
  );
};

result.displayName = __filename;

export default result;
