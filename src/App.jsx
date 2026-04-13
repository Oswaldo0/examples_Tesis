import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import Students from "./pages/Students";
import Professors from "./pages/Professors";
import Reports from "./pages/Reports";
import Requests from "./pages/Requests";
import Maintenance from "./pages/Maintenance";
import MaintenanceBlank from "./pages/MaintenanceBlank";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home />;
      case "students":
        return <Students setCurrentPage={setCurrentPage} />;
      case "professors":
        return <Professors />;
      case "reports":
        return <Reports />;
      case "requests":
        return <Requests />;
      case "maintenance":
        return <Maintenance setCurrentPage={setCurrentPage} />;
      case "maintenance-blank":
        return <MaintenanceBlank />;
      default:
        return <Home />;
    }
  };

  return (
    <>
      <Header setCurrentPage={setCurrentPage} />
      <div className="page-content">{renderPage()}</div>
    </>
  );
}

export default App;
