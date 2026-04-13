export class Student {
  constructor({
    expediente,
    nombres,
    apellidos,
    cum = null,
    num_carnet = null,
    calidad = null,
    id_direccion = null,
    telefono = null,
    correo = null,
    id_carrera = null,
    edad = null,
    fecha_nac = null,
    id_responsable = null,
    estado_academico = null,
    institucion_proc = null,
    anio_ingreso = null,
    id_ciclo = null,
    id_grupo = null,
    id_plan_estu = null,
    empleo = null,
  }) {
    this.expediente = expediente;
    this.nombres = nombres;
    this.apellidos = apellidos;
    this.cum = cum;
    this.num_carnet = num_carnet;
    this.calidad = calidad;
    this.id_direccion = id_direccion;
    this.telefono = telefono;
    this.correo = correo;
    this.id_carrera = id_carrera;
    this.edad = edad;
    this.fecha_nac = fecha_nac;
    this.id_responsable = id_responsable;
    this.estado_academico = estado_academico;
    this.institucion_proc = institucion_proc;
    this.anio_ingreso = anio_ingreso;
    this.id_ciclo = id_ciclo;
    this.id_grupo = id_grupo;
    this.id_plan_estu = id_plan_estu;
    this.empleo = empleo;
  }
}
