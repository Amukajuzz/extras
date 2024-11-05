const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student', // предполагается, что есть модель Student
        required: true
    }
});

module.exports = mongoose.model('Achievement', achievementSchema);
