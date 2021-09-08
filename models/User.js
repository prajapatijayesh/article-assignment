/**
 * @author: prajapatijayesh
 */

const mongoose = require('mongoose');
const moment = require('moment');

/**
 * TODO: we can also add validations to the "User" model.
 * for example: added for "email"
 * 
 */
const UserSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: { type: String, required: true },
    password: String,
    active: Boolean,
    createdAt: Number,
    updatedAt: Number
});

UserSchema.pre('save', function (next) {
    this.createdAt = moment.unix();
    next();
})

module.exports = mongoose.model('User', UserSchema);