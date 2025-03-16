const nodemailer = require('nodemailer');

const pgsdb = require('../library/pgsdb');
const crypto = require('crypto');
const db = new pgsdb();
// var smtpTransport = require('nodemailer-smtp-transport');


// Decryption function
function decrypt(encryptedText, algorithm, secretKey) {
  const [ivHex, encryptedHex] = encryptedText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encryptedTextBuffer = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), iv);
  let decrypted = decipher.update(encryptedTextBuffer);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

const getTransporter = async (userId, camp_id = 0, title = '', customerId) => {
  const algorithm = 'aes-256-cbc';
  const secretKey = '12345678901234567890123456789012';
  try {
    const query = `service,host,port,username,password`;
    const mailServiceTable = `user_${customerId}.mail_services`;
    const config = await db.select(mailServiceTable, query, [`user_id = ${userId}`]);
    let transporter = '';
    if (!config) {
      transporter = nodemailer.createTransport({
        service: process.env.LOCAL_MAIL_SERVICE,
        host: process.env.LOCAL_MAIL_HOST,
        port: process.env.LOCAL_MAIL_PORT,
        auth: {
          user: process.env.LOCAL_MAIL_USER, // Your Rediff email address
          pass: process.env.LOCAL_MAIL_PASSWORD // Your Rediff email password
        }
      });
    } else {
      transporter = nodemailer.createTransport({
        host: decrypt(config.host, algorithm, secretKey),
        port: decrypt(config.port, algorithm, secretKey),
        auth: {
          user: decrypt(config.username, algorithm, secretKey),
          pass: decrypt(config.password, algorithm, secretKey)
        }
      });
    }

    // Verify transporter configuration
    transporter.verify((error, success) => {
      
    });

    return transporter;
  } catch (error) {
   
    throw error;
  }
};

module.exports = getTransporter;
