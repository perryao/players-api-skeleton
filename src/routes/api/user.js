const { Router } = require('express');
const bcrypt = require('bcrypt');
const { UniqueConstraintError } = require('sequelize');
const { User } = require('../../models');
const wrap = require('../../util/wrap');
const { issue } = require('../../util/auth');

const router = new Router();

router.post('/', wrap(async (req, res) => {
    try {
        const { first_name, last_name, email, password, confirm_password } = req.body;
        if (!first_name || !last_name || !email) return res.status(409).send({ success: false });
        if (password !== confirm_password) return res.status(409).send({ success: false });
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
            return res.status(409).send({ success: false});
        }
        //rethrow, letting root error handler take care of it
        throw err;
    }
}));

module.exports = router;