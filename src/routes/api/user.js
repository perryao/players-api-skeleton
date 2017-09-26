const { Router } = require('express');
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');
const { UniqueConstraintError } = require('sequelize');
const { User } = require('../../models');
const wrap = require('../../util/wrap');
const { issue } = require('../../util/auth');

const router = new Router();

const validators = [
    check('first_name').exists(),
    check('last_name').exists(),
    check('email').isEmail(),
    check('password').isLength({ min: 6 }).custom((value, { req, loc, path}) => {
        if (value !== req.body.confirm_password) {
            throw new Error('Passwords do not match');
        }
        return value;
    }),
];

router.post('/', validators, wrap(async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(409).send({ success: false });
        }
        const { first_name, last_name, email, password, confirm_password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ first_name, last_name, email, password: hashedPassword });
        // TODO: must be a better way to hide password
        const userJson = user.toJSON();
        delete userJson.password;
        const token = issue({ id: user.id });
        res.status(201).send({ success: true, token, user: userJson });
    } catch (err) {
        // email already exists
        if (err instanceof UniqueConstraintError) {
            return res.status(409).send({ success: false });
        }
        //rethrow, letting root error handler take care of it
        throw err;
    }
}));

module.exports = router;