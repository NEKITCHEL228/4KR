const mongoose = require('mongoose');
const router = express.Router();

// Подключение к MongoDB
mongoose.connect('mongodb://YourMongoAdmin:1234@localhost:27017/admin')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Connection error:', err));

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, min: 18 },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

router.post('/users', async (req, res) => {
    try {
        const User = new User(req.body);
        await User.save();
        res.status(201).send(User);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.patch('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!user) return res.status(404).send('User not found');
        res.send(user);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).send('User not found');
        res.send(user);
    } catch (err) {
        res.status(500).send(err.message);
    }
});