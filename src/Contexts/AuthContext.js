import React, { useReducer } from "react";
import { AuthReducer } from "./reducer";

const AuthStateContext = React.createContext();
const AuthDispatchContext = React.createContext();

let user = localStorage.getItem("currentUser")
  ? JSON.parse(localStorage.getItem("currentUser")).user
  : "";
let token = localStorage.getItem("access_token")
  ? localStorage.getItem("access_token")
  : "";
let refresh_token = localStorage.getItem("refresh_token")
  ? localStorage.getItem("refresh_token")
  : "";

export const initialState = {
  userDetails: "" || user,
  token: "" || token,
  refresh_token: "" || refresh_token,
  loading: false,
  errorMessage: null,
  authorization: {},
};

export function useAuthState() {
  const context = React.useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error("useAuthState must be used within a AuthProvider");
  }
  return context;
}

export function useAuthDispatch() {
  const context = React.useContext(AuthDispatchContext);
  if (context === undefined) {
    throw new Error("useAuthDispatch must be used within a AuthProvider");
  }
  return context;
}

export const AuthProvider = ({ children }) => {
  const [user, dispatch] = useReducer(AuthReducer, initialState);

  return (
    <AuthStateContext.Provider value={user}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};
