import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import "./UserList.css";
import socketIOClient from "socket.io-client";
import { Store } from "../../../Store";
import LoadingScreen from "../../LoadingScreen/LoadingScreen";
import DoubleWindowScreen from "../../DoubleWindowScreen/DoubleWindowScreen";
import InfoBox from "./InfoBox/InfoBox";
import MessageBox from "./MessageBox/MessageBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, messages: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const UserList = () => {
  const [{ loading, error, messages }, dispatch] = useReducer(reducer, {
    loading: true,
    messages: [],
    error: "",
  });
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const { mobNo } = userInfo;
  const messageArray = state.messages;
  const contactsInfo = state.contactsInfo;
  const user = mobNo;
  const uiMessagesRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [doublelogin, setDoublelogin] = useState(false);
  const [OnlieStatus, setOnlineStatus] = useState(false);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [receiver, setReceiver] = useState("");
  const [signoutToggle, setSignoutToggle] = useState(false);
  const [emojiToggle, setEmojiToggle] = useState(false);
  const [reactionToggle, setReactionToggle] = useState(false);
  const [messageArrayUnread, setMessageArrayUnread] = useState([]);
  const [index, setIndex] = useState(null);
  const [editMobileNumber, setEditMobileNumber] = useState(false);
  const [profileToggle, setProfileToggle] = useState(false);
  const ENDPOINT =
    window.location.host.indexOf("localhost") >= 0
      ? "http://127.0.0.1:4000"
      : window.location.host;
  useEffect(() => {
    dispatch({ type: "FETCH_REQUEST" });
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
        dispatch({ type: "FETCH_FAIL" });
      });
      socket.on("users", (data) => {
        setMessageArrayUnread(data.messages);
        console.log(data);
        dispatch({ type: "FETCH_SUCCESS", payload: data.users });
        ctxDispatch({ type: "SET_MESSAGES", payload: data.messages });
        localStorage.setItem("whatsAppMessages", JSON.stringify(data.messages));
      });
      socket.on("doublelogin", () => {
        setDoublelogin(true);
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
  return loading ? (
    <LoadingScreen />
  ) : error ? (
    <></>
  ) : (
    <div className="userlist-container">
      {doublelogin ? (
        <DoubleWindowScreen />
      ) : (
        <>
          <InfoBox
            setReceiver={setReceiver}
            receiver={receiver}
            socket={socket}
            messageArrayUnread={messageArrayUnread}
            messageArray={messageArray}
            user={user}
            setProfileToggle={setProfileToggle}
            messages={messages}
            ctxDispatch={ctxDispatch}
            contactsInfo={contactsInfo}
            editMobileNumber={editMobileNumber}
            setEditMobileNumber={setEditMobileNumber}
            profileToggle={profileToggle}
          />
          <MessageBox
            msgHandler={msgHandler}
            setEmojiToggle={setEmojiToggle}
            setMessage={setMessage}
            message={message}
            emojiToggle={emojiToggle}
            setIndex={setIndex}
            setReactionToggle={setReactionToggle}
            index={index}
            reactionToggle={reactionToggle}
            user={user}
            messageArray={messageArray}
            uiMessagesRef={uiMessagesRef}
            receiver={receiver}
            setEditMobileNumber={setEditMobileNumber}
            contactsInfo={contactsInfo}
            OnlieStatus={OnlieStatus}
          />
        </>
      )}
    </div>
  );
};

export default UserList;
