import React, { useState } from "react";
import sonsonateLogo from "../assets/sonsonate-logo.svg";
import "../styles/Header.css";

const Header = ({ setCurrentPage }) => {
  const [user] = useState("Juan Pérez"); // Usuario logueado (ejemplo)
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = (page) => {
    setCurrentPage(page);
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="brand">
        <img
          src={sonsonateLogo}
          alt="Logo Universidad Sonsonate"
          className="brand-logo"
        />
        <h1>Universidad de Sonsonate</h1>
      </div>
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>
      <nav>
        <ul className={`menu ${menuOpen ? "open" : ""}`}>
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("home");
              }}
            >
              Inicio
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("students");
              }}
            >
              Estudiantes
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("professors");
              }}
            >
              Catedráticos
            </a>
          </li>
        </ul>
      </nav>
      <div className="user-info">
        <button className="user-button">Usuario: {user}</button>
      </div>
    </header>
  );
};

export default Header;
