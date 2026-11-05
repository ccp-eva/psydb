'use strict';
var { inspect } = require('util');

var _debug = require('debug');

var scopes = {
    dir: 'psydb:CONSOLE_DIR',
    log: 'psydb:CONSOLE_LOG',
    warn: 'psydb:CONSOLE_WARN',
    error: 'psydb:CONSOLE_ERROR',
}

var debug = {
    dir: _debug(scopes.dir),
    log: _debug(scopes.log),
    warn: _debug(scopes.warn),
    error: _debug(scopes.error),
}

var inspectify = (that, options) => {
    var str = inspect(that, { colors: true, ...options });
    return str;
}

var bq = require('@cdxoo/block-quote')

var { Console } = require('console');
class CustomConsole extends Console {
    constructor (stdout, stderr) {
        super(stdout, stderr);
    }

    _getOrigin () {
        var e = new Error();
        var origin = (
            e.stack
            .split('\n')
            .slice(3, 4)
            .filter(Boolean)
            .join('\n')
            .replace(/^\s*/, '')
        )
        return origin;
    }

    _format (type, origin, formattedMessage) {
        return (bq`
            --- CONSOLE_${type} ${origin}
            ${formattedMessage}
            ---
        `);
    }

    //XXX: app.emit erroer in middleware error-handling (main-package)
    // error (...args) {
    //     var str = args.map((it) => inspect(it, { colors: true })).join(' ');
    //     debugConsoleError(
    //         this._format('ERROR', this._getOrigin(), str)
    //     );
    // }
    
    warn (...args) {
        if (_debug.enabled(scopes.warn)) {
            var str = args.map(inspectify).join(' ');
            debug.warn(this._format('WARN', this._getOrigin(), str));
        }
        else {
            super.warn(...args);
        }
    }

    log (...args) {
        if (_debug.enabled(scopes.log)) {
            var str = args.map(inspectify).join(' ');
            debug.log(this._format('LOG', this._getOrigin(), str));
        }
        else {
            super.log(...args);
        }
    }

    dir (...args) {
        if (_debug.enabled(scopes.dir)) {
            var str = inspectify(...args);
            debug.dir(this._format('DIR', this._getOrigin(), str));
        }
        else {
            super.dir(...args);
        }
    }

    forceLog (...args) {
        super.log(...args)
    }
}

module.exports = CustomConsole;
