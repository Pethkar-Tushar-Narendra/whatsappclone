import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  mobNo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  online: { type: Boolean, default: true },
  socketId: { type: String },
  profilePic: { type: String },
  messages: [],
});

const User = mongoose.model("Users", userSchema);
export default User;
