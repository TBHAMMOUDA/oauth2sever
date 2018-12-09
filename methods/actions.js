var User = require('../models').User
var Img = require('../models/mongose/img');
var config = require('../config/database');
var jwt = require('jwt-simple');
const bcrypt = require('bcryptjs');
var fs = require('fs');
var QrCode = require('qrcode-reader');
const jimp = require('jimp');


var functions = {
    authenticate: function(req, res) {
       

        User.findOne({ where: {email: req.body.email} })
        .then(user => { 
            if(!user) {
                res.status(403).send({success: false, msg: 'Authentication failed, User not found'});
            }
           else {
          bcrypt.compare(req.body.password, user.password, function(err, res_bcrypt) {
            if(res_bcrypt) {
                var token = jwt.encode(user, config.secret);
                res.json({success: true, token: token});
                config.userid = user.id;         
            } else {
            return res.status(403).send({success: false, msg: 'Authenticaton failed, wrong password.'});
            } 
          });
        }
        })
        .catch(error => res.status(400).send(error));
    },
    addNew: function(req, res){
        if((!req.body.email) || (!req.body.password)){
            console.log(req.body.email);
            console.log(req.body.password);
            
            res.json({success: false, msg: 'Enter all values'});
        }
        else {
            bcrypt.hash(req.body.password, 10, function(err, hash) {

                User.findOrCreate(
                  {  where: {email: req.body.email}, 
                     defaults: {
                      firstName: req.body.first_name, 
                      lastName: req.body.last_name,
                      email: req.body.email,
                      password:hash, 
                     }
                  }).spread((user, created) => {
             // console.log(user.get({ plain: true}))
             // console.log(created)
             if(created==false)
              res.status(400).send({message:'Sorry !! this e-mail is associated to an existing account'})
              res.status(201).send({success:true})
             })
            })
        }
    },
    getinfo: function(req, res){
        if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1];
            var decodedtoken = jwt.decode(token, config.secret);
            return res.json({success: true, msg: 'hello '+decodedtoken.firstName+" "+decodedtoken.lastName});
        }
        else {
            return res.json({success:false, msg: 'No header'});
        }
    },
    saveimg: function(req, res) {
        imgPath=__dirname +'/../config/qr.jpg';

        var image = new Img();
        image.img.data = fs.readFileSync(imgPath);
        image.img.contentType = 'image/png';
        image.save(function (err, image) {
          if (err) throw err;
    
          console.error('saved img to mongo');
        })
        res.send(true);
    }
,
getimg: function(req, res) {
        Img.findById(req.query.id, function(err, doc) {
    if (err)
      res.send(err);
      dPath=__dirname +'/../config/dd.png'
      // var base64data = new Buffer(doc.img.data, 'binary').toString('base64');
      //var originaldata = new Buffer(base64data, 'base64');
      fs.writeFile(dPath,doc.img.data,function(err) {
        console.log("done");
      });
      res.send(doc.data);
    })
},
     showimg: function(req, res) {
        Img.findById(req.query.id, function (err, doc) {
            if (err) send(err);
           res.contentType(doc.img.contentType);
            res.send(doc.img.data);
          });
    },
    readimg: function(req, res) {
        //   const img = jimp.read(fs.readFileSync('C:/Users/BHRX/Desktop/pds_project/qr.png'));
       
       var buffer = fs.readFileSync(__dirname +'/../config/qr.jpg');
       jimp.read(buffer, function(err, image) {
           if (err) {
               console.error(err);
               // TODO handle error
           }
           var qr = new QrCode();
           qr.callback = function(err, value) {
               if (err) {
                   console.error(err);
                   // TODO handle error
                   res.send(err)
               }
               console.log(value);
              // console.log(value);
               res.send(value)
           };
           qr.decode(image.bitmap);
       });
       }
    
}

module.exports = functions;
