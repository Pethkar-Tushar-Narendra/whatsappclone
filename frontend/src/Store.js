import { createContext, useReducer } from "react";

export const Store = createContext();
const initialState = {
  userInfo: localStorage.getItem("whatsAppUserInfo")
    ? JSON.parse(localStorage.getItem("whatsAppUserInfo"))
    : null,
  messages: null,
  contactsInfo: localStorage.getItem("whatsAppUserContactsInfo")
    ? JSON.parse(localStorage.getItem("whatsAppUserContactsInfo"))
    : [],
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_CONTACTS":
      return { ...state, contactsInfo: action.payload };
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };
    case "USER_SIGNIN":
      return { ...state, userInfo: action.payload };
    case "USER_SIGNOUT":
      return { ...state, userInfo: null };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
