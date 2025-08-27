import mongoose from 'mongoose';
import config from '../config/index.js';
import logger from '../utils/logger.js';

const connectToDatabase = async () => {
  try {
    await mongoose.connect(config.DB_URL);
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Database connection error:', error);
    process.exit(1);
  }
};

export default connectToDatabase;
