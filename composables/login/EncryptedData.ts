import CryptoJS from 'crypto-js';

export function encryptData([username, password]: [string, string]): string | null {
  const ivKey = CryptoJS.lib.WordArray.random(16); // Genera un IV aleatorio (16 bytes)
  const keyValue = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

  if (username && password) {  
    const data = { username, password };
    const dataString = JSON.stringify(data);

    // Deriva la clave con PBKDF2
    const key = CryptoJS.PBKDF2(keyValue, 'salt', { keySize: 256 / 32, iterations: 100 });

    // Cifra los datos usando AES en modo CBC
    const encrypted = CryptoJS.AES.encrypt(dataString, key, { iv: ivKey, mode: CryptoJS.mode.CBC });

    // Convierte el IV y el texto cifrado a hexadecimal
    const ivHex = ivKey.toString(CryptoJS.enc.Hex);
    const encryptedHex = encrypted.ciphertext.toString(CryptoJS.enc.Hex);

    // Retorna el IV concatenado con el texto cifrado (ambos en hexadecimal)
    return ivHex + encryptedHex;
  }

  return null;
}