const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, '..', '..', 'insert_esquema_origen', '5_insert_clientes.sql');

const firstNamesMale = [
    'Juan', 'Pedro', 'Carlos', 'Luis', 'Miguel', 'Jorge', 'Javier', 'Andrés',
    'Alejandro', 'José', 'Francisco', 'Manuel', 'Roberto', 'Fernando', 'Daniel',
    'David', 'Gustavo', 'Ricardo', 'Eduardo', 'Hugo'
];

const firstNamesFemale = [
    'María', 'Ana', 'Laura', 'Sofía', 'Andrea', 'Carmen', 'Elena', 'Patricia',
    'Isabel', 'Mónica', 'Cristina', 'Silvia', 'Beatriz', 'Natalia', 'Gabriela',
    'Lucía', 'Valeria', 'Daniela', 'Camila', 'Mariana'
];

const lastNames = [
    'Rodríguez', 'Gómez', 'González', 'Pérez', 'Martínez', 'García', 'Sánchez',
    'Díaz', 'Fernández', 'López', 'Ruiz', 'Ramírez', 'Torres', 'Flores', 'Hernández',
    'Vargas', 'Castro', 'Guzmán', 'Rojas', 'Morales'
];

const streetTypes = ['Avenida', 'Calle', 'Callejón', 'Urbanización', 'Sector'];
const streetNames = ['Bolívar', 'Miranda', 'Sucre', 'Los Caobos', 'Las Mercedes', 'Urdaneta', 'San Martín', 'Libertador'];

function generateData() {
    try {
        const sqlLines = [];
        sqlLines.push('-- CLIENTE Inserts');

        for (let i = 0; i < 200; i++) {
            const clientId = i + 1;
            const isMale = Math.random() > 0.5;
            const firstName = isMale 
                ? firstNamesMale[Math.floor(Math.random() * firstNamesMale.length)]
                : firstNamesFemale[Math.floor(Math.random() * firstNamesFemale.length)];
            const lastName1 = lastNames[Math.floor(Math.random() * lastNames.length)];
            const lastName2 = lastNames[Math.floor(Math.random() * lastNames.length)];
            const clientName = `${firstName} ${lastName1} ${lastName2}`;
            const sex = isMale ? 'M' : 'F';

            // Generate unique National ID (ci_rif)
            const idNumber = 10000000 + i;
            const ciRif = `V-${idNumber}`;

            // Generate Phone
            const phoneCode = ['0414', '0424', '0412', '0416', '0426'][Math.floor(Math.random() * 5)];
            const phoneNum = Math.floor(1000000 + Math.random() * 9000000);
            const phone = `${phoneCode}-${phoneNum}`;

            // Generate Address
            const streetType = streetTypes[Math.floor(Math.random() * streetTypes.length)];
            const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
            const houseNum = Math.floor(1 + Math.random() * 100);
            const address = `${streetType} ${streetName}, Nro. ${houseNum}`;

            // Generate Email
            const normalizedFirstName = firstName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const normalizedLastName = lastName1.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const email = `${normalizedFirstName}.${normalizedLastName}${clientId}@example.com`;

            // Distribute across 100 branches
            const branchId = (i % 100) + 1;

            // Escape single quotes
            const escapedName = clientName.replace(/'/g, "''");
            const escapedAddress = address.replace(/'/g, "''");

            sqlLines.push(`INSERT INTO CLIENTE (cod_cliente, nb_cliente, ci_rif, telefono, direccion, sexo, email, cod_sucursal) VALUES (${clientId}, '${escapedName}', '${ciRif}', '${phone}', '${escapedAddress}', '${sex}', '${email}', ${branchId});`);
        }

        // Ensure output directory exists
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(outputPath, sqlLines.join('\n') + '\n', 'utf8');
        console.log(`Successfully generated 200 client inserts at: ${outputPath}`);
    } catch (error) {
        console.error('Error generating client data:', error);
    }
}

generateData();
