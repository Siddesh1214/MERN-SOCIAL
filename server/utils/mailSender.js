const nodemailer = require('nodemailer');

require('dotenv').config();

const mailSender = async (email,title, message) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    })

    let info = await transporter.sendMail({
      from: 'Mern Social - A SocialMedia Application',
      to: `${email}`,
      subject:title,
      text: message,
    })

    console.log(info);
    return info;
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = mailSender;