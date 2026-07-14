import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const dbUri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!dbUri) {
    throw new Error("Database connection string (MONGODB_URI) is missing from your .env file.");
}

const client = new MongoClient(dbUri);

export const auth = betterAuth({
    database: mongodbAdapter(client.db()),
    emailAndPassword: {
        enabled: true
    },
    trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:3000"],
    cookie: {
        secure: process.env.NODE_ENV === "production",
        sameSite: "none", // Must be "none" if Frontend and Backend are on different subdomains/domains
    }
});