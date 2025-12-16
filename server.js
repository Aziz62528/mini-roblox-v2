const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let players = {};
let it = null; // ebe

io.on("connection", socket => {
  console.log("Oyuncu bağlandı:", socket.id);

  players[socket.id] = {
    x: Math.random() * 500,
    y: Math.random() * 500,
    name: "Player",
    color: "#ff0000",
    skin: "square"
  };

  if (!it) it = socket.id;

  socket.on("update", data => {
    if (!players[socket.id]) return;

    players[socket.id] = { ...players[socket.id], ...data };

    // TAG (ebe yakalama)
    if (it && socket.id !== it) {
      const a = players[it];
      const b = players[socket.id];
      if (a && b && Math.abs(a.x - b.x) < 20 && Math.abs(a.y - b.y) < 20) {
        it = socket.id;
      }
    }
  });

  socket.on("chat", data => {
    io.emit("chat", data);
  });

  socket.on("disconnect", () => {
    console.log("Oyuncu çıktı:", socket.id);
    delete players[socket.id];
    if (it === socket.id) {
      it = Object.keys(players)[0] || null;
    }
  });
});

setInterval(() => {
  io.emit("state", { players, it });
}, 30);

server.listen(process.env.PORT || 3000, () => {
  console.log("Server çalışıyor");
});
