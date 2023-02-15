const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username cannot be empty']
    },
    password: {
        type: String,
        required: [true, 'Password cannot be empty']
    }
})

userSchema.statics.findAndValidatePassword = async function (username, password) {
    const userToCheck = await this.findOne({ username: username });

    if (userToCheck) {
        const isValid = await bcrypt.compare(password, userToCheck.password)
        return isValid ? userToCheck : false;
    }
    return false;
}

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

module.exports = mongoose.model('User', userSchema);