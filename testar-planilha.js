const GoogleSpreadSheet = require('google-spreadsheet');
const credentials = require('./bugtracker.json');

const doc = new GoogleSpreadSheet('17DKLD-37yIas5kU_TLQU2RZ9iyck2l-ZA2O9uQDiEWE');
doc.useServiceAccountAuth(credentials, (err) => {
  if (err) {
    console.error('Não foi possível abrir a planilha');
  } else {
    console.log('A planilha está aberta.');
    doc.getInfo((err, info) => {
      console.log(info);
      const worksheet = info.worksheets[0];
      worksheet.addRow({name: 'Strawlley', email: 'strawlley@gmail.com'}, (err) => {
        console.log('linha inserida');
      });
    });
  }
});