const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

function jwtStrategy() {
    const opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = process.env.JWT_SECRET;
    return new JwtStrategy(opts, (payload, next) => {
        User
        .findOne({ where: { id: payload.id }})
        .then((user) => {
            next(null, user);
        })
        .catch((err) => {
            next(err, false);
        });
    });
}

module.exports.issue = function (payload) {
    return jwt.sign(payload, process.env.JWT_SECRET);
};

module.exports.isAuthenticated = function() {
    return passport.authenticate('jwt', { session: false });
};

module.exports.configureAuth = function(app) {
    passport.use(jwtStrategy());
    app.use(passport.initialize());
};