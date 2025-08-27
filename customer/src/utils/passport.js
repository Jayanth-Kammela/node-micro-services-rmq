import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import config from '../config/index.js';
import { tokenTypes } from './index.js';
import CustomerService from '../services/customer-service.js';

const jwtOptions = {
  secretOrKey: config.JWT.SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
    const service = new CustomerService();
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    const customer = await service.getProfile(payload.sub);
    if (!customer) {
      return done(null, false);
    }
    return done(null, customer);
  } catch (error) {
    return done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export default jwtStrategy;
