import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { ShopOutlined, BankOutlined, GiftOutlined, LogoutOutlined, AppstoreOutlined } from '@ant-design/icons';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const items = [
  { key: 'stores', icon: <ShopOutlined />, label: <Link to="/stores">Mağazalar</Link> },
  { key: 'banks', icon: <BankOutlined />, label: <Link to="/banks">Bankalar</Link> },
  { key: 'categories', icon: <AppstoreOutlined />, label: <Link to="/categories">Kategoriler</Link> },
  { key: 'campaigns', icon: <GiftOutlined />, label: <Link to="/campaigns">Kampanyalar</Link> },
];

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedKey = items.find(item => location.pathname.startsWith(`/${item.key}`))?.key || 'stores';

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div style={{ height: 32, margin: 16, color: '#fff', fontWeight: 700, fontSize: 20, textAlign: 'center' }}>Kampanya Admin</div>
        <Menu theme="dark" mode="inline" selectedKeys={[selectedKey]} items={items} />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button icon={<LogoutOutlined />} type="text" onClick={handleLogout} style={{ marginRight: 24 }}>
            Çıkış
          </Button>
        </Header>
        <Content style={{ margin: '24px 16px 0', minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout; 
 
 
 
 