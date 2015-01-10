'use strict';
var mocha = require('mocha'),
    should = require('should'),
    debug = require('debug')('test:extractKeys'),
    extractKeys = require('../utils/extractKeys');

describe('extractKeys()', function(){
    it('should work without a parameter', function(){
        debug(extractKeys());
        extractKeys().should.eql([]);
    });

    it('should return no keys if a string is passed', function(){
        debug(extractKeys('it works'));
        extractKeys('it works').should.eql([]);
    });

    it('should work with simple objects', function(){
        var fxt = {'one': 1, 'two': 2};
        debug(extractKeys(fxt));
        extractKeys(fxt).should.eql(['one','two']);
    });

    it('should ignore nested object\'s keys', function(){
        var fxt = {'one': {'three': 3}, 'two': 2};
        debug(extractKeys(fxt));
        extractKeys(fxt).should.eql(['one','two']);
    });

    it('should work with arrays too', function(){
        var fxt = [
            {one: 1, two: 2},
            {three: 3, four: 42}
        ];
        debug(extractKeys(fxt));
        extractKeys(fxt).should.eql(['one','two','three','four']);
    });

    it('should not count duplicate keys twice', function(){
        var fxt = [
            {single: 1},
            {single: 1},
            {single: 1},
            {single: 1}
        ];
        debug(extractKeys(fxt));
        extractKeys(fxt).should.eql(['single']);
    });
})