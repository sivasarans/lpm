const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'alert.vamtec@gmail.com',
    pass: 'vwny adku qtap trzd' // your app password
  }
});

const mailOptions = {
  from: 'alert.vamtec@gmail.com',
  to: 'yourtestemail@example.com', // replace with your test email
  subject: '✅ Nodemailer Test',
  text: 'This is a test email from Nodemailer using Gmail App Password.'
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log('❌ Error:', error);
  }
  console.log('✅ Email sent:', info.response);
});
