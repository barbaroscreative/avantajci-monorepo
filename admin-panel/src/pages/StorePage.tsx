import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Typography, Upload, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import axios from 'axios';

const { Title } = Typography;

interface Store {
  id: number;
  name: string;
  logoUrl?: string;
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
}

const StorePage: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Store | null>(null);
  const [form] = Form.useForm();
  const [logoFileList, setLogoFileList] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/store', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setStores(res.data);
    } catch {
      message.error('Mağazalar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/category', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setCategories(res.data);
    } catch {
      message.error('Kategoriler yüklenemedi');
    }
  };

  useEffect(() => { fetchStores(); fetchCategories(); }, []);

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setLogoFileList([]);
    setModalOpen(true);
  };

  const handleEdit = (store: Store) => {
    setEditing(store);
    form.setFieldsValue(store);
    if (store.logoUrl) {
      setLogoFileList([
        {
          uid: '-1',
          name: 'logo.png',
          status: 'done',
          url: `http://localhost:5008${store.logoUrl}`,
        },
      ]);
    } else {
      setLogoFileList([]);
    }
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'Mağazayı silmek istediğinize emin misiniz?',
      onOk: async () => {
        try {
          await axios.delete(`/api/store/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
          message.success('Mağaza silindi');
          fetchStores();
        } catch {
          message.error('Silinemedi');
        }
      },
    });
  };

  const handleFinish = async (values: any) => {
    let logoUrl = editing?.logoUrl || '';
    if (logoFileList.length && logoFileList[0].originFileObj) {
      const formData = new FormData();
      formData.append('file', logoFileList[0].originFileObj);
      formData.append('name', values.name);
      formData.append('categoryId', values.categoryId);
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      logoUrl = res.data.url;
    } else if (logoFileList.length && logoFileList[0].url) {
      logoUrl = logoFileList[0].url.replace('http://localhost:5008', '');
    }
    try {
      if (editing) {
        await axios.put(`/api/store/${editing.id}`, { ...values, logoUrl }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        message.success('Mağaza güncellendi');
      } else {
        await axios.post('/api/store', { ...values, logoUrl }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        message.success('Mağaza eklendi');
      }
      setModalOpen(false);
      fetchStores();
    } catch {
      message.error('İşlem başarısız');
    }
  };

  return (
    <div>
      <Title level={3}>Mağazalar</Title>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ marginBottom: 16 }}>Yeni Mağaza</Button>
      <Table rowKey="id" dataSource={stores} loading={loading} pagination={false}
        columns={[
          { title: 'ID', dataIndex: 'id' },
          { title: 'Adı', dataIndex: 'name' },
          { title: 'Logo', dataIndex: 'logoUrl', render: (url?: string) => url ? <img src={`http://localhost:5008${url}`} alt="logo" style={{ width: 90, height: 90, objectFit: 'contain' }} /> : '-' },
          { title: 'Oluşturulma', dataIndex: 'createdAt', render: (v: string) => new Date(v).toLocaleString() },
          {
            title: 'İşlemler',
            render: (_, store: Store) => (
              <Space>
                <Button icon={<EditOutlined />} onClick={() => handleEdit(store)} />
                <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(store.id)} />
              </Space>
            ),
          },
        ]}
      />
      <Modal open={modalOpen} title={editing ? 'Mağaza Düzenle' : 'Yeni Mağaza'} onCancel={() => setModalOpen(false)} onOk={() => form.submit()} okText="Kaydet">
        <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item 
          name="categoryId" 
          label="Kategori" 
          rules={[{ required: true, message: 'Kategori seçin' }]}
          > 
          <Select 
          options={categories?.map(c => ({ value: c.id, label: c.name })) || []} /> 
          </Form.Item> 
          <Form.Item 
          name="name" 
          label="Mağaza Adı" 
          rules={[{ required: true, message: 'Ad girin' }]}
          > 
          <Input /> 
          </Form.Item>

        </Form>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>Logo</label>
          <ImgCrop rotationSlider>
            <Upload
              listType="picture-card"
              fileList={logoFileList}
              onChange={({ fileList }) => setLogoFileList(fileList)}
              beforeUpload={() => false}
              maxCount={1}
              accept="image/*"
            >
              {logoFileList.length < 1 && <UploadOutlined />}
            </Upload>
          </ImgCrop>
        </div>
      </Modal>
    </div>
  );
};

export default StorePage; 