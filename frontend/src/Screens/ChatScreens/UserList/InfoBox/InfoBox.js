import React, { useContext, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { MdGroups } from "react-icons/md";
import { SlOptionsVertical } from "react-icons/sl";
import { BsChatLeftTextFill } from "react-icons/bs";
import { BiLoaderCircle } from "react-icons/bi";
import { FiMenu } from "react-icons/fi";
import { BiSearchAlt2 } from "react-icons/bi";
import NumberEdit from "./EditScreens/NumberEditScreen/NumberEdit";
import ProfileEdit from "./EditScreens/ProfileEditScreen/ProfileEdit";

const InfoBox = ({
  setReceiver,
  receiver,
  socket,
  messageArrayUnread,
  messageArray,
  user,
  setProfileToggle,
  messages,
  ctxDispatch,
  editMobileNumber,
  setEditMobileNumber,
  profileToggle,
  contactsInfo,
}) => {
  const [signoutToggle, setSignoutToggle] = useState(false);
  const [query, setQuery] = useState("");
  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("whatsAppUserInfo");
  };
  return (
    <div className="infoBox">
      <NumberEdit
        editMobileNumber={editMobileNumber}
        setEditMobileNumber={setEditMobileNumber}
        receiver={receiver}
      />
      <ProfileEdit
        profileToggle={profileToggle}
        setProfileToggle={setProfileToggle}
        user={user}
      />
      <div className="credentials">
        <div
          className="prof-pic"
          style={{
            backgroundImage: `url("https://res.cloudinary.com/dyrkmzn7t/image/upload/v1674060633/default_profile_pic_w4yn7a.png")`,
          }}
          onClick={() => {
            setProfileToggle(true);
          }}
        ></div>
        <div className="icon-container">
          <MdGroups className="icon" />
          <BiLoaderCircle className="icon" />
          <BsChatLeftTextFill className="icon" />
          <SlOptionsVertical
            className="icon"
            onClick={() => {
              setSignoutToggle(!signoutToggle);
            }}
          />
          <button
            className="btn signout-btn"
            onClick={signoutHandler}
            style={{ display: signoutToggle ? "flex" : "none" }}
          >
            Signout
          </button>
        </div>
      </div>
      <div className="searchbar">
        <div className="search">
          <input
            type="text"
            placeholder="Search or start new chat"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
          <FiMenu className="icon1" />
          <BiSearchAlt2 className="icon" />
        </div>
      </div>
      <div className="userlist">
        {messages
          .sort((item, i) => {
            for (const j of contactsInfo) {
              if (j.mobNo === item.mobNo) {
                return -1;
              }
            }
            return 1;
          })
          .filter((item, i) => {
            var boolean = false;
            for (var j of contactsInfo) {
              if (j.mobNo === item.mobNo) {
                boolean = j.name.toUpperCase().includes(query.toUpperCase());
              }
            }
            return (
              (boolean || item.mobNo.includes(query.trim())) &&
              item.mobNo !== user
            );
          })
          .map((item, i) => {
            const unreadMessages = messageArray.reduce((a, c) => {
              if (c.from === item.mobNo && c.read === false) {
                a = a + 1;
              }
              return a;
            }, 0);
            var lastMessageArray = "";
            for (let index = messageArray.length - 1; index >= 0; index--) {
              if (
                messageArray[index].to === item.mobNo ||
                messageArray[index].from === item.mobNo
              ) {
                lastMessageArray = messageArray[index];
                break;
              }
            }
            const timeShow = new Date(lastMessageArray.time);
            const contact = contactsInfo.find((o) => o.mobNo === item.mobNo);
            return (
              <div
                className="userBox"
                key={i}
                onClick={() => {
                  setReceiver(item.mobNo);
                  socket.emit("onlinestatusReq", item.mobNo);
                  for (const j in messageArray) {
                    if (messageArray[j].from === item.mobNo) {
                      messageArray[j] = { ...messageArray[j], read: true };
                    }
                  }
                  socket.emit("updateReadedMessage", {
                    message: messageArray,
                    user: user,
                  });
                }}
                style={{
                  backgroundColor: receiver === item.mobNo && "#eaeee6",
                }}
              >
                <div
                  className="img"
                  style={{
                    backgroundImage: `url(https://res.cloudinary.com/dyrkmzn7t/image/upload/v1664615088/xqsbp7cvdhwjj5lhqpt7.jpg)`,
                  }}
                ></div>
                <div className="box">
                  <div className="name">
                    <h4>{contact ? contact.name : item.mobNo}</h4>
                  </div>
                  <div className="msg-overview">
                    <p>
                      {lastMessageArray
                        ? lastMessageArray.message
                        : "♦ Waiting for message"}
                    </p>
                    <div className="endBox">
                      <div
                        className="unreadBlock"
                        style={{
                          display: unreadMessages > 0 ? "flex" : "none",
                        }}
                      >
                        {unreadMessages}
                      </div>
                      <div className="arrow">
                        <IoIosArrowDown />
                      </div>
                    </div>
                  </div>
                  <p className="timeShow">
                    {lastMessageArray.time &&
                      (new Date().getDate() +
                        "/" +
                        (new Date().getMonth() + 1) +
                        "/" +
                        new Date().getFullYear() ===
                      new Date(lastMessageArray.time).getDate() +
                        "/" +
                        (new Date(lastMessageArray.time).getMonth() + 1) +
                        "/" +
                        new Date(lastMessageArray.time).getFullYear()
                        ? ((timeShow.getHours() < 12
                            ? timeShow.getHours()
                            : timeShow.getHours() - 12) === 0
                            ? 12
                            : timeShow.getHours() < 12
                            ? timeShow.getHours()
                            : timeShow.getHours() - 12) +
                          ":" +
                          timeShow.getMinutes() +
                          " " +
                          (timeShow.getHours() < 12 ? "am" : "pm")
                        : timeShow.getDate() +
                          "/" +
                          (timeShow.getMonth() + 1) +
                          "/" +
                          timeShow.getFullYear())}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default InfoBox;
