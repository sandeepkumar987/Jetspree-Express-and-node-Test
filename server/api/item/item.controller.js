'use strict';
var Item = require('./item.model');
var mongoose = require('mongoose');
var async = require('async');

/**
 * Creates a new item in the DB.
 *
 * @param req
 * @param res
 */
exports.create = function(req, res, next) {
    Item.create(req.body, function(err, item) {
        if (err)
            return next(err);
        res.json({ 'items': item })
    });
};

/**
 * Retrive logged items.
 *
 * @param req
 * @param res
 */
exports.get = function(req, res, next) {

    var pagePerCount = parseInt(req.query.pagepercount) || 30,
        pageNumber = parseInt(req.query.pageNumber) || 0,
        //Math.max(0, req.query.pageNumber)

        skip = pagePerCount * pageNumber;

    var countQuery = function(callback) {
        Item.count({ 'isDeleted': false }, function(err, count) {
            if (err)
                return callback(err, null);
            callback(null, count)
        })
    };

    var retrieveQuery = function(callback) {
        var query = { "isDeleted": false },
            selectProp = '-__v';
        /**
         * 
         * Below Query can me made to single query 
         * so we can module it for different collection.
         * 
         * **/
        Item.find(query, selectProp)
            .skip(skip)
            .limit(pagePerCount)
            .exec(function(err, items) {
                if (err)
                    return callback(err, null);
                callback(null, items)
            });
    };

    async.parallel([countQuery, retrieveQuery], function(err, results) {
        var paginationInfo = {
            "totalResults": results[0],
            "resultPerPage": pagePerCount,
            "currentPage": pageNumber,
            "pages": Math.round((results[0] / pagePerCount))
        };
        res.status(404).json({ "items": results[1], "paginationInfo": paginationInfo });
    });
};


/**
 * Return the current logged item.
 *
 * @param req
 * @param res
 */

exports.getById = function(req, res, next) {
    var itemId = req.params.id;
    var query = { "isDeleted": false },
        selectProp = '-__v';
    query['_id'] = itemId;
    Item.findOne(query, selectProp)
        .exec(function(err, item) {
            if (err)
                return next(err);
            res.status(200).json({ "items": item });
        });
};



/**
 * Delete item by _id.
 *
 * @param req
 * @param res
 */


exports.delete = function(req, res, next) {
    var id = (req.query._id) ? req.query._id : req.params.id;
    var options = {};
    Item.findByIdAndUpdate(id, { $set: { "isDeleted": true, "updatedAt": new Date() } }, options, function(err, item) {
        if (err)
            return next(err);
        if (!item)
            return res.status(401).json(401);
        return res.status(200).json({ item: item });
    })
};


exports.put = function(req, res) {
    var data = req.body;
    data.updatedAt = new Date();
    Item.findOne({ _id: req.body._id }).exec(function(err, item) {
        if (err)
            return next(err);
        if (!item) {
            return res.json(401);
        }
        mapper(data, item, res);
    });
};

function mapper(source, destination, res) {
    destination.name = source.name;
    destination.Price = source.Price;
    destination.Brand = source.mobile;
    destination.updatedAt = source.updatedAt;
    destination.save(function(err, data) {
        if (err)
            return res.send(err);
        return res.status(200).json({ user: data });
    });
};