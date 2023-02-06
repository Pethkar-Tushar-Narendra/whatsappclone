import React, { useContext, useState } from "react";
import "./ProfileEdit.css";
import { FaArrowLeft } from "react-icons/fa";
import { Store } from "../../../../../Store";
const ProfileEdit = ({ profileToggle, setProfileToggle, user }) => {
  return (
    <div
      className={profileToggle ? "profileContainer" : "profileContainer close"}
    >
      <div className="section1">
        <i className="closeButton">
          <FaArrowLeft
            className="icon"
            onClick={() => {
              setProfileToggle(!profileToggle);
            }}
          />
          <p>Profile</p>
        </i>
      </div>
      <div className="section2">
        <div
          className="profilePic"
          style={{
            backgroundImage:
              'url("https://res.cloudinary.com/dyrkmzn7t/image/upload/v1674060633/default_profile_pic_w4yn7a.png")',
          }}
        ></div>
        <div className="profileInfo">
          <div className="title">Mobile No.</div>
          <div className="mobNo">{user}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
