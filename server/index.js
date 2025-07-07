const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const WebSocket = require("ws");

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// token proxy endpoint
app.get("/token", async (req, res) => {
  try {
    //request a real-time token from assembly ai using your secret api key
    const response = await axios.post(
      "https://api.assemblyai.com/v2/realtime/token",
      {},
      { headers: { authorization: process.env.ASSEMBLYAI_API_KEY } }
    );
    res.json({ token: response.data.token });
  } catch (err) {
    console.err(
      "Failed to get AssemblyAI token:",
      err.response?.data || err.message
    );
    res.status(500).json({ error: "Failed to get token" });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
