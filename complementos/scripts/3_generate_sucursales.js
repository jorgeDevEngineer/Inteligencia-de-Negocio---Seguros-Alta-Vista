const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, '..', '..', 'insert_esquema_origen', '3_insert_sucursales.sql');

// List of cities (1 to 100) and corresponding names
const branchCities = [
    'Tokyo', 'Jakarta', 'Delhi', 'Chongqing', 'Guangzhou', 'Mumbai', 'Manila', 'Shanghai', 'São Paulo', 'Seoul',
    'Beijing', 'Mexico City', 'Kolkāta', 'Chengdu', 'Cairo', 'Karachi', 'New York', 'Dhaka', 'Bangkok', 'Shenzhen',
    'Moscow', 'Kinshasa', 'Buenos Aires', 'Lagos', 'Istanbul', 'Ho Chi Minh City', 'Ōsaka', 'Tehran', 'Tianjin', 'Lahore',
    'Suzhou', 'Rio de Janeiro', 'Wuhan', 'Chennai', 'Xi’an', 'Los Angeles', 'Hangzhou', 'Baoding', 'London', 'Paris',
    'Linyi', 'Dongguan', 'Harbin', 'Hyderābād', 'Lima', 'Bogotá', 'Qingdao', 'Nanyang', 'Foshan', 'Nanjing',
    'Jinan', 'Nagoya', 'Tongshan', 'Luanda', 'Zhoukou', 'Ganzhou', 'Kuala Lumpur', 'Heze', 'Quanzhou', 'Hanoi',
    'Chicago', 'Bangalore', 'Jining', 'Shenyang', 'Pune', 'Fuyang', 'Baghdad', 'Ahmedabad', 'Dar es Salaam', 'Khartoum',
    'Shangqiu', 'Dalian', 'Hong Kong', 'Cangzhou', 'Riyadh', 'Bandung', 'Santiago', 'Xingtai', 'Zhumadian', 'Zhanjiang',
    'Bijie', 'Rangoon', 'Yancheng', 'Hengyang', 'Zunyi', 'Shaoyang', 'Surabaya', 'Sūrat', 'Shangrao', 'Miami',
    'Huanggang', 'Maoming', 'Nangandao', 'Xinyang', 'Houston', 'Madrid', 'Singapore', 'Dallas', 'Prayagraj', 'Liaocheng'
];

function generateData() {
    try {
        const sqlLines = [];
        sqlLines.push('-- SUCURSAL Inserts');

        for (let i = 0; i < 100; i++) {
            const branchId = i + 1;
            const cityName = branchCities[i];
            const branchName = `Sucursal ${cityName}`;
            sqlLines.push(`INSERT INTO SUCURSAL (cod_sucursal, nb_sucursal, cod_ciudad) VALUES (${branchId}, '${branchName}', ${branchId});`);
        }

        // Ensure output directory exists
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(outputPath, sqlLines.join('\n') + '\n', 'utf8');
        console.log(`Successfully generated sucursal inserts at: ${outputPath}`);
    } catch (error) {
        console.error('Error generating sucursales:', error);
    }
}

generateData();
