const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, '..', '..', 'insert_esquema_origen', '9_insert_registro_contratos.sql');

function randomDate(start, end) {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date;
}

function formatDate(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

function generateData() {
    try {
        const sqlLines = [];
        sqlLines.push('-- REGISTRO_CONTRATO Inserts');

        const startDateLimit = new Date('2022-01-01');
        const endDateLimit = new Date('2025-12-31');
        const currentDate = new Date('2026-06-04'); // current system date context

        // Generate registrations for each of the 300 contracts
        for (let contractNum = 1; contractNum <= 300; contractNum++) {
            const productId = Math.floor(Math.random() * 500) + 1;
            const clientId = Math.floor(Math.random() * 200) + 1;

            const initDate = randomDate(startDateLimit, endDateLimit);
            
            // Contracts usually last 1 year (365 days)
            const finDate = new Date(initDate);
            finDate.setFullYear(initDate.getFullYear() + 1);

            const isExpired = finDate < currentDate;
            let status = 'Activo';

            if (isExpired) {
                status = Math.random() > 0.15 ? 'Vencido' : 'Cancelado';
            } else {
                status = Math.random() > 0.05 ? 'Activo' : 'Suspendido';
            }

            const amount = (100.00 + Math.random() * 14900.00).toFixed(2);

            const formattedInit = formatDate(initDate);
            const formattedFin = formatDate(finDate);

            sqlLines.push(`INSERT INTO REGISTRO_CONTRATO (nro_contrato, cod_producto, cod_cliente, fecha_inicio, fecha_fin, monto, estado_contrato) VALUES (${contractNum}, ${productId}, ${clientId}, '${formattedInit}', '${formattedFin}', ${amount}, '${status}');`);
        }

        // Ensure output directory exists
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(outputPath, sqlLines.join('\n') + '\n', 'utf8');
        console.log(`Successfully generated contract registration inserts at: ${outputPath}`);

        // Run dependent generators to preserve referential coherence
        const { execSync } = require('child_process');
        try {
            console.log('Running dependent scripts to ensure referential coherence...');
            execSync(`node "${path.join(__dirname, '10_11_generate_siniestros.js')}"`, { stdio: 'inherit' });
            execSync(`node "${path.join(__dirname, '12_generate_metas.js')}"`, { stdio: 'inherit' });
            console.log('Merging all generated SQL insert files into 13_all_inserts.sql...');
            execSync(`node "${path.join(__dirname, '13_merge_all_inserts.js')}"`, { stdio: 'inherit' });
            console.log('Compiling full relational database script (structure + data)...');
            execSync(`node "${path.join(__dirname, '14_generate_full_source_sql.js')}"`, { stdio: 'inherit' });
        } catch (execError) {
            console.error('Error running dependent coherence scripts:', execError.message);
        }
    } catch (error) {
        console.error('Error generating contract registrations:', error);
    }
}

generateData();
