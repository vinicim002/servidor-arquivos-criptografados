const bcrypt = require('bcrypt');
const fs = require('fs-extra');
const path = require('path');

const dbPath = path.join(__dirname, '../db/users.json');

// Garante que o arquivo existe
fs.ensureFileSync(dbPath);
if (!fs.existsSync(dbPath) || fs.readFileSync(dbPath).toString().trim() === '') {
  fs.writeFileSync(dbPath, '[]');
}

function readUsers() {
  return JSON.parse(fs.readFileSync(dbPath));
}

function writeUsers(users) {
  fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));
}

exports.registerUser = async (req, res) => {
  const { email, senha } = req.body;
  const users = readUsers();

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'Usuário já existe.' });
  }

  const hashedPassword = await bcrypt.hash(senha, 10);
  users.push({ email, senha: hashedPassword });
  writeUsers(users);

  res.status(201).json({ message: 'Usuário registrado com sucesso!' });
};

exports.loginUser = async (req, res) => {
  const { email, senha } = req.body;
  const users = readUsers();

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(400).json({ message: 'Usuário não encontrado.' });
  }

  const isMatch = await bcrypt.compare(senha, user.senha);
  if (!isMatch) {
    return res.status(401).json({ message: 'Senha incorreta.' });
  }

  res.status(200).json({ message: 'Login bem-sucedido!' });
};
