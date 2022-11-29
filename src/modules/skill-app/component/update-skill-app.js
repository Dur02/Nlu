import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Form, Input, Upload, Button, message, Image } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Item, useForm } = Form;

const result = ({
  token,
  updateVisible,
  updateItem,
  closeUpdate,
  readAllInfo,
  updateInfo,
}) => {
  const [updateForm] = useForm();
  const [iconFileList, setIconFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const onFinish = useCallback(async (value) => {
    await updateInfo({ ...value });
    await readAllInfo();
    closeUpdate();
    setIconFileList([]);
    updateForm.resetFields();
  }, []);

  const handleChange = useCallback(({ file, fileList }) => {
    let newFileList = [...fileList];
    if (file.status === 'done') {
      if (file.response.code === 'SUCCESS') {
        updateForm.setFieldsValue({ skillIcon: file.response.data.resourceName });
        message.success('上传成功');
      } else {
        message.error(file.response.msg);
        newFileList = [];
        updateForm.setFieldsValue({ uploadIcon: null, skillIcon: null });
      }
    } else if (file.status === 'error') {
      newFileList = [];
      updateForm.setFieldsValue({ uploadIcon: null, skillIcon: null });
      message.error(file.response && file.response.msg ? file.response.msg : '上传失败，检查文件格式或稍后再试');
    }
    setIconFileList(newFileList);
  }, [updateForm, iconFileList]);

  const handlePreview = useCallback((file) => {
    // console.log(file);
    if (file.status === 'done' && (file.response ? file.response.code === 'SUCCESS' : true)) {
      setPreviewTitle(file.name);
      setPreviewImage(file.response ? file.response.data.resourceUrl : file.url);
    }
    setPreviewOpen(true);
  }, [updateItem, previewTitle, previewImage, previewOpen]);

  useEffect(() => {
    // 每次updateItem改变重设表单的值
    if (updateItem) {
      updateForm.setFieldsValue({
        skillName: updateItem.skillName,
        uploadIcon: [{
          uid: -1,
          name: updateItem.iconName,
          status: 'done',
          url: updateItem.iconUrl,
        }],
        skillIcon: updateItem.iconName,
        id: updateItem.id,
      });
      setIconFileList([{
        uid: -1,
        name: updateItem.iconName,
        status: 'done',
        url: updateItem.iconUrl,
      }]);
    }
  }, [updateItem]);

  return (
    <>
      {
        updateItem && (
          <Modal
            open={updateVisible}
            footer={null}
            onCancel={() => {
              closeUpdate();
            }}
          >
            <Form
              form={updateForm}
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

              <Item
                hidden
                name="id"
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
        )
      }
    </>
  );
};

result.displayName = __filename;

export default result;
