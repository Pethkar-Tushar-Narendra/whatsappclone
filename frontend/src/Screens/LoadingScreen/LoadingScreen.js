import React, { useState } from "react";
import "./LoadingScreen.css";
import { ImWhatsapp } from "react-icons/im";
import { BsLockFill } from "react-icons/bs";
const LoadingScreen = () => {
  return (
    <div className="loadingScreenContainer">
      <div className="smallContainer">
        <ImWhatsapp className="icon" />
        <div className="loading">
          <div className="line" style={{ width: "100%" }}></div>
        </div>
        <div className="text">
          <h3 className="heading">WhatsApp</h3>
          <p className="insideText">
            <BsLockFill />
            End to end encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
