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
  client.userId = req.user.id;

console.log(client);
  // Save the client and check for errors
  client.save().then(() => {
    res.send({ message: 'Client added to the locker!', data: client })
  }).catch( error =>res.send(error))
}   

// Create endpoint /api/clients for GET
exports.getClients = function(req, res) {
  // Use the Client model to find all clients
  Client.findAll({ where: {userId: req.user.id} })
  .then(clients => {  res.json(clients); })
  .catch(error =>  res.send(error))
};
  exports.deleteClients= function(req, res) {

    Client.findOne({ where: {id: req.params.id} })
    .then(client => { 
        if(!client)
            res.status(403).send({success: false, msg: 'no client'});
       else  
       client.destroy({ force: true });
            res.json({success: true });
              } 
     )
    .catch(error => res.status(400).send(error));
    
//   res.json(req.params.id)
  };


