import passport from 'passport';
import { ValidateSignature } from '../../utils/index.js';
import { AuthorizationError, STATUS_CODES } from '../../utils/app-errors.js';

const verifyCallback = (req, resolve, reject) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new AuthorizationError(STATUS_CODES.UN_AUTHORIZED, 'Please authenticate'));
  }
  req.user = user;
  resolve();
};

const auth = () => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

export default auth;
