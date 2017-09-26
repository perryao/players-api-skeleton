const _ = require('lodash');
const { Router } = require('express');
const bcrypt = require('bcrypt');
const { UniqueConstraintError } = require('sequelize');
const { User } = require('../../models');
const wrap = require('../../util/wrap');
const { issue } = require('../../util/auth');
const { validateUser } = require('../../middleware/validation');

const router = new Router();

router.post('/', validateUser, wrap(async (req, res) => {
    try {
        const { first_name, last_name, email, password, confirm_password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ first_name, last_name, email, password: hashedPassword });
        const token = issue({ id: user.id });
        res.status(201).send({ 
            token,
            user,
            success: true, 
        });
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