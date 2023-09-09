import express from "express";
import mongoose from "mongoose";
import cors from "cors";
const morgan = require("morgan");
import { readdirSync } from "fs";

require("dotenv").config();

const app = express();
//to add socket.io
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: "*",
  methods: ["get", "post"],
  allowedHeaders: ["Content-type"],
});

// db
mongoose
  .connect(process.env.DATABASE, {})
  .then(() => console.log("db ok"))
  .catch((err) => console.log("db err", err));

//middleware
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//autoload routes from routes folder
readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

//socket server, fro socker client you need socket.io-client

// io.on("connect", (socket) => {
//   //console.log("socker now ", socket.id);

//   //when receiving an emitted event called 'send-message'
//   socket.on("send-message", (message) => {
//     socket.broadcast.emit("received-message", message);
//     //the above will emit the received event to all clients except the client that created the emit event
//   });
// });

io.on("connect", (socket) => {
  socket.on("new-post", (newPost) => {
    console.log("received post!!");
    socket.broadcast.emit("new-post", newPost);
    console.log("sent post!!");
    //the above will emit the received event to all clients except the client that created the emit event
  });
});

const port = process.env.PORT || 8000;
http.listen(port, () => console.log(`running on ${port}`));
