import React, { useState } from "react";
import sonsonateLogo from "../assets/uso-logo.jpg";
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

  const handleUserPageClick = (page) => {
    setCurrentPage(page);
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
                handleNavClick("users");
              }}
            >
              Usuarios
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
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("maintenance");
              }}
            >
              Mantenimiento
            </a>
          </li>
        </ul>
      </nav>
      <div className="user-info">
        <button
          className="user-button"
          onClick={() => setUserMenuOpen(!userMenuOpen)}
        >
          <img
            src={userAvatar}
            alt="Avatar Usuario"
            className="user-avatar-img"
          />
        </button>
        {userMenuOpen && (
          <div className="user-dropdown">
            <a href="#" className="dropdown-item">
              👤 Usuario
            </a>
            <a href="#" className="dropdown-item">
              Cambio de contraseña
            </a>
            <a
              href="#"
              className="dropdown-item"
              onClick={(e) => {
                e.preventDefault();
                handleUserPageClick("users");
              }}
            >
              👥 Usuarios
            </a>
            <a
              href="#"
              className="dropdown-item logout"
              onClick={(e) => {
                e.preventDefault();
                handleUserMenuClick("logout");
              }}
            >
              Salir
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
