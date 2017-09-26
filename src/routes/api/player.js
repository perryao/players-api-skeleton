const { Router } = require('express');
const { UniqueConstraintError } = require('sequelize');
const { isAuthenticated } = require('../../util/auth');
const wrap = require('../../util/wrap');
const { Player } = require('../../models');

const router = new Router();

router.use(isAuthenticated());

router.get('/', wrap(async (req, res) => {
    const players = await Player.findAll({ 
        where: {
            user_id: req.user.id,
        }
    });
    res.send({ success: true, players });
}));

router.post('/', wrap(async (req, res) => {
    try {
        const user_id = req.user.id;
        const { first_name, last_name, rating, handedness } = req.body;
        const player = await Player.create({ first_name, last_name, rating, handedness, user_id });
        res.status(201).send({ success: true, player });
    } catch (err) {
        // duplicate player name
        if (err instanceof UniqueConstraintError) {
            return res.status(409).send({ success: false });
        }
        throw err;
    }
}));

router.delete('/:id', wrap(async (req, res) => {
    const playerId = req.params.id;
    await Player.destroy({ where: { id: playerId, user_id: req.user.id }});
    res.send({ success: true });
}));

module.exports = router;