var express = require('express');
var actions = require('../methods/actions');
var auth = require('../methods/auth');
var clients = require('../methods/client');
var oauth2 = require('../methods/oauth2');

var router = express.Router();

router.post('/authenticate', actions.authenticate);
router.post('/adduser', actions.addNew);
router.get('/getinfo', actions.getinfo);

router.get('/users', actions.getusers);
router.route('/users/:id').delete( actions.deleteusers);


router.route('/clients')
            .post(auth.isAuthenticated, clients.postClients)
            .get(auth.isAuthenticated, clients.getClients);
            
router.route('/clients/:id').delete( auth.isAuthenticated, clients.deleteClients);    
router.get('/me',auth.isBearerAuthenticated, actions.me)

router.route('/oauth2/authorize')
  .get(oauth2.authorization)
  .post(oauth2.decision);

// Create endpoint handlers for oauth2 token
router.route('/oauth2/token')
  .post(auth.isClientAuthenticated, oauth2.token);


  
router.post('/saveimg',auth.isBearerAuthenticated, actions.saveimg);
router.get('/showimg',auth.isBearerAuthenticated, actions.showimg);
router.get('/readimg',auth.isBearerAuthenticated, actions.readimg);
router.get('/getimg',auth.isBearerAuthenticated, actions.getimg);
router.get('/getimgByid',auth.isBearerAuthenticated, actions.getimgByid);
router.get('/getAllImg',auth.isBearerAuthenticated, actions.getAllImg);

 
module.exports = router;