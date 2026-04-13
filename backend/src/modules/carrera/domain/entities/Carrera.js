export class Carrera {
  constructor({
    id = null,
    nombre,
    id_facultad,
    id_plan_estudio,
    ciclo = null,
    estado = 'ACTIVA',
    id_horario = null,
  }) {
    this.id = id;
    this.nombre = nombre;
    this.id_facultad = id_facultad;
    this.id_plan_estudio = id_plan_estudio;
    this.ciclo = ciclo;
    this.estado = estado;
    this.id_horario = id_horario;
  }
}
