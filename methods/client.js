// Load required packages
var Client = require('../models').client;

// Create endpoint /api/client for POST
exports.postClients = function(req, res) {
  // Create a new instance of the Client model
  var client = new Client();

  // Set the client properties that came from the POST data
  client.name = req.body.name;
  client._id = req.body._id;
  client.secret = req.body.secret;
  client.userId = req.body.userId;

console.log(client);
  // Save the client and check for errors
  client.save().then(() => {
    res.send({ message: 'Client added to the locker!', data: client })
  }).catch( error =>res.send(error))
}   

// Create endpoint /api/clients for GET
exports.getClients = function(req, res) {
  // Use the Client model to find all clients
  Client.findAll({ where: {userId: req.query.userId} })
  .then(clients => {  res.json(clients); })
  .catch(error =>  res.send(error))

};