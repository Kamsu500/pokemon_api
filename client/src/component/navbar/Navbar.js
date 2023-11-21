import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  const hande_submit = async (e) => {
    e.preventDefault();

    return fetch("http://localhost:3000/dev/pokemon/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        console.log(response);
        if (response.ok) {
          console.log("json HubSpot has been saved");
        } else {
          console.log("failed");
        }
      })
      .catch(function (error) {
        console.log("error", error);
      });
  };
  return (
    <>
      <nav class="navbar navbar-expand-lg w-100" id="navbarcolor">
        <div class="container-fluid">
          <Link class="navbar-brand text-uppercase text-white" href="#">
            Pokedex
          </Link>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0"></ul>
            <form class="d-flex" role="search" onSubmit={hande_submit}>
              <button class="btn btn-outline-light" type="submit" id="btn">
                Send to Hubspot
              </button>
            </form>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
