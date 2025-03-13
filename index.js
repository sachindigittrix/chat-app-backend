import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";

import { SocketController } from "./socketController/index.js";
import { connectDb } from "./config/db.js";
import { syncDatabase } from "./models/index.js";

import userRoutes from "./routes/userRoutes.js";
import messagesRoutes from "./routes/messagesRoutes.js";
dotenv.config();
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Or specify allowed frontend origin
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api/users", userRoutes);
app.use("/api/messages", messagesRoutes);

io.on("connection", (socket) => {
  console.log("A user connected");
  SocketController(io, socket);
});

connectDb().then(() => {
  syncDatabase(); // Sync database before starting server
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
