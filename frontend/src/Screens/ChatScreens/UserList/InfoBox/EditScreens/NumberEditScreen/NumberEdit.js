import React, { useContext, useState } from "react";
import "./NumberEdit.css";
import { FaArrowLeft } from "react-icons/fa";
import { Store } from "../../../../../../Store";
const NumberEdit = ({ editMobileNumber, setEditMobileNumber, receiver }) => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { contactsInfo } = state;
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const submitHandler = (e) => {
    e.preventDefault();
    if (name.length <= 15) {
      const nameObj = contactsInfo.find((item, i) => item.name === name);
      if (nameObj) {
        setNameError(true);
      } else if (name.length > 0) {
        const objArray = { mobNo: receiver, name: name.trim() };
        const obj = contactsInfo.find(
          (item, i) => item.mobNo === objArray.mobNo
        );
        if (obj) {
          contactsInfo[contactsInfo.indexOf(obj)] = objArray;
        } else {
          contactsInfo.push(objArray);
        }
        ctxDispatch({ type: "SET_CONTACTS", payload: contactsInfo });
        localStorage.setItem(
          "whatsAppUserContactsInfo",
          JSON.stringify(contactsInfo)
        );
        setEditMobileNumber(false);
        setNameError(false);
        setName("");
      }
    }
  };
  const deleteHandler = () => {
    const nameObj = contactsInfo.find((item, i) => item.mobNo === receiver);
    contactsInfo.splice(contactsInfo.indexOf(nameObj), 1);
    ctxDispatch({ type: "SET_CONTACTS", payload: contactsInfo });
    localStorage.setItem(
      "whatsAppUserContactsInfo",
      JSON.stringify(contactsInfo)
    );
    setEditMobileNumber(false);
    setNameError(false);
    setName("");
  };
  return (
    <div
      className={
        editMobileNumber ? "numberEditContainer" : "numberEditContainer close"
      }
    >
      <div className="section1">
        <i className="closeButton">
          <FaArrowLeft
            className="icon"
            onClick={() => {
              setEditMobileNumber(!editMobileNumber);
              setNameError(false);
            }}
          />
          <p>Save Mobile Number</p>
        </i>
      </div>
      <div className="section2">
        <form onSubmit={submitHandler}>
          <label>Mobile Number</label>
          <input type="text" value={receiver} disabled className="label" />
          <label>Contact Name</label>
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            // placeholder={}
          />
          <p
            style={{
              color: "red",
              display: name.length > 15 ? "flex" : "none",
            }}
          >
            Name should be less than 15 character
          </p>
          <p
            style={{
              color: "red",
              display: nameError ? "flex" : "none",
            }}
          >
            Same name is saved for other user
          </p>
          <div className="btnClass">
            <button type="submit">Save</button>
            <button style={{ backgroundColor: "red" }} onClick={deleteHandler}>
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NumberEdit;
