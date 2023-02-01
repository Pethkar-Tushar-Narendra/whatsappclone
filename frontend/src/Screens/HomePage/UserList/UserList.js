import React, { useContext, useEffect, useRef, useState } from "react";
import "./UserList.css";
import { BiSearchAlt2 } from "react-icons/bi";
import { MdGroups } from "react-icons/md";
import { SlOptionsVertical } from "react-icons/sl";
import { BsChatLeftTextFill } from "react-icons/bs";
import { BiLoaderCircle } from "react-icons/bi";
import { FiMenu } from "react-icons/fi";
import socketIOClient from "socket.io-client";
import { VscSmiley } from "react-icons/vsc";
import { RiAttachment2 } from "react-icons/ri";
import { BsMic } from "react-icons/bs";
import { MdDoubleArrow } from "react-icons/md";
import { Store } from "../../../Store";
const UserList = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const { mobNo } = userInfo;
  const messageArray = state.messages;
  const user = mobNo;
  const uiMessagesRef = useRef(null);
  const ENDPOINT =
    window.location.host.indexOf("localhost") >= 0
      ? "http://127.0.0.1:4000"
      : window.location.host;
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [receiver, setReceiver] = useState("");
  const [socket, setSocket] = useState(null);
  // const [messageArray, setMessageArray] = useState(msg);
  const [doublelogin, setDoublelogin] = useState(true);
  const [OnlieStatus, setOnlineStatus] = useState(false);
  useEffect(() => {
    if (!socket) {
      const sk = socketIOClient(ENDPOINT);
      setSocket(sk);
    } else {
      socket.emit("onLogin", {
        mobNo: user,
        token: "something" + userInfo.token,
      });
      socket.on("error", (err) => {
        console.log(err);
      });
      socket.on("users", (data) => {
        // console.log(data.messages);
        setMessages(data.users);
        ctxDispatch({ type: "SET_MESSAGES", payload: data.messages });
        localStorage.setItem("whatsAppMessages", JSON.stringify(data.messages));
      });
      socket.on("doublelogin", () => {
        setDoublelogin(false);
        // console.log("doublelogin");
      });
      socket.on("receiveMsg", (data) => {
        ctxDispatch({ type: "SET_MESSAGES", payload: data });
        // localStorage.setItem("whatsAppMessages", JSON.stringify(data));
      });
      socket.on("checkOnlineRes", (data) => {
        setOnlineStatus(data);
      });
      // socket.on('updateUser', (data) => {
      //   const temp = messageArray;
      //   temp.push(data);
      //   setMessageArray(temp);
      // });
    }
  }, [socket, user, ENDPOINT, userInfo, ctxDispatch]);
  useEffect(() => {
    if (uiMessagesRef.current) {
      uiMessagesRef.current.scrollBy({
        top: uiMessagesRef.current.scrollHeight,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [messageArray, receiver]);
  const msgHandler = (e) => {
    e.preventDefault();
    try {
      socket.emit("onlinestatusReq", receiver);
      socket.emit("sendMessage", {
        from: user,
        to: receiver,
        message,
      });
      setMessage("");
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <div className="userlist-container">
      {doublelogin && (
        <>
          {" "}
          <div className="infoBox">
            <div className="credentials">
              <div
                className="prof-pic"
                style={{
                  backgroundImage: `url("https://res.cloudinary.com/dyrkmzn7t/image/upload/v1674060633/default_profile_pic_w4yn7a.png")`,
                }}
              ></div>
              <div className="icon-container">
                <MdGroups className="icon" />
                <BiLoaderCircle className="icon" />
                <BsChatLeftTextFill className="icon" />
                <SlOptionsVertical className="icon" />
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
                .filter(
                  (item, i) =>
                    item.mobNo.includes(query.trim()) && item.mobNo !== user
                )
                .map((item, i) => (
                  <div
                    className="userBox"
                    key={i}
                    onClick={() => {
                      setReceiver(item.mobNo);
                      socket.emit("onlinestatusReq", item.mobNo);
                    }}
                    style={{
                      backgroundColor: receiver === item.mobNo && "#eaeee6",
                    }}
                  >
                    <div
                      className="img"
                      style={{
                        backgroundImage: `url(https://res.cloudinary.com/dyrkmzn7t/image/upload/v1674060633/default_profile_pic_w4yn7a.png)`,
                      }}
                    ></div>
                    <div className="box">
                      <div className="name">
                        <h4>{item.mobNo}</h4>
                      </div>
                      <div className="msg-overview">
                        <p>Hello</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="messageBox">
            {receiver && (
              <>
                <div className="credentials">
                  <div className="name">
                    <div
                      className="img"
                      style={{
                        backgroundImage: `url("https://res.cloudinary.com/dyrkmzn7t/image/upload/v1674060633/default_profile_pic_w4yn7a.png")`,
                      }}
                    ></div>
                    <div className="cred-box">
                      <h4>{receiver}</h4>
                      <p>{OnlieStatus ? "online" : "offline"}</p>
                    </div>
                  </div>
                  <div className="options">
                    <BiSearchAlt2 className="icon" />
                    <SlOptionsVertical className="icon" />
                  </div>
                </div>
                <div className="mesBox" ref={uiMessagesRef}>
                  {messageArray?.map((item, i) => {
                    const date = new Date(item.time);

                    return item.from === user ? (
                      <div key={i} className="msgBox2">
                        <div className="msg2">
                          <p> {item.message}</p>
                          <p className="time">
                            {item.time &&
                              (date.getHours() < 12
                                ? date.getHours()
                                : date.getHours() - 12) +
                                ":" +
                                date.getMinutes() +
                                " " +
                                (date.getHours() < 12 ? "am" : "pm")}
                          </p>
                          <div className="corner"></div>
                        </div>
                      </div>
                    ) : (
                      <div key={i} className="msg">
                        <p> {item.message}</p>
                        <p className="time">
                          {item.time &&
                            (date.getHours() < 12
                              ? date.getHours()
                              : date.getHours() - 12) +
                              ":" +
                              date.getMinutes() +
                              " " +
                              (date.getHours() < 12 ? "am" : "pm")}
                        </p>
                        <div className="corner"></div>
                      </div>
                    );
                  })}
                </div>
                <div className="user-input">
                  <VscSmiley className="icon" />
                  <RiAttachment2 className="icon" />
                  <input
                    type="text"
                    placeholder="Type a message"
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                    }}
                  />
                  {message ? (
                    <MdDoubleArrow className="icon1" onClick={msgHandler} />
                  ) : (
                    <BsMic className="icon" />
                  )}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UserList;
