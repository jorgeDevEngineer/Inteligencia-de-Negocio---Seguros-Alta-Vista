const fs = require('fs');
const path = require('path');

// Output SQL file path: insert_esquema_origen/4_insert_productos.sql
const outputPath = path.join(__dirname, '..', '..', 'insert_esquema_origen', '4_insert_productos.sql');

const productTypes = [
    'Seguro de Auto', 'Seguro de Hogar', 'Seguro de Alquiler', 'Seguro de Vida - Temporal',
    'Seguro de Vida - Entero', 'Seguro de Salud - Individual', 'Seguro de Salud - Familiar',
    'Seguro de Salud - Dental', 'Seguro de Salud - Oftalmológico', 'Seguro de Invalidez - Corto Plazo',
    'Seguro de Invalidez - Largo Plazo', 'Seguro de Cuidados a Largo Plazo', 'Seguro de Viaje', 'Seguro de Mascotas',
    'Seguro de Responsabilidad Civil Comercial', 'Seguro de Propiedad Comercial', 'Seguro de Responsabilidad Profesional', 'Seguro de Ciberseguridad',
    'Seguro de Directores y Oficiales', 'Seguro de Accidentes de Trabajo', 'Seguro Marítimo',
    'Seguro de Aviación', 'Seguro de Responsabilidad Civil Sombrilla', 'Seguro de Vida para Persona Clave', 'Seguro de Secuestro y Rescate',
    'Seguro de Título', 'Seguro Agrícola', 'Seguro contra Inundaciones', 'Seguro contra Terremotos',
    'Seguro de Responsabilidad Civil General', 'Seguro de Responsabilidad por Productos', 'Seguro de Responsabilidad para Eventos', 'Seguro de Garantía de Alquiler',
    'Seguro de Crédito', 'Fianzas de Garantía', 'Seguro de Interrupción de Negocio', 'Seguro de Transporte Terrestre',
    'Seguro de Carga', 'Seguro de Mala Praxis Médica', 'Seguro de Vehículos Especializados', 'Seguro de Propietario de Vivienda Rentada',
    'Seguro de Enfermedades Graves', 'Seguro de Muerte Accidental y Desmembramiento', 'Seguro de Vida Conjunto',
    'Seguro de Vida Variable', 'Seguro de Vida Dotal', 'Seguro de Salud Grupal',
    'Seguro de Vida Grupal', 'Reaseguro - Contrato', 'Reaseguro - Facultativo'
];

const tiers = ['Básico', 'Estándar', 'Plata', 'Oro', 'Platino', 'Premier', 'Elite', 'Selecto', 'Optima', 'Plus'];
const modifiers = ['Integral', 'Esencial', 'Seguro', 'Plus', 'Extra', 'Ahorro', 'Flexible', 'Completo', 'Confort', 'Libertad'];

function generateData() {
    try {
        const sqlLines = [];

        sqlLines.push('-- TIPO_PRODUCTO Inserts');
        for (let i = 0; i < productTypes.length; i++) {
            const typeId = i + 1;
            const typeName = productTypes[i];
            sqlLines.push(`INSERT INTO TIPO_PRODUCTO (cod_tipo_producto, nb_tipo_producto) VALUES (${typeId}, '${typeName}');`);
        }

        sqlLines.push('\n-- PRODUCTO Inserts');
        for (let i = 0; i < 500; i++) {
            const productId = i + 1;
            // Distribute products across the 50 product types
            const typeId = (i % 50) + 1;
            const typeName = productTypes[typeId - 1];

            // Generate product name in Spanish (Type + Tier + Modifier)
            const tier = tiers[Math.floor(Math.random() * tiers.length)];
            const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
            const productName = `${typeName} ${tier} ${modifier}`;

            // Generate description in Spanish
            const description = `${typeName} de nivel ${tier.toLowerCase()} diseñado para una cobertura óptima y beneficios de tipo ${modifier.toLowerCase()}.`;

            // Rating between 1.00 and 5.00
            const rating = (1.00 + Math.random() * 4.00).toFixed(2);

            // Escape single quotes
            const escapedName = productName.replace(/'/g, "''");
            const escapedDesc = description.replace(/'/g, "''");

            sqlLines.push(`INSERT INTO PRODUCTO (cod_producto, nb_producto, descripcion, cod_tipo_producto, calificacion) VALUES (${productId}, '${escapedName}', '${escapedDesc}', ${typeId}, ${rating});`);
        }

        // Ensure output directory exists
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(outputPath, sqlLines.join('\n') + '\n', 'utf8');
        console.log(`Successfully generated 50 types and 500 products in Spanish at: ${outputPath}`);
    } catch (error) {
        console.error('Error generating data:', error);
    }
}

generateData();
