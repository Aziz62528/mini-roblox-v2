const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(express.static("public"));

let players = {};

io.on("connection", socket => {
  players[socket.id] = { x:250, y:250, name:"Player" };

  socket.on("update", data => {
    players[socket.id] = data;
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
  });
});

setInterval(() => {
  io.emit("players", players);
}, 50);

server.listen(process.env.PORT || 3000);
