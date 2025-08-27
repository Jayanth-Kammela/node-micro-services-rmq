import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { toJSON, paginate } from './plugins/index.js';
// const { roles } = require('../config/roles');

const { Schema } = mongoose;

const customerSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    mobileNumber:{
      type: Number,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      // validate(value) {
      //   if (!validator.isEmail(value)) {
      //     throw new Error('Invalid email');
      //   }
      // },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      // validate(value) {
      //   if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
      //     throw new Error('Password must contain at least one letter and one number');
      //   }
      // },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      // enum: roles,
      default: 'customer',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      trim: true,
    },
    salt: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
customerSchema.plugin(toJSON);
customerSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The customer's email
 * @param {ObjectId} [excludeCustomerId] - The id of the customer to be excluded
 * @returns {Promise<boolean>}
 */
customerSchema.statics.isEmailTaken = async function (email, excludeCustomerId) {
  const customer = await this.findOne({ email, _id: { $ne: excludeCustomerId } });
  return !!customer;
};

/**
 * Check if password matches the customer's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
customerSchema.methods.isPasswordMatch = async function (password) {
  const customer = this;
  return bcrypt.compare(password, customer.password);
};

// customerSchema.pre('save', async function (next) {
//   const customer = this;
//   if (customer.isModified('password')) {
//     customer.password = await bcrypt.hash(customer.password, 8);
//   }
//   next();
// });

/**
 * @typedef Customer
 */


const Customer = mongoose.model('customer', customerSchema);

export default Customer;
