/* Let's parse this fucking dataset and make it flat: http://werobots.io/kickstarter-datasets/ */
var fs = require('fs'),
    jsons = require('JSONStream'),
    es = require('event-stream'),
    flat = require('flat'),
    _ = require('lodash');

var uglytrick = false,
    writeStream  = fs.createWriteStream('output.csv');

fs.createReadStream('file.json').pipe(jsons.parse('*.projects.*'))
  .pipe(es.mapSync(function (data) {
    var flattened = flat(data);
    if(uglytrick === false){
      var added = _(Object.keys(flattened)).toString()+'\n';
      uglytrick = true;
      return added + _.reduce(flattened, function(acc,value){ acc += value + ','; return acc;},'') + '\n';
    }
    return _.reduce(flattened, function(acc,value){ acc += value + ','; return acc;},'') + '\n';
  }))
  .pipe(writeStream);
