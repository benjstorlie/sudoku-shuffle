import React from "react";
import { Link } from "react-router-dom";
import "../../index.css";

import Auth from "../../utils/auth";
import NewGame from "./NewGame";

export default function Header() {
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };
  return (
    <header className="">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 col-lg-4 d-flex align-items-center">
            <Link className="text-dark text-decoration-none me-3" to="/"></Link>
            <Link className="text-dark text-decoration-none" to="/">
              <h1
                className="mb-0"
                style={{
                  fontSize: "4rem",
                  fontFamily: "Black Ops One",
                  background: "gray",
                  borderRadius: "10px",
                  border: "3px solid black",
                }}
              >
                Sudoku
                <br />
                Shuffle
              </h1>
              <br />
              <div className="col-3">
                <NewGame className={"mb-2 mx-2"} />
              </div>
            </Link>
          </div>
          <div className="col-md-6 col-lg-8 mt-3 mt-md-0 d-flex justify-content-end">
            {Auth.loggedIn() ? (
              <>
                <Link
                  className="btn btn-lg btn-secondary m-2 border-white"
                  to="/me"
                >
                  View My Profile
                </Link>
                <button
                  className="btn btn-lg btn-light border-black m-2"
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  className="btn btn-lg btn-secondary border-white m-2 "
                  to="/login"
                >
                  Login
                </Link>
                <Link
                  className="btn btn-lg btn-light border-black m-2"
                  to="/signup"
                >
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
