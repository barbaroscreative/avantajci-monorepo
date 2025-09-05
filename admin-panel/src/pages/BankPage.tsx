import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Typography, Upload } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import axios from 'axios';

const { Title } = Typography;

interface Bank {
  id: number;
  name: string;
  logoUrl?: string;
  createdAt: string;
}

const BankPage: React.FC = () => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Bank | null>(null);
  const [form] = Form.useForm();
  const [logoFileList, setLogoFileList] = useState<any[]>([]);

  const fetchBanks = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/bank', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      console.log('🔍 BANK FETCH DATA:', res.data, typeof res.data, Array.isArray(res.data));
      setBanks(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('❌ BANK FETCH ERROR:', error);
      message.error('Bankalar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBanks(); }, []);

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setLogoFileList([]);
    setModalOpen(true);
  };

  const handleEdit = (bank: Bank) => {
    setEditing(bank);
    form.setFieldsValue(bank);
    if (bank.logoUrl) {
      setLogoFileList([
        {
          uid: '-1',
          name: 'logo.png',
          status: 'done',
          url: `http://localhost:5008${bank.logoUrl}`,
        },
      ]);
    } else {
      setLogoFileList([]);
    }
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'Bankayı silmek istediğinize emin misiniz?',
      onOk: async () => {
        try {
          await axios.delete(`/api/bank/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
          message.success('Banka silindi');
          fetchBanks();
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
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      logoUrl = res.data.url;
    } else if (logoFileList.length && logoFileList[0].url) {
      logoUrl = logoFileList[0].url.replace('http://localhost:5008', '');
    }
    try {
      if (editing) {
        await axios.put(`/api/bank/${editing.id}`, { ...values, logoUrl }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        message.success('Banka güncellendi');
      } else {
        await axios.post('/api/bank', { ...values, logoUrl }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        message.success('Banka eklendi');
      }
      setModalOpen(false);
      fetchBanks();
    } catch {
      message.error('İşlem başarısız');
    }
  };

  return (
    <div>
      <Title level={3}>Bankalar</Title>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ marginBottom: 16 }}>Yeni Banka</Button>
      <Table rowKey="id" dataSource={banks} loading={loading} pagination={false}
        columns={[
          { title: 'ID', dataIndex: 'id' },
          { title: 'Adı', dataIndex: 'name' },
          { title: 'Logo', dataIndex: 'logoUrl', render: (url?: string) => url ? <img src={`http://localhost:5008${url}`} alt="logo" style={{ width: 40, height: 40, objectFit: 'contain' }} /> : '-' },
          { title: 'Oluşturulma', dataIndex: 'createdAt', render: (v: string) => new Date(v).toLocaleString() },
          {
            title: 'İşlemler',
            render: (_, bank: Bank) => (
              <Space>
                <Button icon={<EditOutlined />} onClick={() => handleEdit(bank)} />
                <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(bank.id)} />
              </Space>
            ),
          },
        ]}
      />
      <Modal open={modalOpen} title={editing ? 'Banka Düzenle' : 'Yeni Banka'} onCancel={() => setModalOpen(false)} onOk={() => form.submit()} okText="Kaydet">
        <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="Banka Adı"
          rules={[{ required: true, message: 'Ad girin' }]}
        >
          <Input />
        </Form.Item>          
        <Form.Item name="logoUrl" label="Logo">
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
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BankPage; 