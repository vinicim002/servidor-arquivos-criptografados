const fs = require('fs');
const path = require('path');
const FILE_DB = path.join(__dirname, '../db/files.json');

// função para registrar o arquivo
function registrarArquivo({ nome, tipo, tamanho, usuario }) {
    const novoArquivo = {
        nome,
        tipo,
        tamanho,
        usuario,
        dataUpload: new Date().toISOString()
    };

    let arquivos = [];

    if (fs.existsSync(FILE_DB)) {
        const conteudo = fs.readFileSync(FILE_DB, 'utf8');
        arquivos = JSON.parse(conteudo || '[]');
    }

    arquivos.push(novoArquivo);
    fs.writeFileSync(FILE_DB, JSON.stringify(arquivos, null, 2));
}

module.exports = { registrarArquivo };
