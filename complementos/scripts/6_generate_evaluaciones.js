const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, '..', '..', 'insert_esquema_origen', '6_insert_evaluaciones.sql');

const evaluations = [];
for (let i = 1; i <= 100; i++) {
    evaluations.push({ id: i, desc: `Nivel de Servicio: ${i}/100` });
}

function generateData() {
    try {
        const sqlLines = [];
        sqlLines.push('-- EVALUACION_SERVICIO Inserts');

        for (const evalItem of evaluations) {
            sqlLines.push(`INSERT INTO EVALUACION_SERVICIO (cod_evaluacion_servicio, nb_descripcion) VALUES (${evalItem.id}, '${evalItem.desc}');`);
        }

        // Ensure output directory exists
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(outputPath, sqlLines.join('\n') + '\n', 'utf8');
        console.log(`Successfully generated evaluation service inserts at: ${outputPath}`);
    } catch (error) {
        console.error('Error generating evaluation data:', error);
    }
}

generateData();
