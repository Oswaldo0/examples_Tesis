export class Coordinador {
  constructor({
    id = null,
    id_catedratico,
    id_rol,
    id_facultad,
    anio_asignacion,
    estado = 'ACTIVO',
    correo,
  }) {
    this.id = id;
    this.id_catedratico = id_catedratico;
    this.id_rol = id_rol;
    this.id_facultad = id_facultad;
    this.anio_asignacion = anio_asignacion;
    this.estado = estado;
    this.correo = correo;
    // password never included in domain entity (stored hashed in DB only)
  }
}
