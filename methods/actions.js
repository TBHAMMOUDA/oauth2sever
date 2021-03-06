var User = require('../models').User
var Img = require('../models/mongose/img');
var config = require('../config/database');
var jwt = require('jwt-simple');
const bcrypt = require('bcryptjs');
var fs = require('fs');
var QrCode = require('qrcode-reader');
const jimp = require('jimp');
var mailer = require('./mailer');


var functions = {

    me : function(req, res) {
          res.send(req.user)
      },
    
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
                res.json({success: true, token: token, admin: true});
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
              mailer.send(req.body.email,req.body.password)
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

    getusers: function(req, res ){
        User.findAll({}).then(users => { 
            if(!users) {
                res.status(403).send({success: false, msg: 'Error'});
            }
            return res.json(users);
        })
    },
    deleteusers: function(req, res ){
        User.findOne({ where: {id: req.params.id} })
        .then(user => { 
            if(!user)
                res.status(403).send({success: false, msg: 'no user'});
           else  
           user.destroy({ force: true });
                res.json({success: true });
                  } 
         )
        .catch(error => res.status(400).send(error));
    },
    saveimg: function(req, res) {
        imgPath=__dirname +'/../config/dd.png';
        console.log(imgPath)
        var image = new Img();
        image.ref="ref2"
        image.name="img2"
        image.userId=5
        image.comment="testing test test"
        image.color="red"
        image.price="1222"
        image.img.data = fs.readFileSync(imgPath);
        image.img.contentType = 'image/png';
        console.log(image)
        image.save(function (err, image) {
          if (err) throw err;
    
          console.error('saved img to mongo');
        })
        res.send(true);
    }
,

getimgByid: function(req, res) {
    Img.findById(req.query.id, function(err, doc) {
if (err)
  res.send(err);
  res.send(doc);
})
},

getAllImg: function(req, res) {
    Img.find({userId : req.user.userId}, function(err, imgs) {
if (err)
  res.send(err);
  res.send(imgs);
})
},
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
