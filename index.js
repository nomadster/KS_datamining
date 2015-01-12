#!/usr/bin/env node
'use strict';
///* Let's parse this fucking dataset and make it flat: http://werobots.io/kickstarter-datasets/ */
//var fs = require('fs'),
//    jsons = require('JSONStream'),
//    es = require('event-stream'),
//    flat = require('flat'),
//    _ = require('lodash');
//
//var uglytrick = false,
//    separator = ',',
//    marker = '"',
//    filename = 'file.json',
//    outputFile = 'output.csv',
//    writeStream  = fs.createWriteStream(outputFile);
//
//function reduce(obj){
//    return _.reduce(obj, function(acc, val){
//	val = _(val).toString().replace(/[”“"\n]/g,'');
//	acc = acc + marker + val + marker + separator;
//	return acc;
//	},'') + '\n';
//}
//
//
//fs.createReadStream(filename).pipe(jsons.parse('*.projects.*'))
//  .pipe(es.mapSync(function (data) {
//    var flattened = flat(data);
//    if(uglytrick === false){
//      var added = _(Object.keys(flattened)).toString()+'\n';
//      uglytrick = true;
//      return added + reduce(flattened);
//    }
//    return reduce(flattened);
//  }))
//  .pipe(writeStream);


var program = require('commander'),
    fs = require('fs'),
    jsons = require('JSONStream'),
    es = require('event-stream'),
    flat = require('flat'),
    _ = require('lodash'),
    debug=require('debug')('Command'),
    packageJSON = require('./package.json'),
    extractKeys = require('./utils/extractKeys');


function generateKeys(sourceFile){
    debug('generateKeys command issued');
    var allKeys = [],
        readStream = fs.createReadStream(sourceFile);
    debug('readStream created successfully: ', readStream);
    readStream.pipe(jsons.parse('*.project.*')) //TODO: Make this configurable via command parameter
        .pipe(es.mapSync(function(data){
            debug('Got data from file. allKeys now is %s', allKeys);
            //TODO: qua uniq forse è un abuso di spazio: potrei fare if !_.has + push ?
            _.uniq(allKeys, extractKeys(data));

        }));

    readStream.on('error', function(err){
        debug('Got an error from readStream: %s\n%s',err,err.stack);
        process.exit(0);
    });

    readStream.on('end', function(){
        var writeStream = fs.createWriteStream('./allKeys.json');
        writeStream.on('error', function(err){
            debug('Got an error from writeStream: %s\n%s',err,err.stack);
            process.exit(0);
        });
        allKeys.forEach(function(key) { writeStream.write(key.join(', ') + '\n'); });
        writeStream.end();
    });
}

program.version(packageJSON.version)
    .command('generateKeys <sourceFile>')
    .action(generateKeys);

program.parse(process.argv);
