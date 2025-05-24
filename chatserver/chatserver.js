const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "https://your-frontend.vercel.app"],
        methods: ["GET", "POST"],
        credentials: true,
    },
});

const userSockets = new Map();

io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    socket.on("authenticate", (userId) => {
        userSockets.set(userId, socket.id);
        console.log(`User ${userId} authenticated`);
    });

    socket.on("private-message", ({ to, from, message }) => {
        const receiverSocketId = userSockets.get(to);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("private-message", {
                from,
                message,
                timestamp: new Date(),
            });
        }
    });

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
    res.send("Chat server is running");
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Chat server listening on port ${PORT}`);
});
