const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..', '..');
const ddlPath = path.join(projectRoot, 'creates', 'create_g.sql');
const dmlPath = path.join(projectRoot, 'insert_esquema_origen', '13_all_inserts.sql');
const outputPath = path.join(projectRoot, 'SEGURO_G29529111.sql');

function generateCompleteSourceSql() {
    try {
        console.log('Compiling complete source database script...');
        
        let ddlContent = '';
        if (fs.existsSync(ddlPath)) {
            ddlContent = fs.readFileSync(ddlPath, 'utf8').trim();
        } else {
            throw new Error(`DDL file not found at: ${ddlPath}`);
        }

        let dmlContent = '';
        if (fs.existsSync(dmlPath)) {
            dmlContent = fs.readFileSync(dmlPath, 'utf8').trim();
        } else {
            throw new Error(`DML inserts file not found at: ${dmlPath}`);
        }

        const compiledContent = [
            '-- ==========================================================================',
            '-- TRANSACTIONAL DATABASE IMPLEMENTATION SCRIPT (Fase II - BI)',
            '-- Includes both Schema DDL (Table Creation) and Poblated DML (Inserts)',
            '-- Schema Name: SEGURO_G29529111',
            '-- ==========================================================================\n',
            '-- SECTION 1: DATABASE STRUCTURE (DDL)',
            '-- ==========================================================================\n',
            ddlContent,
            '\n-- ==========================================================================',
            '-- SECTION 2: TEST DATA INITIALIZATION (DML)',
            '-- ==========================================================================\n',
            dmlContent
        ].join('\n');

        fs.writeFileSync(outputPath, compiledContent, 'utf8');
        console.log(`Successfully compiled complete script at: ${outputPath}`);
    } catch (error) {
        console.error('Error compiling complete database script:', error);
    }
}

generateCompleteSourceSql();
