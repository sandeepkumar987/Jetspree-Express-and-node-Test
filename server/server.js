'use strict';
var express = require('express');
var mongoose = require('mongoose');
var compression = require('compression');
var config = require('./config');
var bodyParser = require('body-parser');
var app = express();
// var server = require('http').createServer(app);
var fs = require('fs');
var path = require('path');

mongoose.connect(config.mongo.uri, config.mongo.options, function(err) {
    if (err) {
        console.log(err);
        return;
    }

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(compression());

    require('./routes')(app);
});
app.listen(config.port, config.ip, function() {
    var message = (config.env == 'dev') ? 'Development' : 'Production';
    if (!config.env) message = "Local";
    console.log('TestServer Running In ' + message + ' : %d', config.port);
});
//module.exports = server;