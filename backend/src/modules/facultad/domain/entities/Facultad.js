export class Facultad {
  constructor({
    id = null,
    nombre,
    descripcion = null,
    anio_de_creacion = null,
    estado = 'ACTIVA',
  }) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.anio_de_creacion = anio_de_creacion;
    this.estado = estado;
  }
}
