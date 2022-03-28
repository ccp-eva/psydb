'use strict';
// TODO: make this file go away
module.exports = require('@cdxoo/objectpath-to-jsonpointer');

//var convertPathToPointer = (path) => {
//    var tokens = path.split('.');
//    var matcher = /[\/\.]/g;
//    var escaper = (m) => {
//        switch (m) {
//            case '~': return '~0';
//            case '/': return '~1';
//        }
//    }
//    tokens = tokens.map(it => (
//        it
//        ? it.replace(matcher, escaper)
//        : it // FIXME: throw error here?
//    ));
//
//    return '/' + tokens.join('/');
//}
//
//module.exports = convertPathToPointer;
