import React from "react";
import "./DoubleWindowScreen.css";
const DoubleWindowScreen = () => {
  const refreshHandler = () => {
    window.location.reload();
  };
  return (
    <div className="windowContainer">
      <div className="smallContainer">
        <div className="text">
          WhatsApp is Open in another window. Click "Use Here" to Use WhatsApp
          in this window.
        </div>
        <div className="button">
          <button onClick={refreshHandler}>USE HERE</button>
        </div>
      </div>
    </div>
  );
};

export default DoubleWindowScreen;
