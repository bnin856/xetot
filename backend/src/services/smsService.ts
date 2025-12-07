// SMS Service - Giả lập gửi SMS
// Trong production, tích hợp với Twilio, AWS SNS, hoặc nhà cung cấp SMS Việt Nam

export const sendPasswordResetSMS = async (
  phoneNumber: string,
  code: string,
  userName: string
): Promise<void> => {
  // Giả lập gửi SMS
  // Trong thực tế, sử dụng API của nhà cung cấp SMS
  
  const message = `Xe Tot: Ma xac thuc dat lai mat khau cua ban la ${code}. Ma co hieu luc trong 15 phut. Khong chia se ma nay voi bat ky ai.`;
  
  console.log('📱 SMS Mock Service');
  console.log(`To: ${phoneNumber}`);
  console.log(`Message: ${message}`);
  console.log('---');
  
  // Trong production, thay thế bằng code thực:
  /*
  // Ví dụ với Twilio:
  const twilio = require('twilio');
  const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
  
  await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber
  });
  
  // Hoặc với ESMS.vn (nhà cung cấp SMS Việt Nam):
  const axios = require('axios');
  await axios.post('http://rest.esms.vn/MainService.svc/json/SendMultipleMessage_V4_post_json/', {
    ApiKey: process.env.ESMS_API_KEY,
    SecretKey: process.env.ESMS_SECRET_KEY,
    Phone: phoneNumber,
    Content: message,
    SmsType: 2,
    Brandname: 'XeTot'
  });
  */
  
  // Giả lập delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log(`✅ SMS sent to ${phoneNumber} (Mock)`);
};

// Hàm format số điện thoại Việt Nam
export const formatPhoneNumber = (phone: string): string => {
  // Loại bỏ khoảng trắng và ký tự đặc biệt
  let cleaned = phone.replace(/\D/g, '');
  
  // Nếu bắt đầu bằng 0, chuyển thành +84
  if (cleaned.startsWith('0')) {
    cleaned = '84' + cleaned.substring(1);
  }
  
  // Thêm + vào đầu
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }
  
  return cleaned;
};

