import React, { useMemo, useState } from 'react';
import '../styles/Requests.css';

const Requests = () => {
  const [requests] = useState([
    {
      id: 1,
      codigo: 'SOL-001',
      estudiante: 'Ana Martinez',
      tipo: 'Constancia de notas',
      fecha: '2026-04-10',
      estado: 'Pendiente',
    },
    {
      id: 2,
      codigo: 'SOL-002',
      estudiante: 'Carlos Lopez',
      tipo: 'Cambio de grupo',
      fecha: '2026-04-11',
      estado: 'Pendiente',
    },
    {
      id: 3,
      codigo: 'SOL-003',
      estudiante: 'Maria Gomez',
      tipo: 'Reactivacion de ciclo',
      fecha: '2026-04-12',
      estado: 'En revision',
    },
    {
      id: 4,
      codigo: 'SOL-004',
      estudiante: 'Jose Rivera',
      tipo: 'Solicitud de equivalencia',
      fecha: '2026-04-13',
      estado: 'Pendiente',
    },
  ]);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const selectedCount = selectedIds.size;
  const allSelected = requests.length > 0 && selectedCount === requests.length;

  const selectedRequests = useMemo(
    () => requests.filter((r) => selectedIds.has(r.id)),
    [requests, selectedIds],
  );

  const toggleOne = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
      return;
    }
    setSelectedIds(new Set(requests.map((r) => r.id)));
  };

  const handlePrintPDF = () => {
    if (selectedCount === 0) return;
    window.print();
  };

  return (
    <div className="requests-container animate-[fadeIn_.35s_ease]">
      <div className="requests-header">
        <button
          className="print-button transition-all duration-300 ease-out active:scale-95 disabled:opacity-70"
          onClick={handlePrintPDF}
          disabled={selectedCount === 0}
          title={selectedCount === 0 ? 'Selecciona al menos una solicitud' : ''}
        >
          📄 Imprimir / Descargar PDF
        </button>
      </div>

      <div className="requests-layer bg-gradient-to-b from-white to-slate-50/80">
        <div className="requests-layer-header">
          <h2 className="tracking-tight">Solicitudes</h2>
          <p className="transition-colors duration-300">{selectedCount} seleccionada(s)</p>
        </div>

        <div className="requests-select-all">
          <label>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              className="accent-blue-600"
            />
            Seleccionar todas
          </label>
        </div>

        <div className="requests-list">
          {requests.map((req) => (
            <div
              key={req.id}
              className={`request-card transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg ${selectedIds.has(req.id) ? 'selected ring-2 ring-blue-300/70' : ''}`}
            >
              <label className="request-check">
                <input
                  type="checkbox"
                  checked={selectedIds.has(req.id)}
                  onChange={() => toggleOne(req.id)}
                  className="accent-blue-600"
                />
              </label>

              <div className="request-main">
                <div className="request-top">
                  <strong className="text-slate-800">{req.codigo}</strong>
                  <span className="request-status transition-all duration-300">{req.estado}</span>
                </div>
                <p><strong>Estudiante:</strong> {req.estudiante}</p>
                <p><strong>Tipo:</strong> {req.tipo}</p>
                <p><strong>Fecha:</strong> {req.fecha}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="print-only">
        <h3>Solicitudes seleccionadas</h3>
        {selectedRequests.length === 0 ? (
          <p>No hay solicitudes seleccionadas.</p>
        ) : (
          <ul>
            {selectedRequests.map((req) => (
              <li key={req.id}>
                {req.codigo} - {req.estudiante} - {req.tipo} ({req.fecha})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Requests;