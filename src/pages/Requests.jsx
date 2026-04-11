import React from 'react';
import '../styles/Requests.css';

const Requests = () => {
  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="requests-container">
      <div className="requests-header">
        <button className="print-button" onClick={handlePrintPDF}>
          📄 Imprimir / Descargar PDF
        </button>
      </div>
    </div>
  );
};

export default Requests;