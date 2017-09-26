const { Router } = require('express');
const user = require('./user');
const player = require('./player');
const wrap = require('../../util/wrap');
const { authenticate, issue } = require('../../util/auth');

const router = new Router();

router.post('/login', authenticate(), wrap(async (req, res) => {
    const user = req.user;
    const payload = { id: user.id };
    const token = issue(payload);
    res.send({ token, user, success: true });
}));

router.use('/user', user);
router.use('/players', player);

module.exports = router;