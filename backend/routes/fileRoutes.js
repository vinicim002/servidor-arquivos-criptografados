const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const FILE_DB = path.join(__dirname, '../db/files.json');

router.get('/list', (req, res) => {
    fs.readFile(FILE_DB, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Erro ao ler o banco de arquivos' });

        const files = JSON.parse(data || '[]');
        res.json(files);
    });
});

module.exports = router;
