
// import type { NextApiRequest, NextApiResponse } from "next";
// import { Server as NetServer } from "http";
// import { Server as SocketIOServer } from "socket.io";
// import jwt from "jsonwebtoken";
// import { prisma } from "@/app/lib/prisma"; // dopasuj ścieżkę do swojego klienta Prisma

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// type UserPayload = {
//   id: string;
//   email: string;
// };

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (!(res.socket as any).server.io) {
//     console.log("🔌 Socket.IO server init");

//     const httpServer: NetServer = (res.socket as any).server;
//     const io = new SocketIOServer(httpServer, {
//       path: "/api/socket",
//       addTrailingSlash: false,
//     });

//     io.on("connection", (socket) => {
//       console.log("🟢 Client connected:", socket.id);

//       socket.on("chatMessage", async (msg) => {
//         let username = "Anonim";

//         try {
//           // pobieramy token z cookie w handshake
//           const cookieHeader = socket.handshake.headers.cookie || "";
//           const token = cookieHeader
//             .split(";")
//             .find((c) => c.trim().startsWith("token="))
//             ?.split("=")[1];

//           if (token) {
//             const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
//             const user = await prisma.user.findUnique({
//               where: { id: decoded.id },
//               select: { username: true },
//             });
//             if (user?.username) username = user.username;
//           }
//         } catch (err) {
//           console.log("⚠️ Niepoprawny token przy wysyłaniu wiadomości");
//         }

//         // wysyłamy wiadomość z nazwą użytkownika
//         io.emit("chatMessage", { user: username, message: msg });
//       });

//       socket.on("disconnect", () => {
//         console.log("🔴 Client disconnected:", socket.id);
//       });
//     });

//     (res.socket as any).server.io = io;
//   }

//   res.end();
// }
import type { NextApiRequest, NextApiResponse } from "next";
import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import jwt from "jsonwebtoken";
import { prisma } from "@/app/lib/prisma";

export const config = {
  api: {
    bodyParser: false,
  },
};

type UserPayload = {
  id: string;
  email: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(res.socket as any).server.io) {
    console.log("🔌 Socket.IO server init");

    const httpServer: NetServer = (res.socket as any).server;
    const io = new SocketIOServer(httpServer, {
      path: "/api/socket",
      addTrailingSlash: false,
    });

    io.on("connection", (socket) => {
      console.log("🟢 Client connected:", socket.id);

      socket.on("chatMessage", async (text: string) => {
        let username = "Anonim";

        try {
          const cookieHeader = socket.handshake.headers.cookie || "";
          const token = cookieHeader
            .split(";")
            .find((c) => c.trim().startsWith("token="))
            ?.split("=")[1];

          if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
            const user = await prisma.user.findUnique({
              where: { id: decoded.id },
              select: { username: true },
            });
            if (user?.username) username = user.username;
          }
        } catch {
          console.log("⚠️ Niepoprawny token przy wysyłaniu wiadomości");
        }

        // Wysyłamy w formacie { user, text }
        io.emit("chatMessage", { user: username, text });
      });

      socket.on("disconnect", () => {
        console.log("🔴 Client disconnected:", socket.id);
      });
    });

    (res.socket as any).server.io = io;
  }

  res.end();
}
