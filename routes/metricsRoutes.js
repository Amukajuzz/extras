// src/routes/metricsRoutes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth'); // Импортируем middleware для аутентификации
const Student = require('../models/Student');
const Assignment = require('../models/Assignment');
const Achievement = require('../models/Achievement');

// Получение средней оценки по всем заданиям
router.get('/average-score', authenticateToken, async (req, res) => { // Добавляем аутентификацию
    try {
        const assignments = await Assignment.find();
        const totalScore = assignments.reduce((acc, assignment) => acc + assignment.score, 0);
        const averageScore = assignments.length ? (totalScore / assignments.length).toFixed(2) : 0;
        res.json({ averageScore });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Получение процента студентов, завершивших курс
router.get('/completion-rate', authenticateToken, async (req, res) => { // Добавляем аутентификацию
    try {
        const students = await Student.find();
        const completedStudents = students.filter(student => student.courseCompletionStatus).length;
        const completionRate = students.length ? ((completedStudents / students.length) * 100).toFixed(2) : 0;
        res.json({ completionRate });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Получение студента с самой высокой средней оценкой
router.get('/top-performer', authenticateToken, async (req, res) => { // Добавляем аутентификацию
    try {
        const students = await Student.find();
        const assignments = await Assignment.aggregate([
            {
                $group: {
                    _id: "$student",
                    averageScore: { $avg: "$score" }
                }
            },
            {
                $sort: { averageScore: -1 }
            },
            {
                $limit: 1
            }
        ]);

        if (assignments.length > 0) {
            const topPerformerId = assignments[0]._id;
            const topPerformer = await Student.findById(topPerformerId);
            res.json({ student: topPerformer, averageScore: assignments[0].averageScore });
        } else {
            res.json({ message: 'No assignments found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Получение студентов с наибольшим количеством достижений
router.get('/achievements/top-achievers', authenticateToken, async (req, res) => { // Добавляем аутентификацию
    try {
        const topAchievers = await Achievement.aggregate([
            {
                $group: {
                    _id: "$student",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $lookup: {
                    from: "students",  // Имя коллекции студентов
                    localField: "_id",
                    foreignField: "_id",
                    as: "studentInfo"
                }
            },
            {
                $unwind: "$studentInfo"
            },
            {
                $project: {
                    studentId: "$_id",
                    studentName: "$studentInfo.name",
                    achievementCount: "$count"
                }
            }
        ]);

        res.json(topAchievers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
