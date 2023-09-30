import express from "express";
import { createServer } from "http";
import cors from "cors";
import bodyParser from "body-parser";

import { Server } from "socket.io";

let ledStatus = "off";

const PORT = 5080;

const app = express();

const httpServer = createServer(app);

const sio = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://192.168.31.74:3000"],
    methods: ["GET", "POST"],
  },
});

sio.on("connection", (socket) => {
  console.log(`${socket.id} connected.`);

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected.`);
  });
});

app.use(cors());
app.use(bodyParser.json());

app.get("/led-status", (req, res) => {
  return res
    .status(200)
    .json({ message: "LED status fetched succesfully.", ledStatus });
});

app.post("/led-status", (req, res) => {
  ledStatus = req.body.ledStatus;

  sio.emit("ledStatus", ledStatus);

  return res
    .status(200)
    .json({ message: " LED status set succesfully.", ledStatus });
});

httpServer.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});

// app.listen(PORT, () => {
//   console.log(`Server started at http://localhost:${PORT}`);
// });
