const {Router} = require('express');
const router = Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');

// /api/auth + 

router.post(
    '/register',
    [
        check('email', 'Уебанские email').isEmail(),
        check('password', 'Уебанский пароль').isLength({ min: 6 }),
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Твоя хуйня не прошла валидацию на серваке'
            }); 
        }
        const {email, password} = req.body;
        const candidate = await User.findOne({email});
        if (candidate) {
           return res.status(400).json({ message: 'Такое мыло уже есть в базе, вот кстати пароль к нему: ТЫПИДОР123' });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            email,
            password: hashedPassword
        })
        await user.save();
        res.status(201).json({ message: 'Юзер создан' })
    } catch (error) {
        res.status(500).json({ message: 'Ты уебан?' })
    }
})

router.post(
    '/login',
    [
        check('email', 'Введин еmail, уебанок').normalizeEmail().isEmail(),
        check('password', 'Введи пароль, чорт блять').exists(),
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Твоя хуйня не прошла валидацию на серваке'
            }); 
        }
        const {email, password} = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Нет у нас таких юзеров' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Неугадал пароль, попробуй вот этот: ТЫПИДОР123' });
        }
        const token = jwt.sign(
            { userId: user.id },
            config.get('jwtSecret'),
            { expiresIn: '1h' }
        );
        res.json({ token, userId: user.id });
    } catch (error) {
        res.status(500).json({ message: 'Ты уебан?' })
    }
})

module.exports = router;