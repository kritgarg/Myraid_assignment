const CryptoJS = require('crypto-js');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '12345678901234567890123456789012';

exports.encryptData = (data) => {
  if (!data) return data;
  return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
};

exports.decryptData = (ciphertext) => {
  if (!ciphertext) return ciphertext;
  const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
