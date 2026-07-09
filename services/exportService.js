const ExcelJS = require("exceljs");
const { createObjectCsvStringifier } = require("csv-writer");


// ======================================
// Generate Excel
// ======================================

const generateExcel = async ({
    sheetName = "Report",
    columns,
    data
}) => {

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet(sheetName);


    worksheet.columns = columns;


    data.forEach(row => {
        worksheet.addRow(row);
    });


    return await workbook.xlsx.writeBuffer();

};



// ======================================
// Generate CSV
// ======================================

const generateCSV = ({
    columns,
    data
}) => {


    const csvStringifier =
        createObjectCsvStringifier({
            header: columns.map(col => ({
                id: col.key,
                title: col.header
            }))
        });


    return (
        csvStringifier.getHeaderString() +
        csvStringifier.stringifyRecords(data)
    );

};



module.exports = {
    generateExcel,
    generateCSV
};