export class Materia {
  constructor({
    id = null,
    nombre,
    id_ciclo,
    estado = 'ACTIVA',
    descripcion = null,
  }) {
    this.id = id;
    this.nombre = nombre;
    this.id_ciclo = id_ciclo;
    this.estado = estado;
    this.descripcion = descripcion;
  }
}
