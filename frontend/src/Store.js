import { createContext, useReducer } from "react";

export const Store = createContext();
const initialState = {
  userInfo: localStorage.getItem("whatsAppUserInfo")
    ? JSON.parse(localStorage.getItem("whatsAppUserInfo"))
    : null,
  messages: localStorage.getItem("whatsAppMessages")
    ? JSON.parse(localStorage.getItem("whatsAppMessages"))
    : null,
};

function reducer(state, action) {
  switch (action.type) {
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
