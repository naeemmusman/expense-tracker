import mongoose from "mongoose";

export class Database {
    private static instance: Database;

    private constructor() {
        // Initialize the database connection here
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public async connect(uri: string): Promise<void> {
        if (!uri) {
            throw new Error("Database URI is required");
        }
        try {
            await mongoose.connect(uri, {});
            console.log("Database connected successfully");
        } catch (error) {
            console.error("Database connection error:");
            console.error(error);
            throw new Error("Failed to connect to the database");
        }
    }

    public async disconnect(): Promise<void> {
        console.log("Disconnecting from the database...");
        await mongoose.connection.close();
        console.log("Database disconnected successfully");
    }
}