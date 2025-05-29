var nodemailer = require('nodemailer');
const path = require('path')
const { engine } = require('express-handlebars');
const nodemailerExpressHandlebars = require('nodemailer-express-handlebars').default;



// const hbs = require('nodemailer-express-handlebars');

const transporter = nodemailer.createTransport({
  pool: true,
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
});

const handlebarOptions = {
  viewEngine: {
    layoutsDir: path.resolve('./views/'),
    partialsDir: path.resolve('./views/'),
    defaultLayout: 'template',
  },
  viewPath: path.resolve('./views/'),
};

transporter.use('compile', nodemailerExpressHandlebars(handlebarOptions));
// transporter.use('compile', hbs(handlebarOptions))

// const fromEmailId = '"Notifications" notifications@actiknow.com';
const fromEmailId = '"Notifications" abcd@actiknow.com';

const sendMail = async (toEmail, subject, context, template) => {
  var mailOptions = {
    from: fromEmailId,
    to: toEmail,
    cc: 'vandana.sharma@actiknow.com',
    subject: subject,
    template: template,
    context: context
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;  // Optional: re-throw error if you want to handle it elsewhere
  }
};

module.exports = {
  sendMail: sendMail
};