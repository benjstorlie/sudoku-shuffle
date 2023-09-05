import React from "react";
import { Link } from "react-router-dom";

import Auth from "../../utils/auth";
import logo from "../../logo.svg";
import NewGame from "./NewGame";

export default function Header() {
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };
  return (
    <header className="bg-info text-dark mb-2 py-3">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-md-6 col-lg-4 d-flex align-items-end">
            <Link className="text-dark text-decoration-none me-3" to="/">
              <img src={logo} className="logo" alt="logo" />
            </Link>
            <Link className="text-dark text-decoration-none" to="/">
              <h1
                className="mb-0"
                style={{ fontSize: "3rem", fontFamily: "Black Ops One, cursive" }}
              >
                Sudoku
              </h1>
            </Link>
          </div>
          <div className="col-md-6 col-lg-8 mt-3 mt-md-0 d-flex justify-content-end align-items-end">
            <NewGame className={"mb-2 mx-2"}/>
            {Auth.loggedIn() ? (
              <>
                <Link className="btn btn-lg btn-primary m-2" to="/me">
                  View My Profile
                </Link>
                <button className="btn btn-lg btn-light m-2" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-lg btn-primary m-2" to="/login">
                  Login
                </Link>
                <Link className="btn btn-lg btn-light m-2" to="/signup">
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
