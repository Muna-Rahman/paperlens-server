import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import paperRoutes from "./routes/paper.routes"; // Import the paper router

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

// Better Auth route mounting
app.use("/api/auth", toNodeHandler(auth));

// FIXED: Mount paper engine resource routes
app.use("/api/papers", paperRoutes);

export default app;