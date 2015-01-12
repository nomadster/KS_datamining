'use strict';
var _ = require('lodash'),
    debug = require('debug')('Command:extractKeys');

/**
 * Extracts all the unique keys in a given collection.
 * @param collection The collection from which you want to extract all the keys
 * @returns An Array containing all the unique keys in the entire collection
 */
module.exports = function extractKeys(source) {
debug('Source is %s', source);
    return Array.isArray(source) ?
        _.reduce(source, function (acc, elem) {
            return _.union(acc, extractKeys(elem));
        }, []) :
        _.keys(source);
};

