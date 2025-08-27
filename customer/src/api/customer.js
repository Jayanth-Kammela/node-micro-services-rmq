import CustomerService from '../services/customer-service.js';
import auth from './middlewares/auth.js';
import { PublishMessage } from '../utils/index.js';
import config from '../config/index.js';
import { APIError } from '../utils/app-errors.js';
import { APIResponse } from '../utils/response-handler.js';

export default async function setupCustomerRoutes(app, channel) {
  const service = new CustomerService();

  /**
   * POST /signup
   * This endpoint allows a new user to sign up.
   * It expects an email, password, and phone number in the request body.
   *
   * @param {Object} req - The request object, expected to contain email, password, and phone in req.body.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   *
   * @returns {Object} The data returned from the signUp service method.
   */
  app.post('/signup', async (req, res, next) => {
    try {
      const { firstName,lastName,mobileNumber,email, password } = req.body;
      const { data } = await service.signUp({ firstName,lastName,mobileNumber,email, password});
      return new APIResponse(res,"User logged in successfully",data)
    } catch (err) {
      next(err);
    }
  });

  /**
   * POST /login
   * This endpoint allows a user to log in.
   * It expects an email and password in the request body.
   *
   * @param {Object} req - The request object, expected to contain email and password in req.body.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   *
   * @returns {Object} The data returned from the signIn service method.
   */
  app.post('/login', async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { data } = await service.signIn({ email, password });
      // return res.json(data);
      return new APIResponse(res,"User logged in successfully",data)
    } catch (err) {
      console.log("errx",err)
      next(err);
    }
  });

  /**
   * POST /address
   * This endpoint allows an authenticated user to add a new address.
   * It uses the auth to ensure that the request is authenticated.
   * It expects a street, postal code, city, and country in the request body.
   *
   * @param {Object} req - The request object, expected to contain the authenticated user in req.user and the address details in req.body.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   *
   * @returns {Object} The data returned from the addNewAddress service method.
   */
  app.post('/address', auth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { street, postalCode, city, country } = req.body;
      const { data } = await service.addNewAddress(_id, {
        street,
        postalCode,
        city,
        country,
      });

      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  /**
   * GET /profile
   * This endpoint retrieves the profile of the authenticated user.
   * It uses the auth to ensure that the request is authenticated.
   *
   * @param {Object} req - The request object, expected to contain the authenticated user in req.user.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   *
   * @returns {Object} The profile of the authenticated user.
   */
  app.get('/profile', auth(), async (req, res, next) => {
    try {
      const { data } = req.user;
      const user = await service.getProfile(data.id);
      console.log("data",data.id)
      return res.json(user);
    } catch (err) {
      next(err);
    }
  });

  /**
   * DELETE /profile
   * This endpoint allows an authenticated user to delete their profile.
   * It uses the auth to ensure that the request is authenticated.
   *
   * @param {Object} req - The request object, expected to contain the authenticated user in req.user.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   *
   * @returns {Object} The data returned from the deleteProfile service method.
   */
  app.delete('/profile', auth, async (req, res) => {
    try {
      const { _id } = req.user;
      const { data, payload } = await service.deleteProfile(_id);

      // Publish message to shopping service
      await PublishMessage(channel, config.SHOPPING_SERVICE, JSON.stringify(payload));
      return res.json(data);
    } catch (err) {
      throw APIError('Data Not found', err);
    }
  });

  /**
   * GET /whoami
   * This endpoint returns a message indicating the service identity.
   * It does not require any authentication or parameters.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   *
   * @returns {Object} A JSON object containing a message about the service identity.
   */
  app.get('/whoami', (req, res) =>
    res.status(200).json({
      msg: '/customer: I am a customer service',
    }),
  );
}
