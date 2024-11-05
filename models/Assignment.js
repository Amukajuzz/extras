const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    }
});

module.exports = mongoose.model('Assignment', assignmentSchema);
