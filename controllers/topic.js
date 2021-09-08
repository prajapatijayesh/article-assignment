/**
 * 
 */

const Topic = require('../models/Topic');
const Posts = require('../models/Posts');
const Comments = require('../models/Comments');

const fetchTopics = async (req, res, next) => {
    const pageSize = Number(req.query.pageSize) || 10;
    const pageNumber = Number(req.query.pageNumber) || 0;
    const active = req.query.active || true;
    const sort = { created_date: -1 };

    try {
        const count = await Topic.find({ active: active }).count();

        const fetchTopics = await Topic.find({ active: active })
            .sort(sort)
            .skip(pageNumber > 0 ? ((pageNumber - 1) * pageSize) : 0)
            .limit(pageSize)
            .exec();
        return res.status(200).json({
            status: 'success',
            message: 'success',
            count: count,
            data: fetchTopics
        })
    } catch (error) {
        console.log(error);
        return res.status(500).jsonp({
            status: 'error',
            message: 'Sorry! Something went wrong.'
        });
    }
}

const fetchPostsWithComments = async (req, res, next) => {
    const pageSize = Number(req.query.pageSize) || 10;
    const pageNumber = Number(req.query.pageNumber) || 0;
    const active = req.query.active || true;
    const sort = { created_date: -1 };

    try {
        const count = await Posts.find({ active: active }).count();

        const fetchPosts = await Posts.aggregate([
            { '$match': { active: active } },
            { '$sort': sort },
            {
                '$lookup': {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'post',
                    as: 'comments'
                }
            },
            {
                '$facet': {
                    metadata: [{ $count: "total" }, { $addFields: { page: 1 } }],
                    data: [{ $skip: pageNumber }, { $limit: pageSize }] // add projection here wish you re-shape the docs
                }
            }]);
        return res.status(200).json({
            status: 'success',
            message: 'success',
            count: count,
            data: fetchPosts
        })
    } catch (error) {
        console.log(error);
        return res.status(500).jsonp({
            status: 'error',
            message: 'Sorry! Something went wrong.'
        });
    }
}

const create = async (req, res, next) => {
    const { title } = req.body;
    try {
        const findTopic = await Topic.findOne({ title: title, active: true });

        if (findTopic) {
            return res.status(200).json({
                status: 'success',
                message: 'Topic found.'
            });
        }
        const topicData = {
            createdBy: req.user,
            title: req.body.title,
            subTitle: req.body.subTitle,
            content: req.body.content,
            active: true
        }
        const topic = new Topic(topicData);
        const createdTopicData = await topic.save();
        return res.status(201).json({
            status: 'success',
            message: 'success',
            data: createdTopicData
        });
    } catch (error) {
        console.log(error);
        return res.status(500).jsonp({
            status: 'error',
            message: 'Sorry! Something went wrong.'
        });
    }
}

const posts = async (req, res, next) => {
    const uuid = req.params.uuid; // topic: _id
    try {
        const findTopic = await Topic.findById(uuid);
        if (!findTopic) {
            return res.status(404).json({
                status: 'success',
                message: 'Topic not found.'
            });
        }
        const postData = {
            createdBy: req.user,
            topic: findTopic,
            content: req.body.content,
            active: true
        }
        const posts = new Posts(postData);
        const createdPostData = await posts.save();
        return res.status(201).json({
            status: 'success',
            message: 'success',
            data: createdPostData
        });
    } catch (error) {
        console.log(error);
        return res.status(500).jsonp({
            status: 'error',
            message: 'Sorry! Something went wrong.'
        });

    }
}

const comments = async (req, res, next) => {
    const uuid = req.params.uuid; // post: _id
    try {
        const findPost = await Posts.findById(uuid);
        if (!findPost) {
            return res.status(404).json({
                status: 'success',
                message: 'Post not found.'
            });
        }
        const commentData = {
            createdBy: req.user,
            post: findPost,
            content: req.body.content,
            active: true
        }
        const comments = new Comments(commentData);
        const createdCommentData = await comments.save();
        return res.status(201).json({
            status: 'success',
            message: 'success',
            data: createdCommentData
        });
    } catch (error) {
        console.log(error);
        return res.status(500).jsonp({
            status: 'error',
            message: 'Sorry! Something went wrong.'
        });

    }
}

module.exports = {
    fetchTopics,
    fetchPostsWithComments,
    create,
    posts,
    comments
}