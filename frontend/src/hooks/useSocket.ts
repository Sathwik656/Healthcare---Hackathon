import { io, Socket } from "socket.io-client";

let socketInstance: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socketInstance) {
    socketInstance = io("/", {
      // same origin via Vite proxy
      withCredentials: true, // sends httpOnly cookie
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });
    socketInstance.on("connect", () => {
      console.log("✅ Socket connected:", socketInstance.id);
    });
    socketInstance.on("connect_error", (err) => {
      console.error("❌ Socket connect error:", err.message);
    });
    socketInstance.on("disconnect", (reason) => {
      console.warn("⚠️ Socket disconnected:", reason);
    });
  }
  return socketInstance;
};

export const disconnectSocket = () => {
  socketInstance?.disconnect();
  socketInstance = null;
};
