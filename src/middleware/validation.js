const { check, validationResult } = require('express-validator/check');

function checkResult(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(409).send({ success: false });
  }
  next();
}

module.exports.validatePlayer = [
  check('first_name').exists(),
  check('last_name').exists(),
  check('rating').exists(),
  check('handedness').exists(),
  checkResult
];

module.exports.validateUser = [
  check('first_name').exists(),
  check('last_name').exists(),
  check('email').isEmail(),
  check('password').isLength({ min: 6 }).custom((value, { req }) => {
    if (value !== req.body.confirm_password) {
      throw new Error('Passwords do not match');
    }
    return value;
  }),
  checkResult
];