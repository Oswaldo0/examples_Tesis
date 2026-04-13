# Backend - Arquitectura por Capas

Estructura base para un backend Node.js con arquitectura por capas.

Capas incluidas:
- presentation: rutas y controladores
- application: casos de uso y servicios
- domain: entidades y contratos
- infrastructure: implementaciones tecnicas (repositorios, db)
- shared: middleware y errores comunes
- config: variables de entorno y configuracion

## Automatizacion SQL (MySQL)

Se agrego un script en `backend/sql/mysql_automation.sql` con:
- vistas de apoyo para mantenimiento
- triggers de validacion y auditoria para `estudiante`
- procedimientos almacenados para insercion/actualizacion/mantenimiento

### Ejecutar script

Desde la raiz del proyecto:

```bash
mysql -u <usuario> -p <nombre_bd> < backend/sql/mysql_automation.sql
```

Ejemplo:

```bash
mysql -u root -p BD_USO_SONSONATE < backend/sql/mysql_automation.sql
```
