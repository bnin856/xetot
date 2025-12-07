import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayoutSimple: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{
        width: '256px',
        backgroundColor: 'white',
        borderRight: '1px solid #e5e7eb',
        padding: '16px',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', color: '#2563eb' }}>
          Xe Tốt Admin
        </h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link 
            to="/admin"
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: location.pathname === '/admin' ? '#2563eb' : '#374151',
              backgroundColor: location.pathname === '/admin' ? '#dbeafe' : 'transparent',
              fontWeight: location.pathname === '/admin' ? '600' : '400'
            }}
          >
            Tổng quan
          </Link>
          <Link 
            to="/admin/xac-thuc"
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: location.pathname.startsWith('/admin/xac-thuc') ? '#2563eb' : '#374151',
              backgroundColor: location.pathname.startsWith('/admin/xac-thuc') ? '#dbeafe' : 'transparent',
              fontWeight: location.pathname.startsWith('/admin/xac-thuc') ? '600' : '400'
            }}
          >
            Quản lý KYC
          </Link>
          <Link 
            to="/admin/tranh-chap"
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: location.pathname.startsWith('/admin/tranh-chap') ? '#2563eb' : '#374151',
              backgroundColor: location.pathname.startsWith('/admin/tranh-chap') ? '#dbeafe' : 'transparent',
              fontWeight: location.pathname.startsWith('/admin/tranh-chap') ? '600' : '400'
            }}
          >
            Quản lý khiếu nại
          </Link>
          <Link 
            to="/admin/xe"
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: location.pathname.startsWith('/admin/xe') ? '#2563eb' : '#374151',
              backgroundColor: location.pathname.startsWith('/admin/xe') ? '#dbeafe' : 'transparent',
              fontWeight: location.pathname.startsWith('/admin/xe') ? '600' : '400'
            }}
          >
            Quản lý xe
          </Link>
          <Link 
            to="/admin/don-hang"
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: location.pathname.startsWith('/admin/don-hang') ? '#2563eb' : '#374151',
              backgroundColor: location.pathname.startsWith('/admin/don-hang') ? '#dbeafe' : 'transparent',
              fontWeight: location.pathname.startsWith('/admin/don-hang') ? '600' : '400'
            }}
          >
            Quản lý đơn hàng
          </Link>
          <Link 
            to="/admin/khach-hang"
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: location.pathname.startsWith('/admin/khach-hang') ? '#2563eb' : '#374151',
              backgroundColor: location.pathname.startsWith('/admin/khach-hang') ? '#dbeafe' : 'transparent',
              fontWeight: location.pathname.startsWith('/admin/khach-hang') ? '600' : '400'
            }}
          >
            Quản lý khách hàng
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div style={{ marginLeft: '256px', flex: 1, padding: '24px' }}>
        {children}
      </div>
    </div>
  );
};

export default AdminLayoutSimple;

