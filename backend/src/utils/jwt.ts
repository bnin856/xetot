import jwt from 'jsonwebtoken';

export const generateToken = (id: string, vaiTro: 'admin' | 'customer'): string => {
  const secret = process.env.JWT_SECRET || 'secret';
  const expiresIn = process.env.JWT_EXPIRE || '7d';
  
  return jwt.sign(
    { id, vaiTro },
    secret,
    {
      expiresIn: expiresIn,
    } as jwt.SignOptions
  );
};

export const verifyToken = (token: string): { id: string; vaiTro: 'admin' | 'customer' } => {
  const secret = process.env.JWT_SECRET || 'secret';
  return jwt.verify(
    token,
    secret
  ) as { id: string; vaiTro: 'admin' | 'customer' };
};

