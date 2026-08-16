'use strict';
// XXX: see append-query-package which uses querystring but that is
// somehow had issues i gues so i hat to add resolve directive
// to webpack to use querystring-es3 instead
// this now breaks doe to another bug
var querystring = require('./querystring-es3-npm-re-ex')
  , extend = require('./extend-npm-re-ex')
  , url = require('./url-npm-re-ex')

module.defaults = {
  encodeComponents: true
  , removeNull: false
}

module.exports = function appendQuery(uri, q, opts) {
  var parts = url.parse(uri, true)
    , originalQuery = parts.query
    , queryToAppend = typeof q === 'string' ? querystring.parse(q) : q
    , parsedQuery = extend(true, {}, parts.query, queryToAppend)
    , opts = extend({}, module.defaults, opts || {});

  parts.query = null
  var queryString = serialize(parsedQuery, opts)
  parts.search = queryString ? '?' + queryString : null
  return url.format(parts)
}

// serialize an object recursively
function serialize(obj, opts, prefix) {
  var str = []
    , useArraySyntax = false

  // if there's a prefix, and this object is an array, use array syntax
  // i.e., `prefix[]=foo&prefix[]=bar` instead of `prefix[0]=foo&prefix[1]=bar`
  if (Array.isArray(obj) && prefix) {
    useArraySyntax = true
  }

  Object.keys(obj).forEach(function (prop) {
    var key, query, val = obj[prop]

    key = prefix ?
      prefix + '[' + (useArraySyntax ? '' : prop) + ']' :
      prop

    if (val === null) {
      if (opts.removeNull) {
        return
      }
      query = opts.encodeComponents ? encodeURIComponent(key) : key
    } else if (typeof val === 'object') {
      query = serialize(val, opts, key)
    } else {
      query = opts.encodeComponents ?
        encodeURIComponent(key) + '=' + encodeURIComponent(val) :
        key + '=' + val;
    }
    str.push(query)
  })

  return str.join('&')
}
