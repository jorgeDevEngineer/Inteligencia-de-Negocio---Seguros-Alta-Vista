const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, '..', '..', 'insert_esquema_origen', '8_insert_contratos.sql');

const contractDescriptions = [
    'Contrato de Seguro de Cobertura Amplia',
    'Póliza de Seguro de Vida Familiar',
    'Contrato de Seguro Médico Individual',
    'Póliza de Responsabilidad Civil General',
    'Contrato de Cobertura contra Todo Riesgo',
    'Póliza de Seguro de Propiedad Comercial',
    'Contrato de Seguro de Viajes Internacionales',
    'Póliza de Seguro de Flota de Vehículos',
    'Contrato de Seguro contra Incendios y Desastres',
    'Póliza de Responsabilidad Profesional Especializada'
];

function generateData() {
    try {
        const sqlLines = [];
        sqlLines.push('-- CONTRATO Inserts');

        // Generate 300 contracts
        for (let i = 1; i <= 300; i++) {
            const contractNum = i;
            const templateDesc = contractDescriptions[i % contractDescriptions.length];
            const contractDesc = `${templateDesc} Nro. ${contractNum}`;
            sqlLines.push(`INSERT INTO CONTRATO (nro_contrato, descrip_contrato) VALUES (${contractNum}, '${contractDesc}');`);
        }

        // Ensure output directory exists
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(outputPath, sqlLines.join('\n') + '\n', 'utf8');
        console.log(`Successfully generated contract inserts at: ${outputPath}`);
    } catch (error) {
        console.error('Error generating contracts data:', error);
    }
}

generateData();
