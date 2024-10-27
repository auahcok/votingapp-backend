import { PrismaClient } from '@prisma/client';
import config from '../config/config.service';
import logger from './logger.service';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: config.DATABASE_URL,
    },
  },
});

export const connectDatabase = async () => {
  try {
    logger.info('Connecting to the database...');
    await prisma.$connect();
    logger.info('Database connected');
  } catch (err) {
    logger.error((err as Error).message);
    process.exit(1);
  }
};

export default prisma;
// ====================== OLD ONE
// import mongoose from 'mongoose';
// import config from '../config/config.service';
// import logger from './logger.service';

// export const connectDatabase = async () => {
//   try {
//     logger.info('Connecting database...');
//     await mongoose.connect(config.POSTGRES_URL);
//     logger.info('Database connected');
//   } catch (err) {
//     logger.error((err as Error).message);
//     process.exit(1);
//   }
// };
