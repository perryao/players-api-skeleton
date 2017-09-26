const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

function localStrategy() {
    return new LocalStrategy({
        usernameField: 'email',
    }, (email, password, next) => {
        User
        .findOne({ where: { email }})
        .then(user => {
            if (!user) {
                return next(null, false);
            }
            if (!bcrypt.compareSync(password, user.password)) {
                return next(null, false);
            }
            next(null, user);
        }).catch(err => {
            next(err, false);            
        });
    });
}
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

module.exports.authenticate = function() {
    return passport.authenticate('local', { session: false });
};

module.exports.isAuthenticated = function() {
    return passport.authenticate('jwt', { session: false });
};

module.exports.configureAuth = function(app) {
    passport.use(localStrategy());
    passport.use(jwtStrategy());
    app.use(passport.initialize());
};