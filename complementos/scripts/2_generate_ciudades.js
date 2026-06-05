const fs = require('fs');
const path = require('path');
const https = require('https');

// Paths
const csvFilePath = path.join(__dirname, '..', 'datos_crudos', 'ciudades.csv');
const paisesSqlPath = path.join(__dirname, '..', '..', 'insert_esquema_origen', '1_insert_paises.sql');
const ciudadesSqlPath = path.join(__dirname, '..', '..', 'insert_esquema_origen', '2_insert_ciudades.sql');
const mappingUrl = 'https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/slim-3/slim-3.json';

function fetchMapping() {
    return new Promise((resolve, reject) => {
        https.get(mappingUrl, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

async function main() {
    try {
        console.log('Fetching ISO 3166 country mapping data...');
        const countryList = await fetchMapping();
        
        // Map: alpha-3 -> country-code (numeric as integer)
        const iso3ToNumeric = {};
        for (const country of countryList) {
            const code = parseInt(country['country-code'], 10);
            if (!isNaN(code)) {
                iso3ToNumeric[country['alpha-3']] = code;
            }
        }

        console.log('Reading Spanish names from existing 1_insert_paises.sql...');
        const spanishNamesMap = {}; // numericCode -> SpanishName
        if (fs.existsSync(paisesSqlPath)) {
            const paisesContent = fs.readFileSync(paisesSqlPath, 'utf8');
            const paisRegex = /VALUES\s*\(\s*(\d+)\s*,\s*'([^']+)'\s*\)/gi;
            let match;
            while ((match = paisRegex.exec(paisesContent)) !== null) {
                spanishNamesMap[parseInt(match[1], 10)] = match[2];
            }
        }

        console.log('Reading CSV file...');
        let csvContent = fs.readFileSync(csvFilePath, 'utf8');
        // Strip BOM if present
        csvContent = csvContent.replace(/^\ufeff/, '');
        
        const lines = csvContent.split(/\r?\n/);
        
        if (lines.length === 0) {
            console.error('CSV file is empty');
            return;
        }

        // Parse headers: city;city_ascii;country;iso2;iso3
        const headers = lines[0].split(';');
        const cityIdx = headers.indexOf('city');
        const countryIdx = headers.indexOf('country');
        const iso3Idx = headers.indexOf('iso3');

        if (cityIdx === -1 || countryIdx === -1 || iso3Idx === -1) {
            throw new Error(`CSV headers are missing required fields. Found: ${lines[0]}`);
        }

        const countriesMap = new Map(); // iso3 -> { id, englishName, spanishName }
        const citiesList = [];
        let nextCountryId = 1;

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const cols = line.trim().split(';');
            if (cols.length < headers.length) {
                continue;
            }

            const cityName = cols[cityIdx];
            const countryName = cols[countryIdx];
            const iso3 = cols[iso3Idx];

            if (!iso3) continue;

            if (!countriesMap.has(iso3)) {
                const numericCode = iso3ToNumeric[iso3];
                let spanishName = countryName;
                if (numericCode && spanishNamesMap[numericCode]) {
                    spanishName = spanishNamesMap[numericCode];
                }
                countriesMap.set(iso3, {
                    id: nextCountryId++,
                    englishName: countryName,
                    spanishName: spanishName
                });
            }

            const countryInfo = countriesMap.get(iso3);

            citiesList.push({
                cityName: cityName,
                codPais: countryInfo.id
            });
        }

        console.log(`Processing complete. Found ${countriesMap.size} countries and ${citiesList.length} cities.`);

        // Generate 1_insert_paises.sql
        const paisesSqlLines = ['-- PAIS Inserts'];
        for (const [iso3, info] of countriesMap.entries()) {
            const escapedName = info.spanishName.replace(/'/g, "''");
            paisesSqlLines.push(`INSERT INTO PAIS (cod_pais, nb_pais) VALUES (${info.id}, '${escapedName}');`);
        }

        console.log(`Writing PAIS SQL inserts to: ${paisesSqlPath}`);
        fs.writeFileSync(paisesSqlPath, paisesSqlLines.join('\n') + '\n', 'utf8');

        // Generate 2_insert_ciudades.sql
        const ciudadesSqlLines = ['-- CIUDAD Inserts'];
        let codCiudad = 1;
        for (const city of citiesList) {
            const escapedCityName = city.cityName.replace(/'/g, "''");
            ciudadesSqlLines.push(`INSERT INTO CIUDAD (cod_ciudad, nb_ciudad, cod_pais) VALUES (${codCiudad}, '${escapedCityName}', ${city.codPais});`);
            codCiudad++;
        }

        console.log(`Writing CIUDAD SQL inserts to: ${ciudadesSqlPath}`);
        fs.writeFileSync(ciudadesSqlPath, ciudadesSqlLines.join('\n') + '\n', 'utf8');
        console.log('Both SQL files generated successfully!');
    } catch (error) {
        console.error('Error running script:', error);
    }
}

main();
