import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import Students from "./pages/Students";
import Professors from "./pages/Professors";
import Reports from "./pages/Reports";
import Requests from "./pages/Requests";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home />;
      case "students":
        return <Students />;
      case "professors":
        return <Professors />;
      case "reports":
        return <Reports />;
      case "requests":
        return <Requests />;
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
