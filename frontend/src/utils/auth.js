import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || '12345678901234567890123456789012';

export const encryptData = (data) => {
  if (!data) return data;
  return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
};
