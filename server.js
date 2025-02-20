import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const chats = [
    {id: 123, messages: [{user: "Termi", message: "Hello"}, {user: "Jopek", message: "Siemano"}]},
    {id: 321, messages: [{user: "Termi", message: "Hello"}, {user: "Jopek", message: "Siemano"}]}
]

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    

    socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} dołączył do pokoju ${roomId}`);

        const chat = chats.find((chat) => chat.id == roomId);

          if (!chat) {
            chats.push({id: roomId, messages: []});
          }

        
    io.to(roomId).emit("reciveMessages", chat);
  });

    socket.on("sendMessage", ({ roomId, message, user }) => {
        const chat = chats.find((chat) => chat.id == roomId);

      

    

        chat.messages.push({user, message});
        io.to(roomId).emit("reciveMessages", chat);
    });


 
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      io.emit("userDisconnected", { id: socket.id });
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});