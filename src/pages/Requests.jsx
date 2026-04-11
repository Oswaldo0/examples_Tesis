import React from 'react';
import '../styles/Requests.css';

const Requests = () => {
  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="requests-container">
      <h2>Página de Solicitudes</h2>
      <p>Aquí se mostrarán las solicitudes.</p>
      <button className="print-button" onClick={handlePrintPDF}>
        📄 Imprimir / Descargar PDF
      </button>
    </div>
  );
};

export default Requests;