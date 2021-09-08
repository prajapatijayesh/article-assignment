/**
 * @author: prajapatijayesh
 */

const mongoose = require('mongoose');
const moment = require('moment');

const CommentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: String,
    active: Boolean,
    createdAt: Number,
    updatedAt: Number
});

CommentSchema.pre('save', function (next) {
    this.createdAt = moment.unix();
    next();
})

module.exports = mongoose.model('Comments', CommentSchema);