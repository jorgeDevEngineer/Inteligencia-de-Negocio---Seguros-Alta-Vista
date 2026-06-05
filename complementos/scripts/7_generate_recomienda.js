const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, '..', '..', 'insert_esquema_origen', '7_insert_recomienda.sql');

function generateData() {
    try {
        const sqlLines = [];
        sqlLines.push('-- RECOMIENDA Inserts');

        // Total clients: 200 (IDs 1 to 200)
        // Total products: 500 (IDs 1 to 500)
        // Total evaluation services: 100 (IDs 1 to 100)
        
        for (let clientId = 1; clientId <= 200; clientId++) {
            // Each client rates/recommends between 2 and 4 unique products
            const numProducts = Math.floor(Math.random() * 3) + 2; // 2, 3, or 4
            const selectedProducts = new Set();

            while (selectedProducts.size < numProducts) {
                const randomProductId = Math.floor(Math.random() * 500) + 1;
                selectedProducts.add(randomProductId);
            }

            for (const productId of selectedProducts) {
                // Generate a random evaluation service rating between 1 and 100
                const evalServiceId = Math.floor(Math.random() * 100) + 1;
                
                // Determine recommendation ('SI' or 'NO') based on service rating
                const recommends = (evalServiceId > 40) ? 'SI' : 'NO';

                sqlLines.push(`INSERT INTO RECOMIENDA (cod_cliente, cod_evaluacion_servicio, cod_producto, recomienda_amigo) VALUES (${clientId}, ${evalServiceId}, ${productId}, '${recommends}');`);
            }
        }

        // Ensure output directory exists
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(outputPath, sqlLines.join('\n') + '\n', 'utf8');
        console.log(`Successfully generated recommendations inserts at: ${outputPath}`);
    } catch (error) {
        console.error('Error generating recommendations data:', error);
    }
}

generateData();
