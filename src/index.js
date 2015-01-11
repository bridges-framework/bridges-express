var express           = require('express');
var BridgesController = require('bridges-controller');
var BridgesRoutes     = require('bridges-routes');
var fs                = require('fs');
var path              = require('path');
var bodyParser        = require('body-parser');

class BridgesExpress {

  constructor(options) {
    if (!fs.existsSync(options.directory)) {
      throw new Error('options.directory must be a directory')
    }
    this.directory = options.directory;
    var server = express()
    
    if (!options.controllers) {
      options.controllers = { inject: [] }
    }
  
    var controllers = BridgesController.load({
      directory : path.join(options.directory, '/controllers'),
      inject : options.controllers.inject
    })

    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: true }));

    server.use('/', BridgesRoutes.draw({
      controllers : controllers,
      path        : path.join(options.directory, 'config/routes')
    }))
   
    server.use(function(error, req, res, next) {
      if (error) {
        res.status(500).send({
          success: false,
          error  : error.message
        })
      } else {
        next()
      }
    })

    return server
  }
}

module.exports = BridgesExpress

