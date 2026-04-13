-- MySQL automation package for BD_USO_SONSONATE
-- Includes:
-- 1) maintenance views
-- 2) validation and audit triggers for estudiante
-- 3) stored procedures for insert/update/maintenance flows

-- Run with:
-- mysql -u <user> -p <database> < backend/sql/mysql_automation.sql

-- -----------------------------------------------------------------------------
-- Audit table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS auditoria_estudiante (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  expediente BIGINT NOT NULL,
  accion VARCHAR(10) NOT NULL,
  usuario_bd VARCHAR(128) NOT NULL,
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  datos_antes LONGTEXT NULL,
  datos_despues LONGTEXT NULL,
  PRIMARY KEY (id),
  INDEX idx_auditoria_estudiante_expediente (expediente),
  INDEX idx_auditoria_estudiante_fecha (fecha)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- Views
-- -----------------------------------------------------------------------------
DROP VIEW IF EXISTS vw_estudiantes_mantenimiento;
CREATE VIEW vw_estudiantes_mantenimiento AS
SELECT
  e.expediente,
  e.nombres,
  e.apellidos,
  e.correo,
  e.telefono,
  e.estado_academico,
  e.anio_ingreso,
  e.id_carrera,
  c.nombre AS carrera_nombre,
  c.id_facultad,
  f.nombre AS facultad_nombre,
  e.id_ciclo,
  ci.ciclo AS ciclo_nombre,
  ci.anio AS ciclo_anio,
  e.id_grupo,
  e.id_plan_estu,
  e.id_responsable,
  e.id_direccion
FROM estudiante e
LEFT JOIN carrera c ON c.id = e.id_carrera
LEFT JOIN facultad f ON f.id = c.id_facultad
LEFT JOIN ciclo ci ON ci.id = e.id_ciclo;

DROP VIEW IF EXISTS vw_materias_mantenimiento;
CREATE VIEW vw_materias_mantenimiento AS
SELECT
  m.id,
  m.nombre,
  m.estado,
  m.descripcion,
  m.id_ciclo,
  c.ciclo AS ciclo_nombre,
  c.anio AS ciclo_anio
FROM materia m
LEFT JOIN ciclo c ON c.id = m.id_ciclo;

-- -----------------------------------------------------------------------------
-- Triggers for estudiante
-- -----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_estudiante_bi_validar;
DROP TRIGGER IF EXISTS trg_estudiante_bu_validar;
DROP TRIGGER IF EXISTS trg_estudiante_ai_auditoria;
DROP TRIGGER IF EXISTS trg_estudiante_au_auditoria;
DROP TRIGGER IF EXISTS trg_estudiante_ad_auditoria;

DELIMITER $$

CREATE TRIGGER trg_estudiante_bi_validar
BEFORE INSERT ON estudiante
FOR EACH ROW
BEGIN
  DECLARE v_exists INT DEFAULT 0;

  IF NEW.expediente IS NULL OR NEW.expediente <= 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'expediente debe ser mayor que 0';
  END IF;

  IF NEW.nombres IS NULL OR TRIM(NEW.nombres) = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'nombres es obligatorio';
  END IF;

  IF NEW.apellidos IS NULL OR TRIM(NEW.apellidos) = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'apellidos es obligatorio';
  END IF;

  SET NEW.nombres = TRIM(NEW.nombres);
  SET NEW.apellidos = TRIM(NEW.apellidos);
  SET NEW.correo = NULLIF(LOWER(TRIM(NEW.correo)), '');

  IF NEW.correo IS NOT NULL AND NEW.correo NOT REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'correo tiene formato invalido';
  END IF;

  IF NEW.cum IS NOT NULL AND (NEW.cum < 0 OR NEW.cum > 10) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'cum fuera de rango [0..10]';
  END IF;

  IF NEW.edad IS NOT NULL AND (NEW.edad < 14 OR NEW.edad > 120) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'edad fuera de rango [14..120]';
  END IF;

  IF NEW.anio_ingreso IS NOT NULL AND (NEW.anio_ingreso < 1990 OR NEW.anio_ingreso > YEAR(CURDATE()) + 1) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'anio_ingreso invalido';
  END IF;

  IF NEW.estado_academico IS NULL OR TRIM(NEW.estado_academico) = '' THEN
    SET NEW.estado_academico = 'ACTIVO';
  END IF;

  IF NEW.id_carrera IS NOT NULL THEN
    SELECT COUNT(*) INTO v_exists FROM carrera WHERE id = NEW.id_carrera;
    IF v_exists = 0 THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'id_carrera no existe';
    END IF;
  END IF;

  IF NEW.id_ciclo IS NOT NULL THEN
    SELECT COUNT(*) INTO v_exists FROM ciclo WHERE id = NEW.id_ciclo;
    IF v_exists = 0 THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'id_ciclo no existe';
    END IF;
  END IF;

  IF NEW.id_grupo IS NOT NULL THEN
    SELECT COUNT(*) INTO v_exists FROM grupo WHERE id = NEW.id_grupo;
    IF v_exists = 0 THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'id_grupo no existe';
    END IF;
  END IF;

  IF NEW.id_plan_estu IS NOT NULL THEN
    SELECT COUNT(*) INTO v_exists FROM plan_estu WHERE id = NEW.id_plan_estu;
    IF v_exists = 0 THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'id_plan_estu no existe';
    END IF;
  END IF;

  IF NEW.id_responsable IS NOT NULL THEN
    SELECT COUNT(*) INTO v_exists FROM responsable WHERE id = NEW.id_responsable;
    IF v_exists = 0 THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'id_responsable no existe';
    END IF;
  END IF;

  IF NEW.id_direccion IS NOT NULL THEN
    SELECT COUNT(*) INTO v_exists FROM direccion WHERE id = NEW.id_direccion;
    IF v_exists = 0 THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'id_direccion no existe';
    END IF;
  END IF;
END$$

CREATE TRIGGER trg_estudiante_bu_validar
BEFORE UPDATE ON estudiante
FOR EACH ROW
BEGIN
  DECLARE v_exists INT DEFAULT 0;

  IF NEW.nombres IS NULL OR TRIM(NEW.nombres) = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'nombres es obligatorio';
  END IF;

  IF NEW.apellidos IS NULL OR TRIM(NEW.apellidos) = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'apellidos es obligatorio';
  END IF;

  SET NEW.nombres = TRIM(NEW.nombres);
  SET NEW.apellidos = TRIM(NEW.apellidos);
  SET NEW.correo = NULLIF(LOWER(TRIM(NEW.correo)), '');

  IF NEW.correo IS NOT NULL AND NEW.correo NOT REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'correo tiene formato invalido';
  END IF;

  IF NEW.cum IS NOT NULL AND (NEW.cum < 0 OR NEW.cum > 10) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'cum fuera de rango [0..10]';
  END IF;

  IF NEW.edad IS NOT NULL AND (NEW.edad < 14 OR NEW.edad > 120) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'edad fuera de rango [14..120]';
  END IF;

  IF NEW.anio_ingreso IS NOT NULL AND (NEW.anio_ingreso < 1990 OR NEW.anio_ingreso > YEAR(CURDATE()) + 1) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'anio_ingreso invalido';
  END IF;

  IF NEW.id_carrera IS NOT NULL THEN
    SELECT COUNT(*) INTO v_exists FROM carrera WHERE id = NEW.id_carrera;
    IF v_exists = 0 THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'id_carrera no existe';
    END IF;
  END IF;

  IF NEW.id_ciclo IS NOT NULL THEN
    SELECT COUNT(*) INTO v_exists FROM ciclo WHERE id = NEW.id_ciclo;
    IF v_exists = 0 THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'id_ciclo no existe';
    END IF;
  END IF;

  IF NEW.id_grupo IS NOT NULL THEN
    SELECT COUNT(*) INTO v_exists FROM grupo WHERE id = NEW.id_grupo;
    IF v_exists = 0 THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'id_grupo no existe';
    END IF;
  END IF;

  IF NEW.id_plan_estu IS NOT NULL THEN
    SELECT COUNT(*) INTO v_exists FROM plan_estu WHERE id = NEW.id_plan_estu;
    IF v_exists = 0 THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'id_plan_estu no existe';
    END IF;
  END IF;

  IF NEW.id_responsable IS NOT NULL THEN
    SELECT COUNT(*) INTO v_exists FROM responsable WHERE id = NEW.id_responsable;
    IF v_exists = 0 THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'id_responsable no existe';
    END IF;
  END IF;

  IF NEW.id_direccion IS NOT NULL THEN
    SELECT COUNT(*) INTO v_exists FROM direccion WHERE id = NEW.id_direccion;
    IF v_exists = 0 THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'id_direccion no existe';
    END IF;
  END IF;
END$$

CREATE TRIGGER trg_estudiante_ai_auditoria
AFTER INSERT ON estudiante
FOR EACH ROW
BEGIN
  INSERT INTO auditoria_estudiante (expediente, accion, usuario_bd, datos_despues)
  VALUES (
    NEW.expediente,
    'INSERT',
    CURRENT_USER(),
    JSON_OBJECT(
      'expediente', NEW.expediente,
      'nombres', NEW.nombres,
      'apellidos', NEW.apellidos,
      'cum', NEW.cum,
      'num_carnet', NEW.num_carnet,
      'calidad', NEW.calidad,
      'id_direccion', NEW.id_direccion,
      'telefono', NEW.telefono,
      'correo', NEW.correo,
      'id_carrera', NEW.id_carrera,
      'edad', NEW.edad,
      'fecha_nac', NEW.fecha_nac,
      'id_responsable', NEW.id_responsable,
      'estado_academico', NEW.estado_academico,
      'institucion_proc', NEW.institucion_proc,
      'anio_ingreso', NEW.anio_ingreso,
      'id_ciclo', NEW.id_ciclo,
      'id_grupo', NEW.id_grupo,
      'id_plan_estu', NEW.id_plan_estu,
      'empleo', NEW.empleo
    )
  );
END$$

CREATE TRIGGER trg_estudiante_au_auditoria
AFTER UPDATE ON estudiante
FOR EACH ROW
BEGIN
  INSERT INTO auditoria_estudiante (expediente, accion, usuario_bd, datos_antes, datos_despues)
  VALUES (
    NEW.expediente,
    'UPDATE',
    CURRENT_USER(),
    JSON_OBJECT(
      'expediente', OLD.expediente,
      'nombres', OLD.nombres,
      'apellidos', OLD.apellidos,
      'cum', OLD.cum,
      'num_carnet', OLD.num_carnet,
      'calidad', OLD.calidad,
      'id_direccion', OLD.id_direccion,
      'telefono', OLD.telefono,
      'correo', OLD.correo,
      'id_carrera', OLD.id_carrera,
      'edad', OLD.edad,
      'fecha_nac', OLD.fecha_nac,
      'id_responsable', OLD.id_responsable,
      'estado_academico', OLD.estado_academico,
      'institucion_proc', OLD.institucion_proc,
      'anio_ingreso', OLD.anio_ingreso,
      'id_ciclo', OLD.id_ciclo,
      'id_grupo', OLD.id_grupo,
      'id_plan_estu', OLD.id_plan_estu,
      'empleo', OLD.empleo
    ),
    JSON_OBJECT(
      'expediente', NEW.expediente,
      'nombres', NEW.nombres,
      'apellidos', NEW.apellidos,
      'cum', NEW.cum,
      'num_carnet', NEW.num_carnet,
      'calidad', NEW.calidad,
      'id_direccion', NEW.id_direccion,
      'telefono', NEW.telefono,
      'correo', NEW.correo,
      'id_carrera', NEW.id_carrera,
      'edad', NEW.edad,
      'fecha_nac', NEW.fecha_nac,
      'id_responsable', NEW.id_responsable,
      'estado_academico', NEW.estado_academico,
      'institucion_proc', NEW.institucion_proc,
      'anio_ingreso', NEW.anio_ingreso,
      'id_ciclo', NEW.id_ciclo,
      'id_grupo', NEW.id_grupo,
      'id_plan_estu', NEW.id_plan_estu,
      'empleo', NEW.empleo
    )
  );
END$$

CREATE TRIGGER trg_estudiante_ad_auditoria
AFTER DELETE ON estudiante
FOR EACH ROW
BEGIN
  INSERT INTO auditoria_estudiante (expediente, accion, usuario_bd, datos_antes)
  VALUES (
    OLD.expediente,
    'DELETE',
    CURRENT_USER(),
    JSON_OBJECT(
      'expediente', OLD.expediente,
      'nombres', OLD.nombres,
      'apellidos', OLD.apellidos,
      'cum', OLD.cum,
      'num_carnet', OLD.num_carnet,
      'calidad', OLD.calidad,
      'id_direccion', OLD.id_direccion,
      'telefono', OLD.telefono,
      'correo', OLD.correo,
      'id_carrera', OLD.id_carrera,
      'edad', OLD.edad,
      'fecha_nac', OLD.fecha_nac,
      'id_responsable', OLD.id_responsable,
      'estado_academico', OLD.estado_academico,
      'institucion_proc', OLD.institucion_proc,
      'anio_ingreso', OLD.anio_ingreso,
      'id_ciclo', OLD.id_ciclo,
      'id_grupo', OLD.id_grupo,
      'id_plan_estu', OLD.id_plan_estu,
      'empleo', OLD.empleo
    )
  );
END$$

-- -----------------------------------------------------------------------------
-- Stored procedures
-- -----------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_guardar_estudiante$$
CREATE PROCEDURE sp_guardar_estudiante(
  IN p_expediente BIGINT,
  IN p_nombres VARCHAR(255),
  IN p_apellidos VARCHAR(255),
  IN p_cum DECIMAL(4,2),
  IN p_num_carnet BIGINT,
  IN p_calidad VARCHAR(100),
  IN p_id_direccion INT,
  IN p_telefono VARCHAR(50),
  IN p_correo VARCHAR(255),
  IN p_id_carrera INT,
  IN p_edad INT,
  IN p_fecha_nac DATE,
  IN p_id_responsable INT,
  IN p_estado_academico VARCHAR(50),
  IN p_institucion_proc VARCHAR(255),
  IN p_anio_ingreso INT,
  IN p_id_ciclo INT,
  IN p_id_grupo INT,
  IN p_id_plan_estu INT,
  IN p_empleo VARCHAR(255)
)
BEGIN
  DECLARE v_exists INT DEFAULT 0;

  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;

  START TRANSACTION;

  SELECT COUNT(*) INTO v_exists
  FROM estudiante
  WHERE expediente = p_expediente;

  IF v_exists = 0 THEN
    INSERT INTO estudiante (
      expediente, nombres, apellidos, cum, num_carnet, calidad, id_direccion,
      telefono, correo, id_carrera, edad, fecha_nac, id_responsable,
      estado_academico, institucion_proc, anio_ingreso, id_ciclo,
      id_grupo, id_plan_estu, empleo
    ) VALUES (
      p_expediente, p_nombres, p_apellidos, p_cum, p_num_carnet, p_calidad, p_id_direccion,
      p_telefono, p_correo, p_id_carrera, p_edad, p_fecha_nac, p_id_responsable,
      p_estado_academico, p_institucion_proc, p_anio_ingreso, p_id_ciclo,
      p_id_grupo, p_id_plan_estu, p_empleo
    );
  ELSE
    UPDATE estudiante
    SET
      nombres = p_nombres,
      apellidos = p_apellidos,
      cum = p_cum,
      num_carnet = p_num_carnet,
      calidad = p_calidad,
      id_direccion = p_id_direccion,
      telefono = p_telefono,
      correo = p_correo,
      id_carrera = p_id_carrera,
      edad = p_edad,
      fecha_nac = p_fecha_nac,
      id_responsable = p_id_responsable,
      estado_academico = p_estado_academico,
      institucion_proc = p_institucion_proc,
      anio_ingreso = p_anio_ingreso,
      id_ciclo = p_id_ciclo,
      id_grupo = p_id_grupo,
      id_plan_estu = p_id_plan_estu,
      empleo = p_empleo
    WHERE expediente = p_expediente;
  END IF;

  COMMIT;
END$$

DROP PROCEDURE IF EXISTS sp_cambiar_estado_estudiante$$
CREATE PROCEDURE sp_cambiar_estado_estudiante(
  IN p_expediente BIGINT,
  IN p_estado_academico VARCHAR(50)
)
BEGIN
  UPDATE estudiante
  SET estado_academico = p_estado_academico
  WHERE expediente = p_expediente;
END$$

DROP PROCEDURE IF EXISTS sp_reubicar_estudiante$$
CREATE PROCEDURE sp_reubicar_estudiante(
  IN p_expediente BIGINT,
  IN p_id_carrera INT,
  IN p_id_ciclo INT,
  IN p_id_grupo INT,
  IN p_id_plan_estu INT
)
BEGIN
  UPDATE estudiante
  SET
    id_carrera = p_id_carrera,
    id_ciclo = p_id_ciclo,
    id_grupo = p_id_grupo,
    id_plan_estu = p_id_plan_estu
  WHERE expediente = p_expediente;
END$$

DELIMITER ;
