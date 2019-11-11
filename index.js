const express = require('express');
const path = require('path');
const GoogleSpreadSheet = require('google-spreadsheet');
const credentials = require('./bugtracker.json');
const {promisify} = require('util');
const sgMail = require('@sendgrid/mail');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));

sgMail.setApiKey('SGMAIL_API_KEY');

const docId = 'DOC_ID';
const worksheetIndex = 0;

app.get('/', (request, response) => {
  response.render('home');
});

app.post('/', async(request, response) => {
  try {
    const doc = new GoogleSpreadSheet(docId);
    await promisify(doc.useServiceAccountAuth)(credentials);
    console.log('A planilha está aberta.');
    const info = await promisify(doc.getInfo)();
    const worksheet = info.worksheets[worksheetIndex];
    await promisify(worksheet.addRow)(request.body);
    response.render('sucesso');
  } catch (err) {
    response.send("Erro ao enviar formulário.");
    console.error(err);
  }

  if (request.body.issueType === 'CRITICAL') {
    const msg = {
      to: 'strawlley@gmail.com',
      from: 'bugtacker@bugtracker.com',
      subject: 'BUG CRITICO REPORTADO!',
      text: `O usuário ${request.body.name} reportou um problema.`,
      html: `<strong>O usuário ${request.body.name} reportou um problema.</strong>`,
    };
    try {
      await sgMail.send(msg);
      console.log('Email enviado com sucesso!');
    } catch (err) {
      console.error('Erro ao enviar email', err);
    }
  }
});

var server = app.listen(3000, (err) => {
  if (err) {
    console.error()
  } else {
    console.log(`BugTracker rodando na porta http://localhost:${server.address().port}`);
  }
});
