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
* **`SEGURO_DW_POBLADO_G29529111.sql`**: Backup del Data Warehouse ya procesado por el ETL. Contiene la estructura del DW y todos los datos listos para conectar directamente con Power BI, sin necesidad de ejecutar Pentaho.
* **`etl_pentaho/`**: Transformaciones y Job de orquestación desarrollados en Pentaho Data Integration (PDI):
  * `KTR_01_DIM_TIEMPO.ktr`
  * `KTR_02_DIM_ESTADO_CONTRATO.ktr`
  * `KTR_03_DIM_EVALUACION_SERVICIO.ktr`
  * `KTR_04_DIM_SINIESTRO.ktr`
  * `KTR_05_DIM_CONTRATO.ktr`
  * `KTR_06_DIM_CLIENTE.ktr`
  * `KTR_07_DIM_PRODUCTO.ktr`
  * `KTR_08_DIM_SUCURSAL.ktr`
  * `KTR_09_FACT_EVALUACION_SERVICIO.ktr`
  * `KTR_10_FACT_METAS.ktr`
  * `KTR_11_FACT_REGISTRO_CONTRATO.ktr`
  * `KTR_12_FACT_REGISTRO_SINIESTRO.ktr`
  * `JOB_SEGUROS_DW.kjb`
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

## 🗄️ Restaurar el Data Warehouse (Para Power BI)

Si solo necesitas conectar Power BI al Data Warehouse sin reproducir todo el proceso ETL, usa el archivo `SEGURO_DW_POBLADO_G29529111.sql`.

**Requisitos:**
- PostgreSQL 13+
- Power BI Desktop
- [Conector Npgsql para Power BI](https://www.npgsql.org/)

**Pasos:**

```bash
# 1. Crear la base de datos
psql -U postgres -c "CREATE DATABASE seguros_altavista;"

# 2. Cargar el DW poblado
psql -U postgres -d seguros_altavista -f SEGURO_DW_POBLADO_G29529111.sql
```

Una vez cargado, conectar desde Power BI Desktop:
```
Obtener datos → PostgreSQL
Servidor: localhost
Base de datos: seguros_altavista
Schema: SEGURO_DW_G29529111
```

---

## 🔁 Reproducir el Proceso Completo (Fuente + ETL)

Si necesitas reproducir todo desde cero, incluyendo la base de datos transaccional y el proceso ETL.

**Requisitos adicionales:**
- Pentaho Data Integration (PDI) 9.x
- Node.js 18+

**Pasos:**

```bash
# 1. Crear la base de datos
psql -U postgres -c "CREATE DATABASE seguros_altavista;"

# 2. Cargar la base de datos transaccional (fuente)
psql -U postgres -d seguros_altavista -f SEGURO_G29529111.sql

# 3. Crear la estructura del DW vacía
psql -U postgres -d seguros_altavista -f "SEGURO _DW_G29529111.sql"
```

```
# 4. Ejecutar el ETL en Pentaho Data Integration:
- Abrir Pentaho Spoon
- Cargar etl_pentaho/JOB_SEGUROS_DW.kjb
- Configurar las conexiones apuntando a localhost / seguros_altavista
- Ejecutar el Job
```

### Configuración de conexiones en Pentaho

Antes de ejecutar el Job es necesario configurar una conexión a PostgreSQL dentro de Pentaho. En cualquier transformación `.ktr`, ir a la pestaña **View → Database connections → clic derecho → New** y crear la siguiente:

```
Nombre:        Conexion_Local_Seguros
Tipo:          PostgreSQL
Access:        Native (JDBC)
Host:          localhost
Base de datos: seguros_alta_vista
Puerto:        5432
Usuario:       postgres
Password:      (tu contraseña local)
```

> **Nota:** Se usa una sola conexión para ambos schemas. El schema de origen (`seguro_g29529111`) y el de destino (`seguro_dw_g29529111`) se especifican individualmente dentro de cada paso en las transformaciones. Una vez creada la conexión, se comparte entre todas las transformaciones del proyecto.

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

> **Nota:** La ejecución de `9_generate_registro_contratos.js` dispara automáticamente los generadores de siniestros, de metas, el script de unificación (`13_all_inserts.sql`) y compila todo el DDL + DML dentro del archivo raíz `SEGURO_G29529111.sql`. Después de regenerar datos es necesario volver a ejecutar el ETL en Pentaho.