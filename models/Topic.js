/**
 * @author: prajapatijayesh
 */

const mongoose = require('mongoose');
const moment = require('moment');

const TopicSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: String,
    subTitle: String,
    content: String,
    active: Boolean,
    createdAt: Number,
    updatedAt: Number
});

TopicSchema.pre('save', function (next) {
    this.createdAt = moment.unix();
    next();
})

module.exports = mongoose.model('Topic', TopicSchema);