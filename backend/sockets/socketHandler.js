const { registrarArquivo } = require("../utils/fileUtils");
const {
  encryptFileAES,
  encryptFileDES,
  encryptFileRC4,
  decryptFileAES,
  decryptFileDES,
  decryptFileRC4,
} = require("../crypto/symmetricCrypto");
const { generateDHKeys, computeSharedSecret } = require("../crypto/dhCrypto");
const fs = require("fs");
const path = require("path");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    // Geração de chaves Diffie-Hellman
    socket.on("generateDHKeys", () => {
      try {
        const { publicKey, privateKey } = generateDHKeys();
        socket.emit("sendPublicKey", { publicKey, privateKey });
      } catch (err) {
        console.error("Erro ao gerar chaves DH:", err);
        socket.emit("error", { message: "Erro ao gerar chaves DH" });
      }
    });

    // Cálculo de chave compartilhada
    socket.on("computeSharedSecret", (data) => {
      try {
        const sharedSecret = computeSharedSecret(
          data.privateKey,
          data.publicKey
        );
        socket.emit("sharedSecretComputed", { sharedSecret });
      } catch (err) {
        console.error("Erro ao calcular chave compartilhada:", err);
        socket.emit("error", {
          message: "Erro ao calcular chave compartilhada",
        });
      }
    });

    // Criptografia de arquivo
    socket.on("encrypt", async (data) => {
      try {
        const fileBuffer = Buffer.from(data.fileContent); // conteúdo original
        let encryptedData;

        switch (data.algorithm) {
          case "aes":
            encryptedData = encryptFileAES(fileBuffer);
            break;
          case "des":
            encryptedData = encryptFileDES(fileBuffer);
            break;
          case "rc4":
            encryptedData = encryptFileRC4(fileBuffer);
            break;
          default:
            return socket.emit("error", { message: "Algoritmo não suportado" });
        }

        // Nome do arquivo criptografado
        const encryptedFileName = `encrypted_${Date.now()}_${data.fileName}`;
        const filePath = path.join(__dirname, "../uploads", encryptedFileName);
        fs.writeFileSync(filePath, encryptedData.encrypted);

        // Registro da metadata no files.json
        registrarArquivo({
          nome: encryptedFileName,
          tipo: data.fileType || "desconhecido",
          tamanho: data.fileContent.length,
          usuario: data.usuario || "anônimo",
        });

        // Retorno ao cliente
        socket.emit("fileEncrypted", {
          encryptedFile: encryptedData.encrypted.toString("base64"),
          key: encryptedData.key.toString("base64"),
          iv: encryptedData.iv ? encryptedData.iv.toString("base64") : null,
        });
      } catch (err) {
        console.error("Erro na criptografia:", err);
        socket.emit("error", { message: "Erro ao criptografar arquivo" });
      }
    });

    // Descriptografia de arquivo
    socket.on("decryptFile", (data) => {
      try {
        const fileBuffer = Buffer.from(new Uint8Array(data.fileContent));
        const keyBuffer = Buffer.from(data.key, "base64");
        const ivBuffer = data.iv ? Buffer.from(data.iv, "base64") : null;

        let decrypted;

        switch (data.algorithm) {
          case "aes":
            decrypted = decryptFileAES(fileBuffer, keyBuffer, ivBuffer);
            break;
          case "des":
            decrypted = decryptFileDES(fileBuffer, keyBuffer, ivBuffer);
            break;
          case "rc4":
            decrypted = decryptFileRC4(fileBuffer, keyBuffer);
            break;
          default:
            return socket.emit("error", { message: "Algoritmo não suportado" });
        }

        socket.emit("fileDecrypted", { decryptedFile: decrypted });
      } catch (err) {
        console.error("Erro na descriptografia:", err);
        socket.emit("error", { message: "Erro ao descriptografar arquivo" });
      }
    });

    // Listar arquivos com metadados do files.json
    socket.on("getFileList", () => {
      try {
        const fileDBPath = path.join(__dirname, "../db/files.json");
        if (!fs.existsSync(fileDBPath)) return socket.emit("fileList", []);

        const conteudo = fs.readFileSync(fileDBPath, "utf8");
        const arquivos = JSON.parse(conteudo || "[]");

        socket.emit("fileList", arquivos); // Envia todos os metadados
      } catch (err) {
        console.error("Erro ao listar arquivos:", err);
        socket.emit("error", { message: "Erro ao listar arquivos" });
      }
    });
  });
};
