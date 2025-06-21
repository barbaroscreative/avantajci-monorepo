import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, message, Card } from 'antd';
import axios from 'axios';

const { Title } = Typography;

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', values);
      localStorage.setItem('token', res.data.token);
      message.success('Giriş başarılı!');
      window.location.href = '/';
    } catch (err) {
      message.error('Kullanıcı adı veya şifre hatalı!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
      <Card style={{ minWidth: 350, boxShadow: '0 2px 8px #f0f1f2' }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>Admin Girişi</Title>
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item name="username" label="Kullanıcı Adı" rules={[{ required: true, message: 'Kullanıcı adı girin!' }]}>
                    <Input autoFocus />
                </Form.Item>
                <Form.Item name="password" label="Şifre" rules={[{ required: true, message: 'Şifre girin!' }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                    Giriş Yap
                    </Button>
                </Form.Item>
            </Form>
      </Card>
    </div>
  );
};

export default LoginPage; 