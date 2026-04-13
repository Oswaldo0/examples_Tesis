import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import Students from "./pages/Students";
import Professors from "./pages/Professors";
import Reports from "./pages/Reports";
import Requests from "./pages/Requests";
import Maintenance from "./pages/Maintenance";
import MaintenanceBlank from "./pages/MaintenanceBlank";
import Users from "./pages/Users";

const PAGE_TO_PATH = {
  home: "/",
  students: "/estudiantes",
  professors: "/catedraticos",
  reports: "/reportes",
  requests: "/solicitudes",
  maintenance: "/mantenimiento",
  "maintenance-blank": "/mantenimiento/opciones",
  users: "/usuarios",
};

const PATH_TO_PAGE = {
  "/": "home",
  "/estudiantes": "students",
  "/catedraticos": "professors",
  "/reportes": "reports",
  "/solicitudes": "requests",
  "/mantenimiento": "maintenance",
  "/matenimiento": "maintenance",
  "/mantenimiento/opciones": "maintenance-blank",
  "/usuarios": "users",
};

const getPageFromPath = (path) => PATH_TO_PAGE[path] || "home";

function App() {
  const [currentPage, setCurrentPage] = useState(() =>
    getPageFromPath(window.location.pathname),
  );

  const navigateTo = (page) => {
    const path = PAGE_TO_PATH[page] || "/";
    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path);
    }
    setCurrentPage(page);
  };

  useEffect(() => {
    const onPopState = () => {
      setCurrentPage(getPageFromPath(window.location.pathname));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home />;
      case "students":
        return <Students setCurrentPage={navigateTo} />;
      case "professors":
        return <Professors />;
      case "reports":
        return <Reports />;
      case "requests":
        return <Requests />;
      case "maintenance":
        return <Maintenance setCurrentPage={navigateTo} />;
      case "maintenance-blank":
        return <MaintenanceBlank />;
      case "users":
        return <Users />;
      default:
        return <Home />;
    }
  };

  return (
    <>
      <Header setCurrentPage={navigateTo} />
      <div className="page-content">{renderPage()}</div>
    </>
  );
}

export default App;
