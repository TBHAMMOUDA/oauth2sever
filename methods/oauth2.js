// Load required packages
var oauth2orize = require('oauth2orize')
var User = require('../models').User;
var Client = require('../models').client;
var Token = require('../models').token;
var Code = require('../models').code;
var auth = require('./auth.js');
var config = require('../config/database');
var jwt = require('jwt-simple');

var server = oauth2orize.createServer();

// Register serialialization function
server.serializeClient(function(client, callback) {
  return callback(null, client.id);
});

// Register deserialization function
server.deserializeClient(function(id, callback) {
  Client.findOne({ where: {id: id} })
  .then(client => { callback(null, client) })
  .catch(error => { callback(error)});
  
});

// Register authorization code grant type
server.grant(oauth2orize.grant.code(function(client, redirectUri, user, ares, callback) {
  // Create a new authorization code
 var code = new Code({
    value: uid(16),
    clientId: client.id,
    redirectUri: redirectUri,
    userId: client.userId
  });

  // Save the auth code and check for errors
  code.save().then(() => {
    callback(null, code.value);
  }).catch( error =>{
    callback(error)} )

}));

server.exchange(oauth2orize.exchange.code(function(client, code, redirectUri, callback) {
  Code.findOne({ where: {value: code} })
.then(authCode => { 
 // console.table(authCode)
  if (authCode === undefined) { return callback(null, false); }
  if (client.id !== authCode.clientId) { return callback(null, false); }
  if (redirectUri !== authCode.redirectUri) { return callback(null, false); }
 // Delete auth code now that it has been used
 authCode.destroy();
   // Create a new access token
   var token = new Token({
    value: uid(254),
    clientId: authCode.clientId,
    userId: authCode.userId
  });
  token.save().then(() => {
    var enctoken = jwt.encode(token, config.secret);
    callback(null, enctoken);
  }).catch( error => callback(error))
})
.catch(error =>  callback(error));
}));

// User authorization endpoint
exports.authorization = [
  server.authorization(function(clientId, redirectUri, callback) {

    Client.findOne({where : { _id: clientId }})
    .then(client => callback(null, client, redirectUri))
    .catch(err =>  callback(err) )
  }),

  function(req, res){
    console.log(config.userid);
    res.render('dialog', { transactionID: req.oauth2.transactionID, user: config.userid, client: req.oauth2.client });
  }
]

exports.decision = [
  server.decision()
]

// Application client token exchange endpoint
exports.token = [
  server.token(),
  server.errorHandler()
]

function uid (len) {
  var buf = []
    , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    , charlen = chars.length;

  for (var i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }

  return buf.join('');
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}