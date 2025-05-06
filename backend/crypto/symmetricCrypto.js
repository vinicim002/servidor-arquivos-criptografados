const crypto = require('crypto');

// Definir os algoritmos de criptografia
const ALGORITHM_AES = 'aes-256-cbc'; // AES
const ALGORITHM_DES = 'des-ede3-cbc'; // DES (Triple DES)
const ALGORITHM_RC4 = 'rc4'; // RC4

// Função de criptografia AES
function encryptFileAES(fileContent) {
  const key = crypto.randomBytes(32);  // Gerando chave de 256 bits
  const iv = crypto.randomBytes(16);  // Vetor de Inicialização de 128 bits

  const cipher = crypto.createCipheriv(ALGORITHM_AES, key, iv);
  let encrypted = cipher.update(fileContent);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return { encrypted, key, iv };  // Retorna o arquivo criptografado junto com chave e IV
}

// Função de descriptografia AES
function decryptFileAES(fileContent, key, iv) {
  const decipher = crypto.createDecipheriv(ALGORITHM_AES, key, iv);
  let decrypted = decipher.update(fileContent);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted;
}

// Função de criptografia DES (Triple DES)
function encryptFileDES(fileContent) {
  const key = crypto.randomBytes(24);  // Gerando chave de 192 bits (Triple DES)
  const iv = crypto.randomBytes(8);    // Vetor de Inicialização de 64 bits

  const cipher = crypto.createCipheriv(ALGORITHM_DES, key, iv);
  let encrypted = cipher.update(fileContent);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return { encrypted, key, iv };  // Retorna o arquivo criptografado junto com chave e IV
}

// Função de descriptografia DES
function decryptFileDES(fileContent, key, iv) {
  const decipher = crypto.createDecipheriv(ALGORITHM_DES, key, iv);
  let decrypted = decipher.update(fileContent);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted;
}

// Função de criptografia RC4
function encryptFileRC4(fileContent) {
  const key = crypto.randomBytes(16);  // Gerando chave de 128 bits
  const cipher = crypto.createCipheriv(ALGORITHM_RC4, key, null); // RC4 não usa IV

  let encrypted = cipher.update(fileContent);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return { encrypted, key };  // Retorna o arquivo criptografado junto com chave
}

// Função de descriptografia RC4
function decryptFileRC4(fileContent, key) {
  const decipher = crypto.createDecipheriv(ALGORITHM_RC4, key, null);  // RC4 não usa IV
  let decrypted = decipher.update(fileContent);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted;
}

module.exports = { encryptFileAES, decryptFileAES, encryptFileDES, decryptFileDES, encryptFileRC4, decryptFileRC4 };
