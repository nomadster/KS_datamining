'use strict';
/* Let's parse this fucking dataset and make it flat: http://werobots.io/kickstarter-datasets/ */
var fs = require('fs'),
    jsons = require('JSONStream'),
    es = require('event-stream'),
    flat = require('flat'),
    _ = require('lodash');

var uglytrick = false,
    separator = ',',
    marker = '"',
    filename = 'file.json',
    outputFile = 'output.csv',
    writeStream  = fs.createWriteStream('output.csv');
function reduce(obj){
    return _.reduce(obj, function(acc, val){
	val = _(val).toString().replace(/[”“"\n]/g,'');
	acc = acc + marker + val + marker + separator;
	return acc;
	},'') + '\n';
}


fs.createReadStream(filename).pipe(jsons.parse('*.projects.*'))
  .pipe(es.mapSync(function (data) {
    var flattened = flat(data);
    if(uglytrick === false){
      var added = _(Object.keys(flattened)).toString()+'\n';
      uglytrick = true;
      return added + reduce(flattened);
    }
    return reduce(flattened);
  }))
  .pipe(writeStream);
