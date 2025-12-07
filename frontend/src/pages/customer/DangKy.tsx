import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import MainLayout from '../../components/Layout/MainLayout';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Check, X } from 'lucide-react';

const DangKy: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ten: '',
    email: '',
    password: '',
    confirmPassword: '',
    sdt: '',
    diaChi: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password strength checker
  const passwordStrength = useMemo(() => {
    const password = formData.password;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    
    const passedChecks = Object.values(checks).filter(Boolean).length;
    let strength = 'weak';
    let color = 'bg-red-500';
    let percentage = (passedChecks / 5) * 100;
    
    if (passedChecks >= 5) {
      strength = 'strong';
      color = 'bg-green-500';
    } else if (passedChecks >= 3) {
      strength = 'medium';
      color = 'bg-yellow-500';
    }
    
    return { checks, strength, color, percentage };
  }, [formData.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.ten.trim()) newErrors.ten = 'Vui lòng nhập tên';
    if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else {
      if (formData.password.length < 8) {
        newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
      } else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = 'Mật khẩu phải có ít nhất 1 chữ hoa';
      } else if (!/[a-z]/.test(formData.password)) {
        newErrors.password = 'Mật khẩu phải có ít nhất 1 chữ thường';
      } else if (!/[0-9]/.test(formData.password)) {
        newErrors.password = 'Mật khẩu phải có ít nhất 1 số';
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
        newErrors.password = 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt';
      }
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    if (!formData.sdt.trim()) newErrors.sdt = 'Vui lòng nhập số điện thoại';
    if (!/^[0-9]{10}$/.test(formData.sdt.replace(/\s/g, ''))) {
      newErrors.sdt = 'Số điện thoại phải có 10 chữ số';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await register(formData);
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="card p-8">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
              Đăng ký tài khoản
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="ten"
                  value={formData.ten}
                  onChange={handleChange}
                  className={`input-field ${errors.ten ? 'border-red-500' : ''}`}
                  placeholder="Nhập họ và tên"
                />
                {errors.ten && <p className="text-red-500 text-sm mt-1">{errors.ten}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="Nhập email"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="sdt"
                  value={formData.sdt}
                  onChange={handleChange}
                  className={`input-field ${errors.sdt ? 'border-red-500' : ''}`}
                  placeholder="Nhập số điện thoại"
                />
                {errors.sdt && <p className="text-red-500 text-sm mt-1">{errors.sdt}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`input-field pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Nhập mật khẩu"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Password strength indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600">Độ mạnh mật khẩu:</span>
                      <span className={`font-medium ${
                        passwordStrength.strength === 'strong' ? 'text-green-600' :
                        passwordStrength.strength === 'medium' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {passwordStrength.strength === 'strong' ? 'Mạnh' :
                         passwordStrength.strength === 'medium' ? 'Trung bình' :
                         'Yếu'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.percentage}%` }}
                      />
                    </div>
                    
                    {/* Password requirements */}
                    <div className="mt-3 space-y-1">
                      <div className={`flex items-center text-xs ${passwordStrength.checks.length ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordStrength.checks.length ? <Check className="w-4 h-4 mr-1" /> : <X className="w-4 h-4 mr-1" />}
                        <span>Ít nhất 8 ký tự</span>
                      </div>
                      <div className={`flex items-center text-xs ${passwordStrength.checks.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordStrength.checks.uppercase ? <Check className="w-4 h-4 mr-1" /> : <X className="w-4 h-4 mr-1" />}
                        <span>Có chữ hoa (A-Z)</span>
                      </div>
                      <div className={`flex items-center text-xs ${passwordStrength.checks.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordStrength.checks.lowercase ? <Check className="w-4 h-4 mr-1" /> : <X className="w-4 h-4 mr-1" />}
                        <span>Có chữ thường (a-z)</span>
                      </div>
                      <div className={`flex items-center text-xs ${passwordStrength.checks.number ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordStrength.checks.number ? <Check className="w-4 h-4 mr-1" /> : <X className="w-4 h-4 mr-1" />}
                        <span>Có số (0-9)</span>
                      </div>
                      <div className={`flex items-center text-xs ${passwordStrength.checks.special ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordStrength.checks.special ? <Check className="w-4 h-4 mr-1" /> : <X className="w-4 h-4 mr-1" />}
                        <span>Có ký tự đặc biệt (!@#$%...)</span>
                      </div>
                    </div>
                  </div>
                )}
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`input-field pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    placeholder="Nhập lại mật khẩu"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ (tùy chọn)
                </label>
                <input
                  type="text"
                  name="diaChi"
                  value={formData.diaChi}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Nhập địa chỉ"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary mt-6"
              >
                Đăng ký
              </button>
            </form>

            <p className="text-center mt-6 text-gray-600">
              Đã có tài khoản?{' '}
              <Link to="/dang-nhap" className="text-primary-600 hover:text-primary-700 font-medium">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default DangKy;

