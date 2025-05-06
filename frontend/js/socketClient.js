const socket = io();

// Formulário de criptografia
const cryptForm = document.getElementById("cryptForm");
cryptForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const fileInput = document.getElementById("fileInput");
  const algorithmSelect = document.getElementById("algorithmSelect");
  const file = fileInput.files[0];
  const algorithm = algorithmSelect.value;

  if (!file) {
    alert("Por favor, selecione um arquivo para criptografar.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const fileContent = new Uint8Array(event.target.result);

    // Simulação do usuário autenticado (pode ser substituído por email real)
    const usuario = localStorage.getItem("email") || "anônimo";

    socket.emit("encrypt", {
      fileContent,
      algorithm,
      fileName: file.name,
      fileType: file.type || "desconhecido",
      usuario,
    });
  };
  reader.readAsArrayBuffer(file);
});

// Receber o arquivo criptografado do servidor
socket.on("fileEncrypted", (data) => {
  console.log("Arquivo criptografado recebido do servidor:", data);

  const { encryptedFile, key, iv } = data;

  // Corrigido: decodificar corretamente base64 para Uint8Array
  const binary = atob(encryptedFile);
  const buffer = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    buffer[i] = binary.charCodeAt(i);
  }

  const blob = new Blob([buffer], { type: "application/octet-stream" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "arquivo_criptografado.enc";
  link.click();

  document.getElementById("keyInput").value = key;
  document.getElementById("ivInput").value = iv || "";
});

// Formulário de descriptografia
const decryptForm = document.getElementById("decryptForm");
decryptForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const decryptFileInput = document.getElementById("decryptFileInput");
  const decryptAlgorithmSelect = document.getElementById(
    "decryptAlgorithmSelect"
  );
  const keyInput = document.getElementById("keyInput");
  const ivInput = document.getElementById("ivInput");

  const file = decryptFileInput.files[0];
  const algorithm = decryptAlgorithmSelect.value;
  const key = keyInput.value;
  const iv = ivInput.value;

  if (!file || !key || (algorithm !== "rc4" && !iv)) {
    alert("Por favor, forneça o arquivo, chave e IV (exceto para RC4).");
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    const fileContent = new Uint8Array(reader.result);

    socket.emit("decryptFile", {
      fileContent,
      algorithm,
      key,
      iv,
    });
  };
  reader.readAsArrayBuffer(file);
});

// Receber o arquivo descriptografado do servidor
socket.on("fileDecrypted", (data) => {
  console.log("Arquivo descriptografado recebido do servidor:", data);

  const { decryptedFile } = data;

  const blob = new Blob([new Uint8Array(decryptedFile)], {
    type: "application/octet-stream",
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "arquivo_descriptografado";
  link.click();
});

// Receber lista de arquivos do backend
socket.on("fileList", (files) => {
  const fileListElement = document.getElementById("fileList");
  fileListElement.innerHTML = "";

  files.forEach((file) => {
    const li = document.createElement("li");
    li.classList.add("file-item"); // Adiciona a classe file-item

    const data = new Date(file.dataUpload).toLocaleString();

    li.innerHTML = `
      <div><strong>Nome:</strong> <span>${file.nome}</span></div>
      <div><strong>Usuário:</strong> <span>${file.usuario}</span></div>
      <div><strong>Tipo:</strong> <span>${file.tipo}</span></div>
      <div><strong>Tamanho:</strong> <span>${file.tamanho} bytes</span></div>
      <div><strong>Data de Upload:</strong> <span>${data}</span></div>
    `;

    fileListElement.appendChild(li);
  });
});

// Solicitar a lista de arquivos ao conectar
socket.emit("getFileList");
