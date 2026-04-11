import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import Students from "./pages/Students";
import Professors from "./pages/Professors";

function App() {
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState("home");

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <>
            <Home />
            <div>
              <a href="https://vite.dev" target="_blank">
                <img src={viteLogo} className="logo" alt="Vite logo" />
              </a>
              <a href="https://react.dev" target="_blank">
                <img src={reactLogo} className="logo react" alt="React logo" />
              </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
              <button onClick={() => setCount((count) => count + 1)}>
                count is {count}
              </button>
              <p>
                Edit <code>src/App.jsx</code> and save to test HMR
              </p>
            </div>
            <p className="read-the-docs">
              Click on the Vite and React logos to learn more
            </p>
          </>
        );
      case "students":
        return <Students />;
      case "professors":
        return <Professors />;
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
