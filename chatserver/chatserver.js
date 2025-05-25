const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Allow cross-origin requests from your frontend
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Map to store connected users
const userSockets = new Map();

io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    // When a user authenticates, save their socket
    socket.on("authenticate", (userId) => {
        userSockets.set(userId, socket.id);
        console.log(`User ${userId} authenticated`);
    });

    // Handle sending a private message
    socket.on("private-message", ({ to, from, message }) => {
        const receiverSocketId = userSockets.get(to);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("private-message", {
                from,
                message,
                timestamp: new Date(),
            });
        } else {
            console.log(`User ${to} not connected`);
        }
    });

    // Clean up when a socket disconnects
    socket.on("disconnect", () => {
        for (const [userId, sockId] of userSockets.entries()) {
            if (sockId === socket.id) {
                userSockets.delete(userId);
                console.log(`User ${userId} disconnected`);
            }
        }
    });
});

app.get("/", (req, res) => {
    res.send("🔌 Chat server is live!");
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`🗨️ Chat server listening on port ${PORT}`);
});
