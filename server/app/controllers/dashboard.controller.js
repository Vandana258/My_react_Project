const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { exit } = require('process');

// exports.generatePdf = async (req, res) => {
//   try {
//     const browser = await puppeteer.launch({
//       headless: 'new', // For Puppeteer v20+
//       args: ['--no-sandbox', '--disable-setuid-sandbox'],
//     });

//     const page = await browser.newPage();

//     const html = `
//       <html>
//         <head>
//           <style>
//             body { font-family: Arial; padding: 20px; }
//             h1 { color: #2e6c80; }
//             p { font-size: 14px; }
//           </style>
//         </head>
//         <body>
//           <h1>PDF Generated with Puppeteer</h1>
//           <p>This PDF was generated on the server using Node.js and Puppeteer.</p>
//         </body>
//       </html>
//     `;

//     await page.setContent(html, { waitUntil: 'domcontentloaded' });
//     const pdfBuffer = await page.pdf({ format: 'A4' });

//     await browser.close();

//     res.set({
//       'Content-Type': 'application/pdf',
//       'Content-Disposition': 'attachment; filename=generated.pdf',
//     });

//     const pdfDir = path.join(__dirname, '../../assets/pdf');

//     if (!fs.existsSync(pdfDir)) {
//         fs.mkdirSync(pdfDir, { recursive: true });
//     }

//     const filePath = path.join(pdfDir, 'generated.pdf');
//     fs.writeFileSync(filePath, pdfBuffer);


//     res.send(pdfBuffer);
//   } catch (error) {
//     console.error('PDF generation failed:', error);
//     res.status(500).send('Error generating PDF');
//   }
// };

exports.generatePdf = async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    const html = `
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #2e6c80; }
            p { font-size: 14px; }
          </style>
        </head>
        <body>
          <h1>PDF Generated with Puppeteer</h1>
          <p>This PDF was generated on the server using Node.js and Puppeteer.</p>
        </body>
      </html>
    `;

    // 👇 Set HTML content and wait for full load
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // 👇 Ensure CSS is applied correctly
    await page.emulateMediaType('screen');

    // 👇 Save the PDF buffer
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true, // include background styles
    });

    // 👇 Close browser
    await browser.close();

    // 👇 Save to disk (optional)
    const pdfDir = path.join(__dirname, '../../assets/pdf');
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }
    const filePath = path.join(pdfDir, 'generated.pdf');
    fs.writeFileSync(filePath, pdfBuffer);

    // 👇 Send PDF to client
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=generated.pdf',
    });
    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF generation failed:', error);
    res.status(500).send('Error generating PDF');
  }
};