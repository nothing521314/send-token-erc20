import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Web3Provider } from "@ethersproject/providers";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Web3ReactProvider } from "@web3-react/core";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const getLibrary = (provider: any): Web3Provider => {
  const rpc = new Web3Provider(provider, "any");
  rpc.pollingInterval = 15000;
  return rpc;
};

root.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <App />
    </Web3ReactProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
