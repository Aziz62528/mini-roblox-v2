const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let players = {};

io.on("connection", socket => {
  players[socket.id] = { x:100, y:100, name:"Player" };

  socket.on("update", data => {
    players[socket.id] = data;
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
  });
});

setInterval(() => {
  io.emit("players", players);
}, 30);

server.listen(process.env.PORT || 2121);
