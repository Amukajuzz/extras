const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth');
const Achievement = require('../models/Achievement');

// CRUD операции для достижений
router.post('/', authenticateToken, async (req, res) => {
    try {
        const newAchievement = new Achievement(req.body);
        await newAchievement.save();
        res.status(201).json({ message: 'Achievement created successfully', achievement: newAchievement });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.get('/', authenticateToken, async (req, res) => {
    try {
        const achievements = await Achievement.find();
        res.status(200).json(achievements);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const achievement = await Achievement.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!achievement) {
            return res.status(404).json({ message: 'Achievement not found' });
        }
        res.status(200).json({ message: 'Achievement updated successfully', achievement });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const achievement = await Achievement.findByIdAndDelete(req.params.id);
        if (!achievement) {
            return res.status(404).json({ message: 'Achievement not found' });
        }
        res.status(200).json({ message: 'Achievement deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
