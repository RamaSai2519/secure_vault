import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';

export const encrypt = (text: string): string => {
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
};

export const decrypt = (ciphertext: string): string => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
};

export const generatePassword = (options: {
    length: number;
    includeNumbers: boolean;
    includeLetters: boolean;
    includeSymbols: boolean;
    excludeLookAlikes: boolean;
}): string => {
    let charset = '';

    if (options.includeLetters) {
        charset += 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }

    if (options.includeNumbers) {
        charset += '0123456789';
    }

    if (options.includeSymbols) {
        charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    }

    if (options.excludeLookAlikes) {
        charset = charset.replace(/[0O1lI]/g, '');
    }

    let password = '';
    for (let i = 0; i < options.length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    return password;
};