import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, Card } from 'antd';
import axios from 'axios';

const { Title } = Typography;

const LoginPage: React.FC<{ setToken: (token: string) => void }> = ({ setToken }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        username: values.username,
        password: values.password,
      });
      const token = response.data.token;
      localStorage.setItem('token', token);
      setToken(token);
      message.success('Giriş başarılı!');
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            message.error(error.response.data.message || 'Giriş sırasında bir hata oluştu.');
        } else {
            message.error('Giriş sırasında bir hata oluştu.');
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
        <Card title={<Title level={3} style={{ textAlign: 'center' }}>Admin Girişi</Title>} style={{ width: 400 }}>
            <Form name="login" onFinish={onFinish} layout="vertical">
                <Form.Item
                    label="Kullanıcı Adı"
                    name="username"
                    rules={[{ required: true, message: 'Lütfen kullanıcı adınızı girin!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Şifre"
                    name="password"
                    rules={[{ required: true, message: 'Lütfen şifrenizi girin!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                    Giriş
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    </div>
  );
};

export default LoginPage; 