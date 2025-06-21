import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Typography, DatePicker, Select, Upload, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import axios from 'axios';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface Store { id: number; name: string; categoryId: number; logoUrl?: string; createdAt?: string; }
interface Bank { id: number; name: string; }
interface Category { id: number; name: string; }
interface Campaign {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  category?: string;
  imageUrl?: string;
  rewardAmount?: string;
  rewardType?: string;
  stores: Store[];
  bank: Bank;
  createdAt: string;
}

const CampaignPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [form] = Form.useForm();
  const [imageFileList, setImageFileList] = useState<any[]>([]);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [cRes, sRes, bRes] = await Promise.all([
        axios.get('/api/campaign', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
        axios.get('/api/store', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
        axios.get('/api/bank', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
      ]);
      setCampaigns(cRes.data);
      setStores(sRes.data);
      setBanks(bRes.data);
    } catch {
      message.error('Veriler yüklenemedi');
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

  useEffect(() => { fetchAll(); fetchCategories(); }, []);

  const handleAdd = () => {
    setEditing(null);
    setSelectedCategory(null);
    form.resetFields();
    setImageFileList([]);
    setCategoryModalOpen(true);
    setModalOpen(false);
  };

  const handleCategorySelect = (catId: number) => {
    const filteredStores = stores.filter(s => s.categoryId === catId);
    if (filteredStores.length === 0) {
      message.error('Bu kategoriye ait mağaza yok!');
      return;
    }
    setSelectedCategory(catId);
    form.setFieldsValue({ storeIds: [] });
    setCategoryModalOpen(false);
    setModalOpen(true);
  };

  const handleEdit = (campaign: Campaign) => {
    setEditing(campaign);
    const categoryId = campaign.stores?.[0]?.categoryId;
    setSelectedCategory(categoryId);

    form.setFieldsValue({
      ...campaign,
      storeIds: campaign.stores?.map(s => s.id),
      bankId: campaign.bank.id,
      categoryId: categoryId,
      dateRange: [dayjs(campaign.startDate), dayjs(campaign.endDate)],
    });

    if (campaign.imageUrl) {
      setImageFileList([
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: `http://localhost:5008${campaign.imageUrl}`,
        },
      ]);
    } else {
      setImageFileList([]);
    }
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'Kampanyayı silmek istediğinize emin misiniz?',
      onOk: async () => {
        try {
          await axios.delete(`/api/campaign/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
          message.success('Kampanya silindi');
          fetchAll();
        } catch {
          message.error('Silinemedi');
        }
      },
    });
  };

  const handleFinish = async (values: any) => {
    let imageUrl = editing?.imageUrl || '';
    if (imageFileList.length && imageFileList[0].originFileObj) {
      const formData = new FormData();
      formData.append('file', imageFileList[0].originFileObj);
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      imageUrl = res.data.url;
    } else if (imageFileList.length && imageFileList[0].url) {
      imageUrl = imageFileList[0].url.replace('http://localhost:5008', '');
    }
    
    const categoryName = categories.find(c => c.id === values.categoryId)?.name;

    const payload = {
      ...values,
      imageUrl,
      category: categoryName,
      startDate: values.dateRange?.[0]?.toISOString(),
      endDate: values.dateRange?.[1]?.toISOString(),
    };
    delete payload.categoryId;
    delete payload.dateRange;

    try {
      if (editing) {
        await axios.put(`/api/campaign/${editing.id}`, payload, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        message.success('Kampanya güncellendi');
      } else {
        await axios.post('/api/campaign', payload, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        message.success('Kampanya eklendi');
      }
      setModalOpen(false);
      fetchAll();
    } catch {
      message.error('İşlem başarısız');
    }
  };

  const handleToggleActive = async (campaign: Campaign) => {
    try {
      const res = await axios.patch(`/api/campaign/${campaign.id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCampaigns(prev => prev.map(c => c.id === campaign.id ? res.data : c));
      message.success('Durum güncellendi');
    } catch(err: any) {
      message.error(err.response?.data?.message || 'Durum güncellenemedi');
    }
  };

  return (
    <div>
      <Title level={3}>Kampanyalar</Title>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ marginBottom: 16 }}>Yeni Kampanya</Button>
      <Table rowKey="id" dataSource={campaigns} loading={loading} pagination={false}
        columns={[
          { title: 'ID', dataIndex: 'id' },
          { title: 'Başlık', dataIndex: 'title' },
          { title: 'Mağaza', dataIndex: ['stores'], render: (stores: Store[]) => stores?.map(s => s.name).join(', ') },
          { title: 'Banka', dataIndex: ['bank', 'name'] },
          { title: 'Başlangıç', dataIndex: 'startDate', render: (v: string) => new Date(v).toLocaleDateString() },
          { title: 'Bitiş', dataIndex: 'endDate', render: (v: string) => new Date(v).toLocaleDateString() },
          { 
            title: 'Durum', 
            dataIndex: 'isActive',
            render: (isActive: boolean, campaign: Campaign) => {
              const now = dayjs();
              const start = dayjs(campaign.startDate);
              const end = dayjs(campaign.endDate);
              
              const isDateRangeActive = now.isAfter(start) && now.isBefore(end);
              let statusText = '';
              
              if (now.isAfter(end)) {
                statusText = 'Süresi Doldu';
              } else if (!isActive) {
                statusText = 'Pasif';
              } else if (now.isBefore(start)) {
                statusText = `Başlamasına ${start.diff(now, 'day')} gün var`;
              } else {
                statusText = 'Yayında';
              }
              
              const isSwitchDisabled = !isDateRangeActive;

              return (
                <Space>
                  <span>{statusText}</span>
                  <Switch 
                    checked={isActive} 
                    disabled={isSwitchDisabled} 
                    onChange={() => handleToggleActive(campaign)} 
                    size="small"
                  />
                </Space>
              );
            }
          },
          { title: 'Ödül', render: (_: any, c: Campaign) => c.rewardAmount ? `${c.rewardAmount} ${c.rewardType || ''}` : '-' },
          { title: 'Görsel', dataIndex: 'imageUrl', render: (url?: string) => url ? <img src={`http://localhost:5008${url}`} alt="kampanya" style={{ width: 40, height: 40, objectFit: 'contain' }} /> : '-' },
          {
            title: 'İşlemler',
            render: (_, campaign: Campaign) => (
              <Space>
                <Button icon={<EditOutlined />} onClick={() => handleEdit(campaign)} />
                <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(campaign.id)} />
              </Space>
            ),
          },
        ]}
      />
      <Modal open={categoryModalOpen} title="Kategori Seç" onCancel={() => setCategoryModalOpen(false)} footer={null}>
        <Select
          style={{ width: '100%' }}
          placeholder="Kategori seçin"
          options={categories.map(c => ({ value: c.id, label: c.name }))}
          onChange={handleCategorySelect}
          autoFocus
        />
      </Modal>
      <Modal open={modalOpen} title={editing ? 'Kampanya Düzenle' : 'Yeni Kampanya'} onCancel={() => setModalOpen(false)} onOk={() => form.submit()} okText="Kaydet" width={600}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="title" label="Başlık" rules={[{ required: true, message: 'Başlık girin' }]}
          > 
            <Input /> 
            </Form.Item>
          <Form.Item 
          name="description" 
          label="Açıklama" 
          rules={[{ required: true, message: 'Açıklama girin' }]}
          > 
          <Input.TextArea rows={2} /> 
          </Form.Item>
          <Form.Item name="categoryId" label="Kategori" initialValue={selectedCategory} rules={[{ required: true, message: 'Kategori seçin' }]}> 
            <Select 
              options={categories.map(c => ({ value: c.id, label: c.name }))}
              value={selectedCategory}
              disabled
            />
          </Form.Item>
          <Form.Item name="storeIds" label="Mağazalar" rules={[{ required: true, message: 'Mağaza seçin' }]}> 
            <Select
              mode="multiple"
              onChange={newStoreIds => form.setFieldsValue({ storeIds: newStoreIds })}
              options={stores.filter(s => !selectedCategory || s.categoryId === selectedCategory).map(s => ({ value: s.id, label: s.name }))}
              placeholder="Mağaza seçin"
              maxTagCount={4}
              dropdownRender={menu => {
                const filteredStores = stores.filter(s => s.categoryId === selectedCategory);
                return (
                  <>
                    <div style={{ padding: 8 }}>
                      <Button type="link" size="small" onClick={() => form.setFieldsValue({ storeIds: filteredStores.map(s => s.id) })}>
                        Tümünü Seç
                      </Button>
                      <Button type="link" size="small" onClick={() => form.setFieldsValue({ storeIds: [] })}>
                        Temizle
                      </Button>
                    </div>
                    {menu}
                  </>
                );
              }}
            />
          </Form.Item>
          <Form.Item 
          name="bankId" 
          label="Banka" 
          rules={[{ required: true, message: 'Banka seçin' }]}
          > 
          <Select options={banks.map(b => ({ value: b.id, label: b.name }))} /> 
          </Form.Item>
          <Form.Item 
          name="dateRange" 
          label="Tarih Aralığı" 
          rules={[{ required: true, message: 'Tarih seçin' }]}
          > 
          <RangePicker format="DD.MM.YYYY" /> 
          </Form.Item>
          <Form.Item 
          name="rewardAmount" 
          label="Ödül Miktarı"
          > 
          <Input /> 
          </Form.Item>
          <Form.Item 
          name="rewardType" 
          label="Ödül Tipi"
          > 
          <Input /> 
          </Form.Item>
        </Form>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>Görsel</label>
          <ImgCrop rotationSlider>
            <Upload
              listType="picture-card"
              fileList={imageFileList}
              onChange={({ fileList }) => setImageFileList(fileList)}
              beforeUpload={() => false}
              maxCount={1}
              accept="image/*"
            >
              {imageFileList.length < 1 && <UploadOutlined />}
            </Upload>
          </ImgCrop>
        </div>
      </Modal>
    </div>
  );
};

export default CampaignPage; 