import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default async function connectDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database connected successfully " );
    } catch (error) {
        console.error("Error connecting to database:", error.message);
        process.exit(1);
    }
}
