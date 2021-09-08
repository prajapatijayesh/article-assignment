const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../models/User');

module.exports = async (req, res, next) => {
    const token = req.header('token');
    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'No token provided!'
        });
    }
    try {
        const secret = config.get('secret');
        const decoded = jwt.verify(token, secret);
        const findUser = await User.findById(decoded.id);
        if (!findUser) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found!'
            });
        }
        req.user = findUser;
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).jsonp({
            status: 'error',
            message: 'Unauthorized!'
        });
    }
}
