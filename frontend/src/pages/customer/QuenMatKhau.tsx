import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone, ArrowLeft, Lock, Shield } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

type Step = 'method' | 'verify' | 'reset' | 'success';

const QuenMatKhau: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('method');
  const [method, setMethod] = useState<'email' | 'sms'>('email');
  const [identifier, setIdentifier] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sentTo, setSentTo] = useState('');

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/password-reset/request', {
        identifier,
        method,
      });

      if (response.data.success) {
        setSentTo(response.data.data.sentTo);
        setStep('verify');
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/password-reset/verify', {
        identifier,
        code,
        method,
      });

      if (response.data.success) {
        setStep('reset');
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Mã xác thực không đúng');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/password-reset/reset', {
        identifier,
        code,
        newPassword,
      });

      if (response.data.success) {
        setStep('success');
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
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
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-primary-600" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
              Quên mật khẩu
            </h2>
            <p className="text-center text-gray-600 mb-8">
              {step === 'method' && 'Chọn phương thức xác thực'}
              {step === 'verify' && 'Nhập mã xác thực'}
              {step === 'reset' && 'Đặt mật khẩu mới'}
              {step === 'success' && 'Hoàn tất'}
            </p>

            <AnimatePresence mode="wait">
              {/* Step 1: Choose method */}
              {step === 'method' && (
                <motion.div
                  key="method"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <form onSubmit={handleRequestReset} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Chọn phương thức xác thực
                      </label>
                      <div className="space-y-3">
                        <label
                          className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            method === 'email'
                              ? 'border-primary-600 bg-primary-50'
                              : 'border-gray-200 hover:border-primary-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="method"
                            value="email"
                            checked={method === 'email'}
                            onChange={(e) => setMethod(e.target.value as 'email')}
                            className="mr-3"
                          />
                          <Mail className="w-5 h-5 text-primary-600 mr-2" />
                          <span className="font-medium">Xác thực qua Email</span>
                        </label>

                        <label
                          className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            method === 'sms'
                              ? 'border-primary-600 bg-primary-50'
                              : 'border-gray-200 hover:border-primary-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="method"
                            value="sms"
                            checked={method === 'sms'}
                            onChange={(e) => setMethod(e.target.value as 'sms')}
                            className="mr-3"
                          />
                          <Phone className="w-5 h-5 text-primary-600 mr-2" />
                          <span className="font-medium">Xác thực qua SMS</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {method === 'email' ? 'Email đăng ký' : 'Số điện thoại đăng ký'}
                      </label>
                      <input
                        type={method === 'email' ? 'email' : 'tel'}
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="input-field"
                        placeholder={method === 'email' ? 'Nhập email' : 'Nhập số điện thoại'}
                        required
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-primary disabled:opacity-50"
                    >
                      {loading ? 'Đang gửi...' : 'Gửi mã xác thực'}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Step 2: Verify code */}
              {step === 'verify' && (
                <motion.div
                  key="verify"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="bg-primary-50 p-4 rounded-lg mb-6">
                    <div className="flex items-center text-primary-800">
                      <Shield className="w-5 h-5 mr-2" />
                      <p className="text-sm">
                        Mã xác thực đã được gửi đến <strong>{sentTo}</strong>
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleVerifyCode} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mã xác thực (6 số)
                      </label>
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="input-field text-center text-2xl tracking-widest font-mono"
                        placeholder="000000"
                        maxLength={6}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Mã có hiệu lực trong 15 phút
                      </p>
                    </div>

                    {error && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || code.length !== 6}
                      className="w-full btn-primary disabled:opacity-50"
                    >
                      {loading ? 'Đang xác thực...' : 'Xác thực'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep('method')}
                      className="w-full btn-secondary"
                    >
                      Gửi lại mã
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Step 3: Reset password */}
              {step === 'reset' && (
                <motion.div
                  key="reset"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <form onSubmit={handleResetPassword} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mật khẩu mới
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="input-field"
                        placeholder="Nhập mật khẩu mới"
                        required
                      />
                      <div className="mt-2 text-xs text-gray-600 space-y-1">
                        <p>✓ Ít nhất 8 ký tự</p>
                        <p>✓ Có chữ hoa và chữ thường</p>
                        <p>✓ Có số và ký tự đặc biệt</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Xác nhận mật khẩu mới
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="input-field"
                        placeholder="Nhập lại mật khẩu mới"
                        required
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-primary disabled:opacity-50"
                    >
                      {loading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Step 4: Success */}
              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Đặt lại mật khẩu thành công!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Bạn có thể đăng nhập với mật khẩu mới
                  </p>
                  <button
                    onClick={() => navigate('/dang-nhap')}
                    className="btn-primary"
                  >
                    Đăng nhập ngay
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {step !== 'success' && (
              <div className="mt-6 text-center">
                <Link
                  to="/dang-nhap"
                  className="flex items-center justify-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Quay lại đăng nhập
                </Link>
              </div>
            )}
          </div>

          {/* Security Notice */}
          {step === 'method' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 bg-white rounded-lg p-4 text-sm text-gray-600"
            >
              <div className="flex items-start space-x-2">
                <Shield className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-800 mb-1">Bảo mật thông tin</p>
                  <p>
                    Mã xác thực có hiệu lực trong 15 phút. Không chia sẻ mã này với bất kỳ ai.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default QuenMatKhau;

