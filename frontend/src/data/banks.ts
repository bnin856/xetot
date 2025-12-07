// Top 15 ngân hàng Việt Nam với lãi suất vay mua xe thực tế (2024)

export interface Bank {
  id: string;
  name: string;
  fullName: string;
  loanRate: number; // % năm
  maxLoanPercent: number; // % giá trị xe
  minTerm: number; // tháng
  maxTerm: number; // tháng
  rating: number; // 1-5 sao
  processingFee: number; // % phí hồ sơ
  earlyPaymentPenalty: number; // % phí trả nợ trước hạn
  advantages: string[];
  logo?: string;
  color: string; // Màu đặc trưng của ngân hàng
}

export const topBanks: Bank[] = [
  {
    id: 'vietcombank',
    name: 'Vietcombank',
    fullName: 'Ngân hàng TMCP Ngoại thương Việt Nam',
    loanRate: 8.5,
    maxLoanPercent: 80,
    minTerm: 12,
    maxTerm: 84,
    rating: 5,
    processingFee: 1.0,
    earlyPaymentPenalty: 2.0,
    advantages: ['Uy tín cao', 'Lãi suất ổn định', 'Thủ tục nhanh'],
    color: '#007DC3', // Xanh Vietcombank
  },
  {
    id: 'vietinbank',
    name: 'VietinBank',
    fullName: 'Ngân hàng TMCP Công thương Việt Nam',
    loanRate: 8.3,
    maxLoanPercent: 80,
    minTerm: 12,
    maxTerm: 96,
    rating: 5,
    processingFee: 1.0,
    earlyPaymentPenalty: 2.0,
    advantages: ['Lãi suất thấp', 'Hạn mức cao', 'Nhiều ưu đãi'],
    color: '#0F9E4D', // Xanh lá VietinBank
  },
  {
    id: 'bidv',
    name: 'BIDV',
    fullName: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam',
    loanRate: 8.4,
    maxLoanPercent: 80,
    minTerm: 12,
    maxTerm: 84,
    rating: 5,
    processingFee: 1.0,
    earlyPaymentPenalty: 2.5,
    advantages: ['Ngân hàng nhà nước', 'Đáng tin cậy', 'Chi nhánh rộng'],
    color: '#003087', // Xanh navy BIDV
  },
  {
    id: 'agribank',
    name: 'Agribank',
    fullName: 'Ngân hàng Nông nghiệp và Phát triển Nông thôn',
    loanRate: 8.6,
    maxLoanPercent: 75,
    minTerm: 12,
    maxTerm: 84,
    rating: 5,
    processingFee: 0.8,
    earlyPaymentPenalty: 2.0,
    advantages: ['Phí thấp', 'Thủ tục đơn giản', 'Hệ thống rộng'],
    color: '#006837', // Xanh lá đậm Agribank
  },
  {
    id: 'techcombank',
    name: 'Techcombank',
    fullName: 'Ngân hàng TMCP Kỹ thương Việt Nam',
    loanRate: 8.8,
    maxLoanPercent: 80,
    minTerm: 12,
    maxTerm: 96,
    rating: 5,
    processingFee: 1.2,
    earlyPaymentPenalty: 3.0,
    advantages: ['Digital banking', 'Duyệt nhanh online', 'App hiện đại'],
    color: '#00A551', // Xanh Techcombank
  },
  {
    id: 'acb',
    name: 'ACB',
    fullName: 'Ngân hàng TMCP Á Châu',
    loanRate: 8.7,
    maxLoanPercent: 80,
    minTerm: 12,
    maxTerm: 84,
    rating: 4.5,
    processingFee: 1.0,
    earlyPaymentPenalty: 2.5,
    advantages: ['Lãi suất cạnh tranh', 'Ưu đãi nhiều', 'Chăm sóc tốt'],
    color: '#009BDD', // Xanh dương ACB
  },
  {
    id: 'mbbank',
    name: 'MB Bank',
    fullName: 'Ngân hàng TMCP Quân đội',
    loanRate: 8.9,
    maxLoanPercent: 80,
    minTerm: 12,
    maxTerm: 84,
    rating: 4.5,
    processingFee: 1.0,
    earlyPaymentPenalty: 2.0,
    advantages: ['Thủ tục nhanh', 'App tốt', 'Hỗ trợ 24/7'],
    color: '#005BAA', // Xanh quân đội MB
  },
  {
    id: 'vpbank',
    name: 'VPBank',
    fullName: 'Ngân hàng TMCP Việt Nam Thịnh Vượng',
    loanRate: 9.0,
    maxLoanPercent: 85,
    minTerm: 12,
    maxTerm: 96,
    rating: 4.5,
    processingFee: 1.5,
    earlyPaymentPenalty: 3.0,
    advantages: ['Hạn mức cao', 'Duyệt dễ', 'Linh hoạt'],
    color: '#00A650', // Xanh VPBank
  },
  {
    id: 'sacombank',
    name: 'Sacombank',
    fullName: 'Ngân hàng TMCP Sài Gòn Thương Tín',
    loanRate: 8.8,
    maxLoanPercent: 80,
    minTerm: 12,
    maxTerm: 84,
    rating: 4.5,
    processingFee: 1.0,
    earlyPaymentPenalty: 2.5,
    advantages: ['Chi nhánh nhiều', 'Dịch vụ tốt', 'Ưu đãi hấp dẫn'],
    color: '#004A98', // Xanh Sacombank
  },
  {
    id: 'hdbank',
    name: 'HDBank',
    fullName: 'Ngân hàng TMCP Phát triển TP.HCM',
    loanRate: 9.2,
    maxLoanPercent: 80,
    minTerm: 12,
    maxTerm: 84,
    rating: 4,
    processingFee: 1.2,
    earlyPaymentPenalty: 2.5,
    advantages: ['Duyệt nhanh', 'Thủ tục gọn', 'Nhiều khuyến mãi'],
    color: '#F7941D', // Cam HDBank
  },
  {
    id: 'shb',
    name: 'SHB',
    fullName: 'Ngân hàng TMCP Sài Gòn - Hà Nội',
    loanRate: 9.1,
    maxLoanPercent: 80,
    minTerm: 12,
    maxTerm: 84,
    rating: 4,
    processingFee: 1.0,
    earlyPaymentPenalty: 2.0,
    advantages: ['Lãi suất hợp lý', 'Thủ tục đơn giản', 'Hỗ trợ tốt'],
    color: '#00529B', // Xanh SHB
  },
  {
    id: 'tpbank',
    name: 'TPBank',
    fullName: 'Ngân hàng TMCP Tiên Phong',
    loanRate: 9.3,
    maxLoanPercent: 80,
    minTerm: 12,
    maxTerm: 84,
    rating: 4,
    processingFee: 1.5,
    earlyPaymentPenalty: 3.0,
    advantages: ['Digital first', 'Duyệt online', 'App tiện lợi'],
    color: '#6B2C91', // Tím TPBank
  },
  {
    id: 'scb',
    name: 'SCB',
    fullName: 'Ngân hàng TMCP Sài Gòn',
    loanRate: 9.0,
    maxLoanPercent: 80,
    minTerm: 12,
    maxTerm: 84,
    rating: 4,
    processingFee: 1.0,
    earlyPaymentPenalty: 2.5,
    advantages: ['Lãi suất ổn định', 'Thủ tục nhanh', 'Chi phí hợp lý'],
    color: '#004B87', // Xanh SCB
  },
  {
    id: 'ocb',
    name: 'OCB',
    fullName: 'Ngân hàng TMCP Phương Đông',
    loanRate: 9.4,
    maxLoanPercent: 80,
    minTerm: 12,
    maxTerm: 84,
    rating: 4,
    processingFee: 1.2,
    earlyPaymentPenalty: 2.5,
    advantages: ['Duyệt linh hoạt', 'Dịch vụ tốt', 'Nhiều ưu đãi'],
    color: '#F37021', // Cam OCB
  },
  {
    id: 'seabank',
    name: 'SeABank',
    fullName: 'Ngân hàng TMCP Đông Nam Á',
    loanRate: 9.5,
    maxLoanPercent: 80,
    minTerm: 12,
    maxTerm: 84,
    rating: 4,
    processingFee: 1.5,
    earlyPaymentPenalty: 3.0,
    advantages: ['Thủ tục đơn giản', 'Hỗ trợ tận tâm', 'Duyệt dễ'],
    color: '#00A3E0', // Xanh biển SeABank
  },
];

// Hàm tính trả góp hàng tháng (PMT)
export const calculateMonthlyPayment = (
  principal: number,
  annualRate: number,
  months: number
): number => {
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return principal / months;
  
  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  
  return Math.round(payment);
};

// Hàm tính tổng lãi phải trả
export const calculateTotalInterest = (
  principal: number,
  annualRate: number,
  months: number
): number => {
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, months);
  return monthlyPayment * months - principal;
};

// Interface cho lịch trả nợ từng tháng
export interface PaymentSchedule {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

// Phương thức 1: Trả đều (Annuity) - Áp dụng lãi thả nổi
export const calculateAnnuitySchedule = (
  principal: number,
  annualRate: number,
  months: number
): PaymentSchedule[] => {
  const schedule: PaymentSchedule[] = [];
  let remainingBalance = principal;

  for (let month = 1; month <= months; month++) {
    // Lãi thả nổi: 2 năm đầu ưu đãi, sau đó tăng 2%
    const currentRate = month <= 24 ? annualRate : annualRate + 2.0;
    const monthlyRate = currentRate / 100 / 12;
    
    // Tính lại payment cho giai đoạn còn lại
    let monthlyPayment: number;
    if (month <= 24) {
      // Giai đoạn ưu đãi: tính dựa trên lãi gốc
      monthlyPayment = calculateMonthlyPayment(principal, annualRate, months);
    } else if (month === 25) {
      // Tháng 25: tính lại dựa trên số dư còn lại và lãi mới
      const remainingMonths = months - 24;
      monthlyPayment = calculateMonthlyPayment(remainingBalance, annualRate + 2.0, remainingMonths);
    } else {
      // Giữ nguyên payment từ tháng 25
      const remainingMonths = months - 24;
      monthlyPayment = calculateMonthlyPayment(
        schedule[24].remainingBalance, 
        annualRate + 2.0, 
        remainingMonths
      );
    }

    const interestPayment = remainingBalance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    remainingBalance -= principalPayment;

    schedule.push({
      month,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      remainingBalance: Math.max(0, remainingBalance),
    });
  }

  return schedule;
};

// Phương thức 2: Trả giảm dần (Declining Balance) - Áp dụng lãi thả nổi
export const calculateDecliningSchedule = (
  principal: number,
  annualRate: number,
  months: number
): PaymentSchedule[] => {
  const schedule: PaymentSchedule[] = [];
  const principalPayment = principal / months;
  let remainingBalance = principal;

  for (let month = 1; month <= months; month++) {
    // Lãi thả nổi: 2 năm đầu ưu đãi, sau đó tăng 2%
    const currentRate = month <= 24 ? annualRate : annualRate + 2.0;
    const monthlyRate = currentRate / 100 / 12;
    
    const interestPayment = remainingBalance * monthlyRate;
    const totalPayment = principalPayment + interestPayment;
    remainingBalance -= principalPayment;

    schedule.push({
      month,
      payment: totalPayment,
      principal: principalPayment,
      interest: interestPayment,
      remainingBalance: Math.max(0, remainingBalance),
    });
  }

  return schedule;
};

// Phương thức 3: Lãi thả nổi (Floating Rate) - Theo thực tế VN
// - Năm 1-2: Lãi ưu đãi cố định (thấp)
// - Năm 3+: Lãi thả nổi (tăng ~2%)
export const calculateFloatingSchedule = (
  principal: number,
  annualRate: number,
  months: number
): PaymentSchedule[] => {
  const schedule: PaymentSchedule[] = [];
  let remainingBalance = principal;
  
  // Lãi suất theo thực tế VN
  const getRateForMonth = (month: number): number => {
    // Năm 1-2 (tháng 1-24): Lãi ưu đãi cố định
    if (month <= 24) {
      return annualRate; // Lãi gốc
    }
    // Năm 3+ (tháng 25+): Lãi thả nổi, tăng 2%
    else {
      return annualRate + 2.0; // Tăng 2% so với lãi gốc
    }
  };

  const principalPayment = principal / months;

  for (let month = 1; month <= months; month++) {
    const currentRate = getRateForMonth(month);
    const monthlyRate = currentRate / 100 / 12;
    const interestPayment = remainingBalance * monthlyRate;
    const totalPayment = principalPayment + interestPayment;
    remainingBalance -= principalPayment;

    schedule.push({
      month,
      payment: totalPayment,
      principal: principalPayment,
      interest: interestPayment,
      remainingBalance: Math.max(0, remainingBalance),
    });
  }

  return schedule;
};

