const fs = require('fs');
const path = require('path');

const contractRegPath = path.join(__dirname, '..', '..', 'insert_esquema_origen', '9_insert_registro_contratos.sql');
const outputSiniestrosPath = path.join(__dirname, '..', '..', 'insert_esquema_origen', '10_insert_siniestros.sql');
const outputRegSiniestrosPath = path.join(__dirname, '..', '..', 'insert_esquema_origen', '11_insert_registro_siniestros.sql');

const claimDescriptions = [
    'Colisión de vehículo por detrás en intersección',
    'Robo parcial de accesorios de vehículo en estacionamiento',
    'Inundación de sótano por colapso de tubería de aguas lluvias',
    'Rotura de cristales exteriores por vandalismo',
    'Fractura de tobillo del asegurado en accidente doméstico',
    'Fallecimiento natural del asegurado principal',
    'Incendio parcial en área de cocina por cortocircuito',
    'Daños por agua debido a filtración en el techo',
    'Pérdida total del vehículo por colisión y vuelco',
    'Robo con violencia de pertenencias personales en vía pública',
    'Tratamiento de emergencia por intoxicación alimentaria',
    'Cirugía programada de apendicitis',
    'Daños estructurales menores por sismo',
    'Daño a equipos electrónicos por fluctuación de voltaje',
    'Lesión por caída en las instalaciones comerciales aseguradas'
];

function formatDate(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

function generateData() {
    try {
        console.log('Reading contract registrations...');
        const regContent = fs.readFileSync(contractRegPath, 'utf8');
        const lines = regContent.split(/\r?\n/);
        
        const contracts = [];
        // Regex to parse: VALUES (nro_contrato, cod_producto, cod_cliente, 'fecha_inicio', 'fecha_fin', monto, 'estado_contrato')
        const insertRegex = /VALUES\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*'([^']+)'\s*,\s*'([^']+)'/i;

        for (const line of lines) {
            const match = insertRegex.exec(line);
            if (match) {
                contracts.push({
                    nroContrato: parseInt(match[1], 10),
                    codProducto: parseInt(match[2], 10),
                    codCliente: parseInt(match[3], 10),
                    fechaInicio: new Date(match[4]),
                    fechaFin: new Date(match[5])
                });
            }
        }

        console.log(`Successfully parsed ${contracts.length} contracts.`);

        const siniestrosSql = [];
        const regSiniestrosSql = [];

        siniestrosSql.push('-- SINIESTRO Inserts');
        regSiniestrosSql.push('-- REGISTRO_SINIESTRO Inserts');

        // We want to generate 150 claims
        const totalClaims = 150;
        
        // Pick 150 unique or random contracts to have claims
        const shuffledContracts = [...contracts].sort(() => 0.5 - Math.random());

        for (let i = 0; i < totalClaims; i++) {
            const claimNum = i + 1;
            const contract = shuffledContracts[i % shuffledContracts.length];

            const claimDescTemplate = claimDescriptions[i % claimDescriptions.length];
            const claimDesc = `${claimDescTemplate} Nro. ${claimNum}`;

            // 1. SINIESTRO Insert
            siniestrosSql.push(`INSERT INTO SINIESTRO (nro_siniestro, descripcion_siniestro) VALUES (${claimNum}, '${claimDesc}');`);

            // 2. REGISTRO_SINIESTRO Insert
            // Generate claim date between contract init date and contract end date
            const timeDiff = contract.fechaFin.getTime() - contract.fechaInicio.getTime();
            const claimTime = contract.fechaInicio.getTime() + Math.random() * timeDiff;
            const claimDate = new Date(claimTime);

            // Response date is between 3 to 30 days after claim date
            const responseDate = new Date(claimDate);
            responseDate.setDate(claimDate.getDate() + Math.floor(3 + Math.random() * 27));

            // 20% chance of rejection
            const isRejected = Math.random() < 0.20;
            const idRechazo = isRejected ? 'SI' : 'NO';

            const requestedAmount = (200.00 + Math.random() * 10000.00).toFixed(2);
            const recognizedAmount = isRejected 
                ? '0.00' 
                : (requestedAmount * (0.70 + Math.random() * 0.30)).toFixed(2);

            const formattedClaim = formatDate(claimDate);
            const formattedResponse = formatDate(responseDate);

            regSiniestrosSql.push(`INSERT INTO REGISTRO_SINIESTRO (nro_siniestro, nro_contrato, cod_producto, cod_cliente, fecha_siniestro, fecha_respuesta, id_rechazo, monto_reconocido, monto_solicitado) VALUES (${claimNum}, ${contract.nroContrato}, ${contract.codProducto}, ${contract.codCliente}, '${formattedClaim}', '${formattedResponse}', '${idRechazo}', ${recognizedAmount}, ${requestedAmount});`);
        }

        // Ensure output directories exist
        fs.mkdirSync(path.dirname(outputSiniestrosPath), { recursive: true });

        fs.writeFileSync(outputSiniestrosPath, siniestrosSql.join('\n') + '\n', 'utf8');
        fs.writeFileSync(outputRegSiniestrosPath, regSiniestrosSql.join('\n') + '\n', 'utf8');

        console.log(`Successfully generated claims inserts at:\n - ${outputSiniestrosPath}\n - ${outputRegSiniestrosPath}`);
    } catch (error) {
        console.error('Error generating claims:', error);
    }
}

generateData();
