import http from "http";
import express from "express";
import path from "path";
import expressAsyncHandler from "express-async-handler";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./Models/userModel.js";
import { generateToken, isAuth } from "./utils.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.post(
  "/api/signup",
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      mobNo: req.body.signUpMobNo,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      mobNo: user.mobNo,
      token: generateToken(user),
    });
  })
);
app.post(
  "/api/login",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ mobNo: req.body.mobNo });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          mobNo: user.mobNo,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: "Invalid email or password" });
  })
);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});
const httpServer = http.Server(app);
const io = new Server(httpServer, { cors: { origin: "*" } });
io.on("connection", async (socket) => {
  socket.on("onLogin", async (user) => {
    const authorization = user.token;
    if (authorization) {
      const token = authorization.slice(9, authorization.length);
      jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
        if (err) {
          io.to(socket.id).emit("error", { message: "Invalid Token" });
        } else {
          if (decode) {
            const user = await User.findOne({ mobNo: decode.mobNo });
            if (user.socketId !== null) {
              // console.log(user.socketId, " double login");
              io.to(user.socketId).emit("doublelogin", { doublelogin: true });
            }
            user.socketId = socket.id;
            user.online = true;
            const messages = user.messages;
            const savedUser = await user.save();
            const users = await User.find({}, { _id: 0, mobNo: 1 });
            io.to(socket.id).emit("users", { users: users, messages });
            // console.log(user);
          }
        }
      });
    }
    // const users = await User.find();
    // console.log(users);
    // const existUser = users.find((x) => x.mobNo === updatedUser.mobNo);
    // if (existUser) {
    //   existUser.socketId = socket.id;
    //   existUser.online = true;
    // } else {
    //   users.push(updatedUser);
    // }
    // console.log(users);
  });
  socket.on("sendMessage", (data) => {
    console.log(data);
    //   const updateData = {
    //     ...data,
    //     time:
    //       new Date().getHours() +
    //       ":" +
    //       new Date().getMinutes() +
    //       " " +
    //       (new Date().getHours() < 12 ? "am" : "pm"),
    //   };
    //   const receiver = users.find((x) => x.mobNo === updateData.to);
    //   if (receiver) {
    //     // io.to(receiver.socketId).emit('updateUser', updateData);
    //   }
    //   // io.emit('message', (messages = [...messages, data]));
  });
  socket.on("disconnect", async () => {
    const users = await User.find();
    const user = users.find((x) => x.socketId === socket.id);
    if (user) {
      user.online = false;
      user.socketId = null;
      const savedUser = await user.save();
      console.log(savedUser);
    }
  });
});
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
