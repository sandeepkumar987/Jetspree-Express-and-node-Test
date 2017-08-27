'use strict';
var express = require('express');
var path = require('path');
var config = require('./config');
module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
        res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
        next();
    });

    // @API's
    app.use('/api/items', require('./api/item'));


    app.use('/*', function(req, res, next) {
        return res.status(404).json({
            "message": "page not found"
        })
    });
    /**
     * Errror handling is done here.
     *
     * @param req
     * @param res
     */
    // no stacktraces leaked to client 
    app.use(function(err, req, res, next) {
        res.status(err.status || 200).json({
            err_msg: err.message,
            err_code: err.code || 4,
            err_type: err.type || "danger",
            data: err.body || {}
        });
    });
};