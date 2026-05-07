
require('dotenv').config(); 
const express = require('express');

const app = express();
app.use(express.json());

// Подключаем наш файл с API
const apiRoutes = require('./api');

// Указываем, что все маршруты из api.js будут начинаться с /api
// Например: http://localhost:3000/api/users
app.use('/api', apiRoutes);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});