var nodemailer = require('nodemailer');
var config = require('../config/database')
var transporter = nodemailer.createTransport({
  //  service: config.servicemailer,

    name: 'localhost',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: config.authmailer
  });
exports.send = function(useremail,pass) {

   var mailOptions = {
        from: config.authmailer.user,
        to: useremail,
        subject: 'Sending Email using Node.js',
        //text: 'This is your password : '+ pass
        html: '<h1>Welcome</h1><p>This is your password : '+ pass +'</p>'
      };
      console.log(mailOptions)

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      }); 
  }   


  
