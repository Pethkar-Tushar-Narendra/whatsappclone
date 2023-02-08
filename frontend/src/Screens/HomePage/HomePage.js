import React, { useContext } from "react";
import { Store } from "../../Store";
import "./HomePage.css";
import MobileScreen from "./MobileScree/MobileScreen";
import UserList from "./UserList/UserList";
const HomePage = () => {
  const { dispatch: ctxDispatch } = useContext(Store);
  return (
    <div className="homepage-container">
      <div className="chatBox">
        <UserList />
        {/* <MobileScreen /> */}
      </div>
    </div>
  );
};

export default HomePage;
