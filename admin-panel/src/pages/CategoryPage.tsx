import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

interface Category {
  id: number;
  name: string;
  createdAt: string;
}

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form] = Form.useForm();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/category', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      console.log('🔍 CATEGORY FETCH DATA:', res.data, typeof res.data, Array.isArray(res.data));
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('❌ CATEGORY FETCH ERROR:', error);
      message.error('Kategoriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditing(category);
    form.setFieldsValue(category);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'Kategoriyi silmek istediğinize emin misiniz?',
      onOk: async () => {
        try {
          await axios.delete(`/api/category/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
          message.success('Kategori silindi');
          fetchCategories();
        } catch {
          message.error('Silinemedi');
        }
      },
    });
  };

  const handleFinish = async (values: any) => {
    try {
      if (editing) {
        await axios.put(`/api/category/${editing.id}`, values, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        message.success('Kategori güncellendi');
      } else {
        await axios.post('/api/category', values, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        message.success('Kategori eklendi');
      }
      setModalOpen(false);
      fetchCategories();
    } catch {
      message.error('İşlem başarısız');
    }
  };

  return (
    <div>
      <Title level={3}>Kategoriler</Title>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ marginBottom: 16 }}>Yeni Kategori</Button>
      <Table rowKey="id" dataSource={categories} loading={loading} pagination={false}
        columns={[
          { title: 'ID', dataIndex: 'id' },
          { title: 'Adı', dataIndex: 'name' },
          { title: 'Oluşturulma', dataIndex: 'createdAt', render: (v: string) => new Date(v).toLocaleString() },
          {
            title: 'İşlemler',
            render: (_: any, category: Category) => (
              <Space>
                <Button icon={<EditOutlined />} onClick={() => handleEdit(category)} />
                <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(category.id)} />
              </Space>
            ),
          },
        ]}
      />
      <Modal open={modalOpen} title={editing ? 'Kategori Düzenle' : 'Yeni Kategori'} onCancel={() => setModalOpen(false)} onOk={() => form.submit()} okText="Kaydet">
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="name" label="Kategori Adı" rules={[{ required: true, message: 'Ad girin' }]}
          > 
          <Input /> 
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryPage; 