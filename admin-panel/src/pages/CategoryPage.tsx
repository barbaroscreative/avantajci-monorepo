import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axiosInstance from '../api/axiosInstance';

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
      const res = await axiosInstance.get('/category');
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
          await axiosInstance.delete(`/category/${id}`);
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
        await axiosInstance.put(`/category/${editing.id}`, values);
        message.success('Kategori güncellendi');
      } else {
        await axiosInstance.post('/category', values);
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