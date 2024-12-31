import { font, font_bold } from "../fonts/fonts.js";
import timestampToDate from "./timestampToDate.js";

function formatStreet(street, street_number, apartment_number) {
    if(apartment_number) {
        return `ul. ${street} ${street_number}/${apartment_number}`;
    }

    return `ul. ${street} ${street_number}`;
}

function formatUserName(firstname, lastname) {
    return `${firstname} ${lastname}`;
}

function formatMoney(price) {
    return price > 0 ? price.toFixed(2) : '-';
}

function generatePDF(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('a4');

    const {
        signature,
        issue_date,

        setting_name,
        setting_firstname,
        setting_lastname,
        setting_phone,
        setting_city,
        setting_post_code,
        setting_street,
        setting_street_number,
        setting_apartment_number,

        rents
    } = data;

    // Font
    doc.setFontSize(12);

    doc.addFileToVFS('arial-normal.ttf', font);
    doc.addFont('arial-normal.ttf', 'arial', 'normal');

    doc.addFileToVFS('arialbd-normal.ttf', font_bold);
    doc.addFont('arialbd-normal.ttf', 'arialbd', 'normal');

    doc.setFont("arial");

    // Prawa
    doc.text("Data wydania " + timestampToDate(issue_date, '.', 'DDMMYYYY'), 190, 16, { align : "right" });

    // Lewa
    doc.text(setting_name, 14, 23);
    doc.text(formatUserName(setting_firstname, setting_lastname), 14, 30)
    doc.text(formatStreet(setting_street, setting_street_number, setting_apartment_number), 14, 37);
    doc.text(`tel. ${setting_phone}`, 14, 44);
    doc.text(`${setting_post_code} ${setting_city}`, 14, 51);

    // // Prawa
    // doc.text(contrahent_name, 190, 44, { align : "right" });
    // doc.text(formatUserName(contrahent_firstname, contrahent_lastname), 190, 51, { align : "right" });
    // doc.text(formatStreet(contrahent_street, contrahent_street_number, contrahent_apartment_number), 190, 58, { align : "right" });
    // doc.text(`${contrahent_post_code} ${contrahent_city}`, 190, 65, { align : "right" }); 

    // Środek
    doc.setFontSize(18);
    doc.setFont("arialbd");
    doc.text(`Oferta ${signature}`, 102, 89, { align: "center" });

    doc.setFont("arial");
    doc.setFontSize(12);

    // Generate data for table
    const columns = [
        "Nazwa",
        "Ilość",
        "J.m.",
        "Cena netto",
        "Wartość netto",
        "Stawka VAT",
        "Kwota VAT",
        "Wartość brutto"
    ];

    const table_rows = rents.map((el, index) => {
        return {
            name: el.name,
            count: el.count,
            unit: el.unit,
            price_netto: el.price_netto,
            price_sum_netto: el.price_sum_netto,
            vat: el.vat,
            price_vat: el.price_vat,
            price_brutto: el.price_brutto
        }
    });

    const total_price_sum_netto = table_rows.reduce((sum, el) => sum + el.price_sum_netto, 0);
    const total_price_vat = table_rows.reduce((sum, el) => sum + el.price_vat, 0);
    const total_price_brutto = table_rows.reduce((sum, el) => sum + el.price_brutto, 0);

    const body = [...table_rows.map(el => [
            el.name, 
            el.count, 
            el.unit, 
            formatMoney(el.price_netto), 
            formatMoney(el.price_sum_netto), 
            el.vat, 
            formatMoney(el.price_vat), 
            formatMoney(el.price_brutto)
        ]), 
        
        [{
            content: `Razem`, 
            colSpan: 4, 
        },
        {
            content: formatMoney(total_price_sum_netto),
            colSpan: 1
        },
        {
            content: '',
            colSpan: 1
        },
        {
            content: formatMoney(total_price_vat),
            colSpan: 1
        },
        {
            content: formatMoney(total_price_brutto),
            colSpan: 1
        }]
    ];

    // Adding the table
    doc.autoTable({
        startY: 100,
        head: [columns],   // Column headers
        body: body,        // Table data
        styles: {
            lineColor: [0, 0, 0], // Black lines
            fillColor: [255, 255, 255],
            font: "arial"
        },
        columnStyles: {
            0: { minCellWidth: 50 }  // Set a static width for the "Nazwa" column
        },
        headStyles: {
            fillColor: [255, 255, 255], // White header background
            textColor: [0, 0, 0], // Black text color
            lineWidth: 0.2,
            lineColor: [0, 0, 0], // Black header borders
            font: "arialbd"
        },
        bodyStyles: {
            fillColor: [255, 255, 255], // White body background
            textColor: [0, 0, 0], // Black text color
            lineWidth: 0.2,
            lineColor: [0, 0, 0], // Black body borders
        }
    });
    

    // const tableHeight = doc.lastAutoTable.finalY;

    // doc.text("Podpis", 178, tableHeight + 15, { align: "right" });
    // doc.text("................................", 190, tableHeight + 25, { align: "right" });

    // Save the PDF
    return doc.output('datauristring');
}

export default generatePDF;