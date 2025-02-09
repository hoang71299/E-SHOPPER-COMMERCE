import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container text-center">
      <div className="logo-404">
        <a href="index.html">
          <img src="/frontend/images/home/logo.png" alt="" />
        </a>
      </div>
      <div className="content-404">
        <img src="/frontend/images/404/404.png" className="img-responsive" alt="" />
        <h1>
          <b>OPPS!</b> We Couldn’t Find this Page
        </h1>
        <p>
          Uh... So it looks like you brock something. The page you are looking
          for has up and Vanished.
        </p>
        <h2>
          <Link to="/">Bring me back Home</Link>
        </h2>
      </div>
    </div>
  );
}
