import React, { useState } from "react";
import sonsonateLogo from "../assets/sonsonate-logo.svg";
import userAvatar from "../assets/user-avatar.svg";
import "../styles/Header.css";

const Header = ({ setCurrentPage }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleNavClick = (page) => {
    setCurrentPage(page);
    setMenuOpen(false);
  };

  const handleUserMenuClick = (action) => {
    if (action === "logout") {
      alert("Sesión cerrada");
    }
    setUserMenuOpen(false);
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
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("reports");
              }}
            >
              Reportes
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("requests");
              }}
            >
              Solicitudes
            </a>
          </li>
        </ul>
      </nav>
      <div className="user-info">
        <button 
          className="user-button"
          onClick={() => setUserMenuOpen(!userMenuOpen)}
        >
          <img src={userAvatar} alt="Avatar Usuario" className="user-avatar-img" />
        </button>
        {userMenuOpen && (
          <div className="user-dropdown">
            <a href="#" className="dropdown-item">
              👤 Usuario
            </a>
            <a href="#" className="dropdown-item">

              �🔐 Cambio de contraseña
            </a>
            <a 
              href="#" 
              className="dropdown-item logout"
              onClick={(e) => {
                e.preventDefault();
                handleUserMenuClick("logout");
              }}
            >
              🚪 Salir
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
