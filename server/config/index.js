'use strict';
var path = require('path');

var development = (process.env.ENV == 'prod') ? false : true;

var ip = (development) ? 'localhost' : 'localhost';

if (process.env.ENV == 'local') {
    ip = 'localhost';
}

var options = {
    server: { poolSize: 2 },
    useMongoClient: true,
};

module.exports = {
    env: process.env.ENV,
    root: path.normalize(process.cwd()),
    port: 5000,
    ip: process.env.IP || undefined,
    server: { url: 'http://localhost' },
    mongo: {
        uri: 'mongodb://' + ip + '/testdb',
        options: options
    }
};