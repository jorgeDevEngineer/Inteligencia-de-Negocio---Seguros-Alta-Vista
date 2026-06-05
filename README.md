# Inteligencia de Negocios - Seguros Alta Vista (Fase II)

Implementación de una solución integral de Inteligencia de Negocios (BI) para la empresa **Seguros Alta Vista**, enfocada en el análisis de indicadores clave de rendimiento (KPIs), siniestralidad, efectividad y control de metas para la toma de decisiones estratégicas.

## 👥 Cocreadores y Autores
* **Jorge Ignacio Ramirez Millán**
* **Diana Valentina Rodríguez León**
* **Nahomy Milagros Rada Aldana**

---

## 📂 Estructura del Repositorio

* **`SEGURO_G29529111.sql`**: Script unificado que contiene la estructura de base de datos transaccional (DDL) y la carga inicial de datos de prueba (DML).
* **`SEGURO _DW_G29529111.sql`**: Script de base de datos dimensional que define el diseño físico del Almacén de Datos (Data Warehouse) en formato Copo de Nieve/Estrella.
* **`creates/`**
  * `create_g.sql`: DDL puro para la creación de las tablas relacionales de la base de datos origen.
* **`insert_esquema_origen/`**: Contiene los inserts ordenados por orden de dependencia (`1_` al `12_`), y el archivo unificado `13_all_inserts.sql`.
* **`delete_drops/`**: Contiene scripts ordenados por dependencia de claves foráneas para la limpieza y desmontaje de la base de datos:
  * `delete_all_data.sql`: Vacía el contenido de todas las tablas.
  * `drop_all_tables.sql`: Elimina la definición física de las tablas.
* **`complementos/`**
  * **`datos_crudos/`**: Recursos base para la generación de datos (ej. `ciudades.csv`).
  * **`esquemas_fotos/`**: Diagrama de Entidad-Relación de la base de datos transaccional (`relacional_foto.png`).
  * **`esquemas_dimensionales_fotos/`**: Diagramas del modelo dimensional del Data Warehouse.
  * **`scripts/`**: Suite de scripts en Node.js para la generación y validación de datos de prueba.

---

## ⚙️ Generación Automatizada de Datos de Prueba

El sistema cuenta con un motor de generación aleatoria dinámico en Node.js que construye datos de prueba coherentes en español respetando:
* **Integridad Referencial**: Los generadores leen los outputs SQL previos para no violar ninguna restricción de clave foránea.
* **Coherencia Temporal**: Las fechas de siniestros y metas están acotadas dentro de la duración de sus contratos correspondientes.

### Instrucciones para Regenerar Datos:
Para regenerar y volver a compilar toda la base de datos origen transaccional, ejecuta el script principal que coordina a los generadores dependientes:

```bash
# Ejecutar desde la raíz del proyecto
node complementos/scripts/2_generate_ciudades.js
node complementos/scripts/3_generate_sucursales.js
node complementos/scripts/4_generate_productos.js
node complementos/scripts/5_generate_clientes.js
node complementos/scripts/6_generate_evaluaciones.js
node complementos/scripts/7_generate_recomienda.js
node complementos/scripts/8_generate_contratos.js
node complementos/scripts/9_generate_registro_contratos.js
```

> **Nota:** La ejecución de `9_generate_registro_contratos.js` dispara automáticamente los generadores de siniestros, de metas, el script de unificación (`13_all_inserts.sql`) y compila todo el DDL + DML dentro del archivo raíz `SEGURO_G29529111.sql`.
