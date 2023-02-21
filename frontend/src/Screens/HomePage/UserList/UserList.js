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
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import { BsPlusLg } from "react-icons/bs";
import { Store } from "../../../Store";
import NumberEdit from "./EditScreens/NumberEditScreen/NumberEdit";
import Picker from "emoji-picker-react";
import ProfileEdit from "./EditScreens/ProfileEditScreen/ProfileEdit";
// import LoadingScreen from "./LoadingScreen/LoadingScreen";
import StartScreen from "./StartScreen/StartScreen";
import DoubleWindowScreen from "../DoubleWindowScreen/DoubleWindowScreen";
const UserList = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const { mobNo } = userInfo;
  const messageArray = state.messages;
  const contactsInfo = state.contactsInfo;
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
  const [doublelogin, setDoublelogin] = useState(false);
  const [OnlieStatus, setOnlineStatus] = useState(false);
  const [signoutToggle, setSignoutToggle] = useState(false);
  const [emojiToggle, setEmojiToggle] = useState(false);
  const [reactionToggle, setReactionToggle] = useState(false);
  const [messageArrayUnread, setMessageArrayUnread] = useState([]);
  const [index, setIndex] = useState(null);
  const [editMobileNumber, setEditMobileNumber] = useState(false);
  const [profileToggle, setProfileToggle] = useState(false);
  // console.log(window.screen.width);
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
        setMessageArrayUnread(data.messages);
        setMessages(data.users);
        ctxDispatch({ type: "SET_MESSAGES", payload: data.messages });
        localStorage.setItem("whatsAppMessages", JSON.stringify(data.messages));
      });
      socket.on("doublelogin", () => {
        // setDoublelogin(true);
      });
      socket.on("receiveMsg", (data) => {
        ctxDispatch({ type: "SET_MESSAGES", payload: data });
      });
      socket.on("checkOnlineRes", (data) => {
        setOnlineStatus(data);
      });
    }
  }, [socket, user, ENDPOINT, userInfo, ctxDispatch, contactsInfo]);
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
  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("whatsAppUserInfo");
  };
  const receiverMessageArray = [];
  // console.log(receiverMessageArray);
  return (
    <div className="userlist-container">
      {/* <LoadingScreen /> */}

      {doublelogin ? (
        <DoubleWindowScreen />
      ) : (
        <>
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
                  backgroundImage: `url("https://res.cloudinary.com/dyrkmzn7t/image/upload/v1663743090/cld-sample-2.jpg")`,
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
                .filter((item, i) => {
                  var boolean = false;
                  for (var j of contactsInfo) {
                    if (j.mobNo === item.mobNo) {
                      boolean = j.name
                        .toUpperCase()
                        .includes(query.toUpperCase());
                    }
                  }
                  return (
                    (boolean || item.mobNo.includes(query.trim())) &&
                    item.mobNo !== user
                  );
                })
                .map((item, i) => {
                  var lastMessageArray = "";
                  for (
                    let index = messageArray.length - 1;
                    index >= 0;
                    index--
                  ) {
                    if (
                      messageArray[index].to === item.mobNo ||
                      messageArray[index].from === item.mobNo
                    ) {
                      lastMessageArray = messageArray[index];
                      break;
                    }
                  }
                  const timeShow = new Date(lastMessageArray.time);
                  const contact = contactsInfo.find(
                    (o) => o.mobNo === item.mobNo
                  );
                  const unreadMessages = messageArrayUnread.reduce((a, c) => {
                    if (c.to === item.mobNo && c.read === false) {
                      a = a + 1;
                    }
                    return a;
                  }, 0);
                  return (
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
          <div className="messageBox">
            <div className="shade">
              {receiver ? (
                <>
                  <div className="credentials">
                    <div
                      className="name"
                      onClick={() => {
                        setEditMobileNumber(true);
                      }}
                    >
                      <div
                        className="img"
                        style={{
                          backgroundImage: `url("https://res.cloudinary.com/dyrkmzn7t/image/upload/v1664615088/xqsbp7cvdhwjj5lhqpt7.jpg")`,
                        }}
                      ></div>
                      <div className="cred-box">
                        <h4>
                          {contactsInfo.find((o) => o.mobNo === receiver)
                            ? contactsInfo.find((o) => o.mobNo === receiver)
                                .name
                            : receiver}
                        </h4>
                        <p>{OnlieStatus ? "online" : "offline"}</p>
                      </div>
                    </div>
                    <div className="options">
                      <BiSearchAlt2 className="icon" />
                      <SlOptionsVertical
                        className="icon"
                        onClick={() => {
                          setEditMobileNumber(true);
                        }}
                      />
                    </div>
                  </div>
                  <div className="mesBox" ref={uiMessagesRef}>
                    {messageArray
                      .filter((item, i) => {
                        if (item.to === receiver || item.from === receiver) {
                          if (item.to === receiver) {
                            messageArray[i].read = true;
                            item.read = true;
                          }
                          receiverMessageArray.push(item);
                        }
                        return item.to === receiver || item.from === receiver;
                      })
                      .map((item, i) => {
                        const date = new Date(item.time);
                        const showDate =
                          receiverMessageArray[i + 1] &&
                          (receiverMessageArray[i + 1] || i === 0)
                            ? (new Date(
                                receiverMessageArray[i].time
                              ).getDate() !==
                                new Date(
                                  receiverMessageArray[i + 1].time
                                ).getDate() ||
                                new Date(
                                  receiverMessageArray[i].time
                                ).getMonth() !==
                                  new Date(
                                    receiverMessageArray[i + 1].time
                                  ).getMonth() ||
                                new Date(
                                  receiverMessageArray[i + 1].time
                                ).getFullYear() !==
                                  new Date(
                                    receiverMessageArray[i].time
                                  ).getFullYear()) &&
                              new Date(
                                receiverMessageArray[i + 1].time
                              ).getDate() +
                                "/" +
                                (new Date(
                                  receiverMessageArray[i + 1].time
                                ).getMonth() +
                                  1) +
                                "/" +
                                new Date(
                                  receiverMessageArray[i + 1].time
                                ).getFullYear()
                            : null;
                        return item.from === user ? (
                          <div key={i}>
                            {i === 0 && (
                              <div className="dateShower">
                                <p className="dateBox">
                                  {receiverMessageArray[i]
                                    ? new Date(
                                        receiverMessageArray[i].time
                                      ).getDate() +
                                      "/" +
                                      (new Date(
                                        receiverMessageArray[i].time
                                      ).getMonth() +
                                        1) +
                                      "/" +
                                      new Date(
                                        receiverMessageArray[i].time
                                      ).getFullYear()
                                    : ""}
                                </p>
                              </div>
                            )}
                            <div className="msgBox2">
                              <div className="msg2">
                                <div
                                  className={
                                    reactionToggle && index === i
                                      ? "emojiPicker"
                                      : "emojiPicker close"
                                  }
                                >
                                  <span>👍</span>
                                  <span>❤️</span>
                                  <span>🤣</span>
                                  <span>😮</span>
                                  <span>😢</span>
                                  <span>🙏</span>
                                  <i className="iconBox">
                                    <BsPlusLg className="icon" />
                                  </i>
                                </div>
                                <div
                                  className="reactionBox"
                                  onClick={() => {
                                    if (i === index) {
                                      setReactionToggle(!reactionToggle);
                                      setIndex(i);
                                    } else {
                                      setReactionToggle(true);
                                      setIndex(i);
                                    }
                                  }}
                                >
                                  <HiOutlineEmojiHappy className="icon" />
                                </div>
                                <p className="messageBox-chat">
                                  {" "}
                                  {item.message}
                                </p>
                                <p className="time">
                                  {item.time &&
                                    (date.getHours() < 12
                                      ? date.getHours() === 0
                                        ? 12
                                        : date.getHours()
                                      : date.getHours() - 12 === 0
                                      ? 12
                                      : date.getHours() - 12) +
                                      ":" +
                                      date.getMinutes() +
                                      " " +
                                      (date.getHours() < 12 ? "am" : "pm")}
                                </p>
                              </div>
                            </div>
                            {showDate && (
                              <div className="dateShower">
                                <p className="dateBox">{showDate}</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div key={i}>
                            <div
                              className="dateShower"
                              style={{ display: i === 0 ? "flex" : "none" }}
                            >
                              <p className="dateBox">
                                {receiverMessageArray[i + 1]
                                  ? new Date(
                                      receiverMessageArray[i + 1].time
                                    ).getDate() +
                                    "/" +
                                    (new Date(
                                      receiverMessageArray[i + 1].time
                                    ).getMonth() +
                                      1) +
                                    "/" +
                                    new Date(
                                      receiverMessageArray[i + 1].time
                                    ).getFullYear()
                                  : ""}
                              </p>
                            </div>
                            <div className="messsageBox">
                              <div className="msg">
                                <div
                                  className={
                                    reactionToggle && index === i
                                      ? "emojiPicker"
                                      : "emojiPicker close"
                                  }
                                >
                                  <span>👍</span>
                                  <span>❤️</span>
                                  <span>🤣</span>
                                  <span>😮</span>
                                  <span>😢</span>
                                  <span>🙏</span>
                                  <i className="iconBox">
                                    <BsPlusLg className="icon" />
                                  </i>
                                </div>
                                <div
                                  className="reactionBox"
                                  onClick={() => {
                                    if (i === index) {
                                      setReactionToggle(!reactionToggle);
                                      setIndex(i);
                                    } else {
                                      setReactionToggle(true);
                                      setIndex(i);
                                    }
                                  }}
                                >
                                  <HiOutlineEmojiHappy className="icon" />
                                </div>
                                <p className="messageBox-chat">
                                  {" "}
                                  {item.message}
                                </p>
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
                              </div>
                            </div>
                            <div
                              className="dateShower"
                              style={{ display: showDate ? "flex" : "none" }}
                            >
                              <p className="dateBox">{showDate}</p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  {console.log(receiverMessageArray)}
                  {emojiToggle && (
                    <div className="picker">
                      <Picker pickerStyle={{ width: "100%" }} />
                    </div>
                  )}
                  <div className="user-input">
                    <VscSmiley
                      className="icon"
                      onClick={() => {
                        setEmojiToggle(!emojiToggle);
                      }}
                    />
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
              ) : (
                <StartScreen />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserList;
