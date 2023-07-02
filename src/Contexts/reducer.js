import React, { useReducer } from "react";

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

export const AuthReducer = (initialState, action) => {
  switch (action.type) {
    case "REQUEST_LOGIN":
      return {
        ...initialState,
        loading: true,
      };
    case "LOGIN_SUCCESS":
      return {
        ...initialState,
        user: action.payload.user,
        token: action.payload.access_token,
        refresh_token: action.payload.refresh_token,
        loading: false,
      };
    case "LOGOUT":
      return {
        ...initialState,
        user: "",
        token: "",
        refresh_token: "",
      };

    case "LOGIN_ERROR":
      return {
        ...initialState,
        loading: false,
        errorMessage: action.error,
      };
    case "CHECK_AUTHORIZATION":
      console.log(action);
      let currentPermissions = action.payload.current.authorization;
      currentPermissions = {
        ...currentPermissions,
        ...action.payload.permission,
      };
      console.log(currentPermissions);
      return {
        ...action.payload.current,
        authorization: currentPermissions,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
