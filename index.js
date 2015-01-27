'use strict';
var fs = require('fs'),
    jsons = require('JSONStream'),
    es = require('event-stream'),
    flat = require('flat'),
    _ = require('lodash'),
    debug = require('debug')('DataMainin');


var filename = 'file.json',
    outputFile = 'output.csv',
    missingValueString = '?',
    marker = '"',
    separator = ',',
    uglytrick = true,
    writeStream = fs.createWriteStream(outputFile);

var allKeys = [];

//"Luddatamainin"
function checkValue(obj, key) {
    return _.has(obj, key) ?
        _(obj[key]).toString().replace(/[”“"\n]/g, '') : missingValueString;
}

function reduce(obj) {
    var str = '';
    for (var i = 0; i < allKeys.length; ++i) {
        str = str + marker + checkValue(obj, allKeys[i]) + marker + separator;
    }
    return str + '\n';
}

var transform = function() {
    debug('Inizio la trasformazione in csv');
    fs.createReadStream(filename).pipe(jsons.parse('*.projects.*'))
        .pipe(es.mapSync(function (data) {
            var flattened = flat(data);
            if (uglytrick) {
                uglytrick = false;
                return allKeys.join(',') + '\n';
            }
            return reduce(flattened);
        }))
        .pipe(writeStream);
};


if (!fs.existsSync('./allKeys.json')) {
    debug('Non esiste allKeys.json, lo creo');
    var readStream = fs.createReadStream(filename);
    readStream.pipe(jsons.parse('*.projects.*'))
        .pipe(es.mapSync(function (data) {
            var currentKeys = _.keys(flat(data));
            for (var i = 0; i < currentKeys.length; ++i) {
                if (!_.contains(allKeys, currentKeys[i])) {
                    allKeys.push(currentKeys[i]);
                }
            }
        }));

    readStream.on('end', function () {
        debug('Terminata creazione allKeys.json. Lo salvo su file');
        fs.writeFileSync('./allKeys.json', JSON.stringify(allKeys));
        readStream.close();
        transform();
    });
} else {
    debug('allKeys.json esiste, lo parso');
    allKeys = JSON.parse(fs.readFileSync('./allKeys.json', 'utf8'));
    transform();
}


