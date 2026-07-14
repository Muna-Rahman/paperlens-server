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
const db = client.db(); // <-- FIX 1: Extract the Db connection context

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client: client
  }),
  // FIX A: Tell Better Auth where its own endpoints live
  baseURL: "http://localhost:5000",
  
  // FIX B: Explicitly allow the Next.js frontend to make auth calls
  trustedOrigins: ["http://localhost:3000"],
  
  emailAndPassword: {
    enabled: true
  },
  advanced: {
    defaultCookieAttributes: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    }
  }
});