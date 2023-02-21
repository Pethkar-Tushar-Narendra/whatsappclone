import React from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { SlOptionsVertical } from "react-icons/sl";
import { VscSmiley } from "react-icons/vsc";
import { RiAttachment2 } from "react-icons/ri";
import { BsMic } from "react-icons/bs";
import { MdDoubleArrow } from "react-icons/md";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { BsPlusLg } from "react-icons/bs";
import Picker from "emoji-picker-react";
import StartScreen from "./StartScreen/StartScreen";

const MessageBox = ({
  msgHandler,
  setEmojiToggle,
  setMessage,
  message,
  emojiToggle,
  setIndex,
  setReactionToggle,
  index,
  reactionToggle,
  user,
  messageArray,
  uiMessagesRef,
  receiver,
  setEditMobileNumber,
  contactsInfo,
  OnlieStatus,
}) => {
  const receiverMessageArray = [];

  const onEmojiClick = (e) => {
    var str = (message + e.emoji).trim();
    setMessage(str);
    setEmojiToggle(false);
  };
  return (
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
                      ? contactsInfo.find((o) => o.mobNo === receiver).name
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
                      ? (new Date(receiverMessageArray[i].time).getDate() !==
                          new Date(
                            receiverMessageArray[i + 1].time
                          ).getDate() ||
                          new Date(receiverMessageArray[i].time).getMonth() !==
                            new Date(
                              receiverMessageArray[i + 1].time
                            ).getMonth() ||
                          new Date(
                            receiverMessageArray[i + 1].time
                          ).getFullYear() !==
                            new Date(
                              receiverMessageArray[i].time
                            ).getFullYear()) &&
                        new Date(receiverMessageArray[i + 1].time).getDate() +
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
                          <p className="messageBox-chat"> {item.message}</p>
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
                          <p className="messageBox-chat"> {item.message}</p>
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
            {/* {console.log(receiverMessageArray)} */}
            {emojiToggle && (
              <div className="picker">
                <Picker
                  pickerStyle={{ width: "100%" }}
                  onEmojiClick={onEmojiClick}
                />
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
  );
};

export default MessageBox;
