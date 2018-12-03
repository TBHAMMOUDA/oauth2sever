var User = require('../models').User
var Book = require('../mongomodel/book');
var config = require('../config/database');
var jwt = require('jwt-simple');
const bcrypt = require('bcryptjs');


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
    addBook: function(req, res) {
        var newBook = Book({
            name: req.body.name,
            quantity: req.body.quantity,
            userId: req.user.id
        });
        
        newBook.save(function(err, newBook) {
            if(err)
            console.log(err);
            else
            res.json({ message: 'Book added to the locker!', data: newBook });
        })
    },
    getBooks: function(req, res) {
        Book.find({ userId: req.user.id }, function(err, books) {
    if (err)
      res.send(err);

    res.json(books);
  });
    }
    
}

module.exports = functions;
