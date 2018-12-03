var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../models').User;
var Client = require('../models').client;
var config = require('../config/database');
var Token = require('../models').token;
var JwtBearerStrategy = require('passport-http-jwt-bearer');
var BasicStrategy = require('passport-http').BasicStrategy;


     var opts = {};
    opts.secretOrKey =  config.secret;
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
    
    
    passport.use(new JwtStrategy(opts, function(jwt_payload, done){
        User.findOne({where : {id: jwt_payload.id}})
        .then(user =>{ done(null, user)})
        .catch(error =>    done(error, false));

    }));

    passport.use('basic-strategy', new BasicStrategy(
  function(username, password, callback) {
    Client.findOne({where : { _id: username }})
    .then(client => {
        if (!client || client.secret !== password) { return callback(null, false); }
        callback(null, client);
    })
    .catch(err => callback(err))

  }
));
    
    passport.use(new JwtBearerStrategy(
   config.secret,
   function(token, done) {
    Token.find({
      where: {
         id: token.id
      }
   }).then(function(user) {
    if (!user) { return done(null, false); }
    return done(null, user, token);
     });
   }
 ));

exports.isBearerAuthenticated = passport.authenticate('jwt-bearer', {session: false});

exports.isAuthenticated = passport.authenticate(['jwt'], {session: false});

exports.isClientAuthenticated = passport.authenticate('basic-strategy', { session : false });

