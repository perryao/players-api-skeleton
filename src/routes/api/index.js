const { Router } = require('express');
const user = require('./user');
const player = require('./player');

const router = new Router();

router.post('/login', (req, res) => {

});

router.use('/user', user);
router.use('/players', player);

module.exports = router;