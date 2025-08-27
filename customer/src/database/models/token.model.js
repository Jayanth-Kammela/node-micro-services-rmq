import mongoose from 'mongoose';
import { toJSON } from './plugins/index.js';
import { tokenTypes } from '../../utils/index.js';

const { Schema } = mongoose;

const tokenSchema = new Schema(
    {
        token: {
            type: String,
            required: true,
            index: true,
        },
        customer: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'customer',
            required: true,
        },
        type: {
            type: String,
            enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL],
            required: true,
        },
        expires: {
            type: Date,
            required: true,
        },
        blacklisted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Token = mongoose.model('Token', tokenSchema);

export default Token;