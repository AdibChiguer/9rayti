import { Server as SocketIOServer } from "socket.io";
import http from "http";

export const initSocketServer = (server: http.Server) => {
  const io = new SocketIOServer(server);

  io.on("connection", (socket) => {
    console.log("Client connected");

    // Listen for "notification" event
    socket.on("notification", (data) => {
      // Broadcast the data
      io.emit("newNotification", data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};