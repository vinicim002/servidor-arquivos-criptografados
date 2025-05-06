const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');
const socketHandler = require('./sockets/socketHandler');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use('/api/files', fileRoutes);

// Middleware
app.use(cors());
app.use(express.json());

// Rotas da API (autenticação)
app.use('/api', authRoutes);

// Servir arquivos estáticos do frontend (HTML, CSS, JS, assets)
app.use(express.static(path.join(__dirname, '../frontend'))); // Serve a pasta frontend
app.use('/css', express.static(path.join(__dirname, '../frontend/css')));
app.use('/js', express.static(path.join(__dirname, '../frontend/js')));
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));

// Rotas para páginas HTML
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/register.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html')); // ou home.html, se preferir criar um arquivo separado
});

// Inicializa os sockets
socketHandler(io);

// Inicialização do servidor
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
