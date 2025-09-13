"use client";

import { createContext, useContext, useEffect, useRef, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { usePathname } from "next/navigation";

// Define context type
interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const pathname = usePathname(); // current route

  useEffect(() => {
    // Connect to NestJS backend
    socketRef.current = io("http://localhost:3000"); // your NestJS backend URL
    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Connected to NestJS server:", socket.id);
    });

    // Listen for global messages
    socket.on("message", (msg: { message : string}) => {
      // Don't show alert if route includes /admin
      if (!pathname?.includes("/admin")) {
        console.log(msg)
        alert(`Server message: ${msg.message}`);
      }
      console.log("Received:", msg);
    });

    return () => {
      socket.disconnect();
    };
  }, [pathname]); // re-run effect if pathname changes

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to access socket from any component
export const useSocket = () => useContext(SocketContext);
