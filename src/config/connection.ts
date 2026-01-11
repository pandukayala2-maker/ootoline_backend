import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import Config from './dot_config';

class MongoConnection {
    private static instance: MongoConnection | null = null;

    private constructor() {}

    public static getInstance(): MongoConnection {
        if (!this.instance) {
            this.instance = new MongoConnection();
        }
        return this.instance;
    }

    public async connect(): Promise<void> {
        try {
            await mongoose.connect(Config._DB_URL, {
                dbName: Config._DB_NAME,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000
            });
            logger.info('MongoDB connection established successfully');
        } catch (error) {
            logger.error('Failed to establish MongoDB connection:', error);
            throw error;
        }
    }
}

export default MongoConnection;
