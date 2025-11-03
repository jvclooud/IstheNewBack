import { MongoClient } from 'mongodb'
import 'dotenv/config'

const connectDB = async () => {
    try {
        console.log('MongoDB URI:', process.env.MONGO_URI);
        console.log('MongoDB Database:', process.env.MONGO_DB);
        
        if (!process.env.MONGO_URI || !process.env.MONGO_DB) {
            throw new Error('MongoDB URI or Database name not found in environment variables');
        }

        const client = new MongoClient(process.env.MONGO_URI);
        await client.connect();
        console.log('MongoDB connected successfully');
        const db = client.db(process.env.MONGO_DB);
        return db;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const db = await connectDB();

export { db }