import React from "react";
import "./StartScreen.css";
import { BsLockFill } from "react-icons/bs";
const StartScreen = () => {
  return (
    <div className="startScreenContainer">
      <div className="smallContainer">
        <div className="image"></div>
        <div className="text1">
          <div>WhatsApp Web</div>
          <p>
            Send and receive messages without keeping your phone online.
            <br />
            Use WhatsApp on up to 4 linked devices and 1 phone at same time
          </p>
        </div>
        <p className="text2">
          <BsLockFill />
          End to end encrypted
        </p>
      </div>
      <div className="line"></div>
    </div>
  );
};

export default StartScreen;
