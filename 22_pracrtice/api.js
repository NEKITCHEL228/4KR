
const express = require('express');
const router = express.Router(); // Создаем мини-приложение для маршрутов
const { Pool } = require('pg');
const { Sequelize, DataTypes } = require('sequelize');

const PORT = process.env.PORT || 3000;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
    }
);

sequelize.authenticate()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Connection error:', err));

const User = sequelize.define('User'
    , {
        name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, unique: true },
    });
const Task = sequelize.define('Task', {
    title: { type: DataTypes.STRING },
    completed: { type: DataTypes.BOOLEAN, defaultValue: false },
});

// Связь 1:ND
User.hasMany(Task);
Task.belongsTo(User);

// Синхронизация с БД
sequelize.sync({ force: true });

router.get('/', (req, res) => {
    res.json({
        message: 'Response from backend server',
        port: PORT
    })
})

router.post('/users', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).send(user);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll({ include: Task });
        res.send(users);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.patch('/users/:id', async (req, res) => {
    try {
        const user = await User.update(req.body, {
            where: { id: req.params.id },
            returning: true,
        });
        res.send(user);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        await User.destroy({ where: { id: req.params.id } });
        res.send({ message: 'User deleted' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});
// Обязательно экспортируем роутер, чтобы его увидел server.js
module.exports = router;