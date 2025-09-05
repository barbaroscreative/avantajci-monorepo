import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Typography, DatePicker, Select, Upload, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import apiClient from '../api/axiosConfig';
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
        apiClient.get('/campaign'),
        apiClient.get('/store'),
        apiClient.get('/bank'),
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
      const res = await apiClient.get('/category');
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
    const filteredStores = stores?.filter(s => s.categoryId === catId) || [];
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
          url: `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '')}${campaign.imageUrl}`,
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
          await apiClient.delete(`/campaign/${id}`);
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
      const res = await apiClient.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      imageUrl = res.data.url;
    } else if (imageFileList.length && imageFileList[0].url) {
      imageUrl = new URL(imageFileList[0].url).pathname;
    }
    
    const categoryName = categories?.find(c => c.id === values.categoryId)?.name;

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
        await apiClient.put(`/campaign/${editing.id}`, payload);
        message.success('Kampanya güncellendi');
      } else {
        await apiClient.post('/campaign', payload);
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
      const res = await apiClient.patch(`/campaign/${campaign.id}/toggle`, {});
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
          { title: 'Mağaza', dataIndex: ['stores'], render: (stores: Store[]) => stores?.map(s => s.name).join(', ') || '-' },
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
          { title: 'Görsel', dataIndex: 'imageUrl', render: (url?: string) => url ? <img src={`${import.meta.env.VITE_API_BASE_URL?.replace('/api', '')}${url}`} alt="kampanya" style={{ width: 40, height: 40, objectFit: 'contain' }} /> : '-' },
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
          showSearch
          placeholder="Kategori seçin"
          style={{ width: '100%' }}
          onSelect={handleCategorySelect}
          filterOption={(input, option) =>
            (option?.children as unknown as string ?? '').toLowerCase().includes(input.toLowerCase())
          }
        >
          {categories?.map(c => <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>) || []}
        </Select>
      </Modal>
      <Modal open={modalOpen} title={editing ? 'Kampanya Düzenle' : 'Yeni Kampanya'} onCancel={() => setModalOpen(false)} footer={null} width={600}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="title" label="Başlık" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Açıklama" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="dateRange" label="Geçerlilik Tarihi" rules={[{ required: true }]}>
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="storeIds" label="Mağazalar" rules={[{ required: true }]}>
            <Select mode="multiple" placeholder="Mağaza seçin" showSearch filterOption={(input, option) =>
              (option?.children as unknown as string ?? '').toLowerCase().includes(input.toLowerCase())
            }>
              {stores?.filter(s => s.categoryId === selectedCategory).map(s => <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>) || []}
            </Select>
          </Form.Item>
          <Form.Item name="bankId" label="Banka" rules={[{ required: true }]}>
            <Select placeholder="Banka seçin">
              {banks?.map(b => <Select.Option key={b.id} value={b.id}>{b.name}</Select.Option>) || []}
            </Select>
          </Form.Item>
          <Form.Item name="rewardAmount" label="Ödül Miktarı">
            <Input />
          </Form.Item>
          <Form.Item name="rewardType" label="Ödül Tipi">
            <Input />
          </Form.Item>
          <Form.Item label="Görsel">
            <ImgCrop rotationSlider>
              <Upload
                listType="picture-card"
                fileList={imageFileList}
                onChange={({ fileList }) => setImageFileList(fileList)}
                beforeUpload={() => false}
                maxCount={1}
              >
                {imageFileList.length < 1 && <div><UploadOutlined /><div style={{ marginTop: 8 }}>Yükle</div></div>}
              </Upload>
            </ImgCrop>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Kaydet</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CampaignPage; 