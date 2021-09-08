/**
 * 
 */

const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const config = require('config');

const User = require('../models/User');

const signUp = async (req, res, next) => {
    const { email } = req.body;
    try {
        const findUser = await User.findOne({ email: email });

        if (findUser) {
            return res.status(200).json({
                status: 'success',
                message: 'User found.'
            });
        }
        const userData = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            active: true
        }
        const user = new User(userData);
        const signUpUserData = await user.save();
        return res.status(201).json({
            status: 'success',
            message: 'success',
            data: signUpUserData
        });
    } catch (error) {
        console.log(error);
        return res.status(500).jsonp({
            status: 'error',
            message: 'Sorry! Something went wrong.'
        });

    }
}

const signIn = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email, active: true });

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User Not found.'
            });
        }
        const isValid = bcrypt.compareSync(
            password,
            user.password
        );

        if (!isValid) {
            return res.status(401).send({
                status: 'error',
                message: 'Password is incorrect!'
            });
        }
        const secret = config.get('secret');
        var token = jwt.sign({ id: user.id }, secret, {
            expiresIn: 86400 // 24 hours
        });

        return res.status(200).send({
            status: 'success',
            message: 'access_token',
            access_token: token
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
    signUp,
    signIn
}