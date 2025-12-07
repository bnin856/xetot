import React from 'react';
import AdminLayoutSimple from '../../components/Layout/AdminLayoutSimple';

const TongQuan: React.FC = () => {
  console.log('TongQuan component rendering...');
  
  return (
    <AdminLayoutSimple>
      <div style={{ padding: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px' }}>
          Trang quản trị hệ thống
        </h1>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '16px',
          marginBottom: '32px'
        }}>
          <a 
            href="/admin/xac-thuc" 
            style={{
              padding: '24px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              textDecoration: 'none',
              color: 'inherit',
              display: 'block'
            }}
          >
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>
              Quản lý xác thực KYC
            </h3>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              Duyệt và quản lý các yêu cầu xác thực tài khoản
            </p>
          </a>

          <a 
            href="/admin/tranh-chap" 
            style={{
              padding: '24px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              textDecoration: 'none',
              color: 'inherit',
              display: 'block'
            }}
          >
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>
              Quản lý khiếu nại
            </h3>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              Xử lý các tranh chấp và khiếu nại từ khách hàng
            </p>
          </a>

          <a 
            href="/admin/xe" 
            style={{
              padding: '24px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              textDecoration: 'none',
              color: 'inherit',
              display: 'block'
            }}
          >
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>
              Quản lý xe
            </h3>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              Quản lý danh sách xe bán và cho thuê
            </p>
          </a>

          <a 
            href="/admin/don-hang" 
            style={{
              padding: '24px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              textDecoration: 'none',
              color: 'inherit',
              display: 'block'
            }}
          >
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>
              Quản lý đơn hàng
            </h3>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              Quản lý tất cả đơn hàng mua và thuê xe
            </p>
          </a>
        </div>

        <div style={{ 
          padding: '24px',
          backgroundColor: '#f0f9ff',
          borderRadius: '8px',
          border: '1px solid #bae6fd'
        }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: '600' }}>
            Chức năng quản lý
          </h2>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#666' }}>
            <li style={{ marginBottom: '8px' }}>
              <strong>Quản lý KYC:</strong> Duyệt/từ chối yêu cầu xác thực tài khoản
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Quản lý khiếu nại:</strong> Xử lý tranh chấp và khiếu nại
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Quản lý xe:</strong> Xem, chỉnh sửa, xóa các tin đăng xe
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Quản lý đơn hàng:</strong> Theo dõi và xử lý đơn hàng
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Quản lý khách hàng:</strong> Xem thông tin và quản lý người dùng
            </li>
          </ul>
        </div>
      </div>
    </AdminLayoutSimple>
  );
};

export default TongQuan;
