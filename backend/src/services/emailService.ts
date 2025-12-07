import nodemailer from 'nodemailer';

// Create transporter (sử dụng Gmail hoặc SMTP khác)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password',
  },
});

export const sendPasswordResetEmail = async (
  email: string,
  code: string,
  userName: string
): Promise<void> => {
  const mailOptions = {
    from: `"Xe Tốt" <${process.env.EMAIL_USER || 'noreply@xetot.com'}>`,
    to: email,
    subject: 'Đặt lại mật khẩu - Xe Tốt',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #0f172a;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #0f172a;
              margin: 0;
              font-size: 28px;
            }
            .code-box {
              background: #f8fafc;
              border: 2px dashed #0f172a;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              margin: 30px 0;
            }
            .code {
              font-size: 32px;
              font-weight: bold;
              color: #0f172a;
              letter-spacing: 8px;
              font-family: 'Courier New', monospace;
            }
            .warning {
              background: #fef2f2;
              border-left: 4px solid #ef4444;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              color: #6b7280;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚗 Xe Tốt</h1>
            </div>
            
            <p>Xin chào <strong>${userName}</strong>,</p>
            
            <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
            
            <p>Sử dụng mã xác thực sau để đặt lại mật khẩu:</p>
            
            <div class="code-box">
              <div class="code">${code}</div>
              <p style="margin: 10px 0 0 0; color: #6b7280;">Mã có hiệu lực trong 15 phút</p>
            </div>
            
            <div class="warning">
              <strong>⚠️ Lưu ý bảo mật:</strong>
              <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                <li>Không chia sẻ mã này với bất kỳ ai</li>
                <li>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này</li>
                <li>Mã sẽ hết hạn sau 15 phút</li>
              </ul>
            </div>
            
            <p>Trân trọng,<br><strong>Đội ngũ Xe Tốt</strong></p>
            
            <div class="footer">
              <p>© 2025 Xe Tốt. All rights reserved.</p>
              <p>Email này được gửi tự động, vui lòng không trả lời.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}`);
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw new Error('Không thể gửi email. Vui lòng thử lại sau.');
  }
};

