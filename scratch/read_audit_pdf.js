const fs = require('fs');
const pdf = require('pdf-parse');

async function readPdf() {
    const dataBuffer = fs.readFileSync('D:/24 digitals/24 Digitals 2026 - April.pdf');
    const data = await pdf(dataBuffer);
    console.log(data.text);
}

readPdf().catch(console.error);
