import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store usernames mapped by socket.id
const users: Record<string, string> = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // When user sets a username
  socket.on("setUsername", (username: string) => {
    users[socket.id] = username;
    console.log(`${socket.id} set username: ${username}`);

    // Broadcast user list to all clients
    io.emit("userList", users);
  });

  // Private message (using username)
  socket.on("privateMessage", ({ toUsername, msg }) => {
    const targetId = Object.keys(users).find(id => users[id] === toUsername);
    if (targetId) {
      io.to(targetId).emit("privateMessage", `${users[socket.id]} says: ${msg}`);
    }
  });

  // Group messages
  socket.on("joinRoom", (room) => {
    socket.join(room);
    socket.emit("chatMessage", `You joined room: ${room}`);
  });

  socket.on("roomMessage", ({ room, msg }) => {
    io.to(room).emit("chatMessage", `[${room}] ${users[socket.id]}: ${msg}`);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete users[socket.id];
    io.emit("userList", users);
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
