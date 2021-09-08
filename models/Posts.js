/**
 * @author: prajapatijayesh
 */

const mongoose = require('mongoose');
const moment = require('moment');

const PostSchema = new mongoose.Schema({
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic'
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

PostSchema.pre('save', function (next) {
    this.createdAt = moment.unix();
    next();
})

module.exports = mongoose.model('Posts', PostSchema);