import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
const bodyScrollLock = require("body-scroll-lock");
const disableBodyScroll = bodyScrollLock.disableBodyScroll;
const targetElement = document.querySelector("#root");
disableBodyScroll(targetElement);

ReactDOM.render(<App />, document.getElementById("root"));
