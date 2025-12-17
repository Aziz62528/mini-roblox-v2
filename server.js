const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.static("public"));

let players = {};

io.on("connection", socket => {
  console.log("Oyuncu bağlandı:", socket.id);

  players[socket.id] = {
    x: 250,
    y: 250,
    name: "Player"
  };

  // 🔥 BAĞLANINCA GÖNDER
  socket.emit("players", players);
  socket.broadcast.emit("players", players);

  socket.on("update", data => {
    players[socket.id] = data;

    // 🔥 HER HAREKETTE GÖNDER
    io.emit("players", players);
  });

  socket.on("disconnect", () => {
    console.log("Oyuncu çıktı:", socket.id);
    delete players[socket.id];
    io.emit("players", players);
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Server açık");
});
