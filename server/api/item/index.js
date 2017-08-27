'use strict';
var express = require('express'),
    router = express.Router(),
    controller = require('./item.controller');
router.get('/', controller.get);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.patch('/', controller.put);
router.delete('/:id', controller.delete);
module.exports = router;