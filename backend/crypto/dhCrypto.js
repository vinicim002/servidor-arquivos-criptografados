const crypto = require('crypto');

// Função para a troca de chaves Diffie-Hellman
function generateDHKeys() {
  const dh = crypto.createDiffieHellman(2048); // Tamanho da chave em bits
  dh.generateKeys(); // Gera a chave pública e privada
  const publicKey = dh.getPublicKey().toString('base64');
  const privateKey = dh.getPrivateKey().toString('base64');
  return { publicKey, privateKey, dh };
}

// Função para calcular a chave compartilhada com a chave pública do outro lado
function computeSharedSecret(privateKey, publicKey) {
  const dh = crypto.createDiffieHellman(privateKey); // Usando a chave privada do lado
  const secret = dh.computeSecret(Buffer.from(publicKey, 'base64')).toString('base64');
  return secret;
}

module.exports = { generateDHKeys, computeSharedSecret };
