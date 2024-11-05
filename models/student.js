const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Создаем схему для студента
const studentSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    enrollmentDate: Date,
    courseCompletionStatus: Boolean,
    password: String,
});

// Хешируем пароль перед сохранением
studentSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Метод для сравнения пароля
studentSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Student', studentSchema);
