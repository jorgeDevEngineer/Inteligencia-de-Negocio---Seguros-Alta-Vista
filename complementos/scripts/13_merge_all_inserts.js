const fs = require('fs');
const path = require('path');

const inputFolder = path.join(__dirname, '..', '..', 'insert_esquema_origen');
const outputPath = path.join(inputFolder, '13_all_inserts.sql');

const filesToMerge = [
    '1_insert_paises.sql',
    '2_insert_ciudades.sql',
    '3_insert_sucursales.sql',
    '4_insert_productos.sql',
    '5_insert_clientes.sql',
    '6_insert_evaluaciones.sql',
    '7_insert_recomienda.sql',
    '8_insert_contratos.sql',
    '9_insert_registro_contratos.sql',
    '10_insert_siniestros.sql',
    '11_insert_registro_siniestros.sql',
    '12_insert_metas.sql'
];

function mergeData() {
    try {
        const mergedContent = [];
        mergedContent.push('-- ======================================================');
        mergedContent.push('-- UNIFIED SCHEMA INSERT STATEMENTS');
        mergedContent.push('-- Generated automatically by merging files 1 through 12');
        mergedContent.push('-- ======================================================\n');

        for (const fileName of filesToMerge) {
            const filePath = path.join(inputFolder, fileName);
            console.log(`Reading ${fileName}...`);
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8').trim();
                if (content) {
                    mergedContent.push(`-- START: ${fileName}`);
                    mergedContent.push(content);
                    mergedContent.push(`-- END: ${fileName}\n`);
                }
            } else {
                console.warn(`Warning: File ${fileName} not found. Skipping.`);
            }
        }

        fs.writeFileSync(outputPath, mergedContent.join('\n'), 'utf8');
        console.log(`Successfully created unified SQL file at: ${outputPath}`);
    } catch (error) {
        console.error('Error merging SQL files:', error);
    }
}

mergeData();
