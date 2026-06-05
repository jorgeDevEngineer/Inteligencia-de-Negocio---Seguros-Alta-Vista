-- Table creation script for relational model

CREATE TABLE PAIS (
    cod_pais INT PRIMARY KEY,
    nb_pais VARCHAR(100) NOT NULL
);

CREATE TABLE CIUDAD (
    cod_ciudad INT PRIMARY KEY,
    nb_ciudad VARCHAR(100) NOT NULL,
    cod_pais INT NOT NULL,
    FOREIGN KEY (cod_pais) REFERENCES PAIS(cod_pais)
);

CREATE TABLE SUCURSAL (
    cod_sucursal INT PRIMARY KEY,
    nb_sucursal VARCHAR(100) NOT NULL,
    cod_ciudad INT NOT NULL,
    FOREIGN KEY (cod_ciudad) REFERENCES CIUDAD(cod_ciudad)
);

CREATE TABLE TIPO_PRODUCTO (
    cod_tipo_producto INT PRIMARY KEY,
    nb_tipo_producto VARCHAR(100) NOT NULL
);

CREATE TABLE PRODUCTO (
    cod_producto INT PRIMARY KEY,
    nb_producto VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    cod_tipo_producto INT NOT NULL,
    calificacion DECIMAL(3,2),
    FOREIGN KEY (cod_tipo_producto) REFERENCES TIPO_PRODUCTO(cod_tipo_producto)
);

CREATE TABLE CLIENTE (
    cod_cliente INT PRIMARY KEY,
    nb_cliente VARCHAR(100) NOT NULL,
    ci_rif VARCHAR(20) NOT NULL UNIQUE,
    telefono VARCHAR(50),
    direccion VARCHAR(255),
    sexo CHAR(1) NOT NULL,
    email VARCHAR(100),
    cod_sucursal INT NOT NULL,
    FOREIGN KEY (cod_sucursal) REFERENCES SUCURSAL(cod_sucursal)
);

CREATE TABLE EVALUACION_SERVICIO (
    cod_evaluacion_servicio INT PRIMARY KEY,
    nb_descripcion VARCHAR(50) NOT NULL
);

CREATE TABLE RECOMIENDA (
    cod_cliente INT NOT NULL,
    cod_evaluacion_servicio INT NOT NULL,
    cod_producto INT NOT NULL,
    recomienda_amigo VARCHAR(2) NOT NULL,
    PRIMARY KEY (cod_cliente, cod_producto),
    FOREIGN KEY (cod_cliente) REFERENCES CLIENTE(cod_cliente),
    FOREIGN KEY (cod_evaluacion_servicio) REFERENCES EVALUACION_SERVICIO(cod_evaluacion_servicio),
    FOREIGN KEY (cod_producto) REFERENCES PRODUCTO(cod_producto)
);

CREATE TABLE CONTRATO (
    nro_contrato INT PRIMARY KEY,
    descrip_contrato VARCHAR(255)
);

CREATE TABLE REGISTRO_CONTRATO (
    nro_contrato INT NOT NULL,
    cod_producto INT NOT NULL,
    cod_cliente INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    monto DECIMAL(18,2) NOT NULL,
    estado_contrato VARCHAR(20) NOT NULL,
    PRIMARY KEY (nro_contrato, cod_producto, cod_cliente),
    FOREIGN KEY (nro_contrato) REFERENCES CONTRATO(nro_contrato),
    FOREIGN KEY (cod_producto) REFERENCES PRODUCTO(cod_producto),
    FOREIGN KEY (cod_cliente) REFERENCES CLIENTE(cod_cliente)
);

CREATE TABLE SINIESTRO (
    nro_siniestro INT PRIMARY KEY,
    descripcion_siniestro VARCHAR(255) NOT NULL
);

CREATE TABLE REGISTRO_SINIESTRO (
    nro_siniestro INT NOT NULL,
    nro_contrato INT NOT NULL,
    cod_producto INT NOT NULL,
    cod_cliente INT NOT NULL,
    fecha_siniestro DATE NOT NULL,
    fecha_respuesta DATE,
    id_rechazo VARCHAR(2) NOT NULL,
    monto_reconocido DECIMAL(18,2),
    monto_solicitado DECIMAL(18,2) NOT NULL,
    PRIMARY KEY (nro_siniestro, nro_contrato, cod_producto, cod_cliente),
    FOREIGN KEY (nro_siniestro) REFERENCES SINIESTRO(nro_siniestro),
    FOREIGN KEY (nro_contrato, cod_producto, cod_cliente) REFERENCES REGISTRO_CONTRATO(nro_contrato, cod_producto, cod_cliente)
);

CREATE TABLE METAS (
    cod_meta INT PRIMARY KEY,
    cod_cliente INT NOT NULL,
    cod_producto INT NOT NULL,
    nro_contrato INT NOT NULL,
    fecha_inicio_meta DATE NOT NULL,
    fecha_fin_meta DATE NOT NULL,
    monto_meta_ingreso DECIMAL(18,2) NOT NULL,
    meta_renovacion INT NOT NULL,
    meta_asegurados INT NOT NULL,
    FOREIGN KEY (cod_cliente) REFERENCES CLIENTE(cod_cliente),
    FOREIGN KEY (cod_producto) REFERENCES PRODUCTO(cod_producto),
    FOREIGN KEY (nro_contrato) REFERENCES CONTRATO(nro_contrato)
);