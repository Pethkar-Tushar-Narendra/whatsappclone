import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatScreen.css";
import UserList from "./UserList/UserList";
const ChatScreen = () => {
  const navigate = useNavigate();
  useEffect(() => {
    window.screen.width < 850 && navigate("/");
  }, []);
  return (
    <div className="homepage-container">
      <div className="chatBox">
        <UserList />
        {/* <MobileScreen /> */}
      </div>
    </div>
  );
};

export default ChatScreen;
