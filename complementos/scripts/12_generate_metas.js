const fs = require('fs');
const path = require('path');

const contractRegPath = path.join(__dirname, '..', '..', 'insert_esquema_origen', '9_insert_registro_contratos.sql');
const outputPath = path.join(__dirname, '..', '..', 'insert_esquema_origen', '12_insert_metas.sql');

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
        const insertRegex = /VALUES\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*([\d.]+)/i;

        for (const line of lines) {
            const match = insertRegex.exec(line);
            if (match) {
                contracts.push({
                    nroContrato: parseInt(match[1], 10),
                    codProducto: parseInt(match[2], 10),
                    codCliente: parseInt(match[3], 10),
                    fechaInicio: new Date(match[4]),
                    fechaFin: new Date(match[5]),
                    monto: parseFloat(match[6])
                });
            }
        }

        console.log(`Successfully parsed ${contracts.length} contracts.`);

        const sqlLines = [];
        sqlLines.push('-- METAS Inserts');

        // Generate 100 goals
        const totalGoals = 100;
        const shuffledContracts = [...contracts].sort(() => 0.5 - Math.random());

        for (let i = 0; i < totalGoals; i++) {
            const goalId = i + 1;
            const contract = shuffledContracts[i % shuffledContracts.length];

            // Goals start and end dates are aligned with the contract duration
            const formattedInit = formatDate(contract.fechaInicio);
            const formattedFin = formatDate(contract.fechaFin);

            // Target income is set slightly higher than the actual contract amount (e.g. 10% to 30% higher)
            const targetIncome = (contract.monto * (1.10 + Math.random() * 0.20)).toFixed(2);

            // Renewal target: 1 (Yes) or 0 (No)
            const targetRenewal = Math.random() > 0.3 ? 1 : 0;

            // Target number of insured persons: 1 to 5
            const targetInsured = Math.floor(Math.random() * 5) + 1;

            sqlLines.push(`INSERT INTO METAS (cod_meta, cod_cliente, cod_producto, nro_contrato, fecha_inicio_meta, fecha_fin_meta, monto_meta_ingreso, meta_renovacion, meta_asegurados) VALUES (${goalId}, ${contract.codCliente}, ${contract.codProducto}, ${contract.nroContrato}, '${formattedInit}', '${formattedFin}', ${targetIncome}, ${targetRenewal}, ${targetInsured});`);
        }

        // Ensure output directory exists
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(outputPath, sqlLines.join('\n') + '\n', 'utf8');
        console.log(`Successfully generated goal inserts at: ${outputPath}`);
    } catch (error) {
        console.error('Error generating goal data:', error);
    }
}

generateData();
