'use strict';
var { inspect } = require('util');

var debugConsoleDir = require('debug')('psydb:CONSOLE_DIR');
var debugConsoleLog = require('debug')('psydb:CONSOLE_LOG');
var debugConsoleWarn = require('debug')('psydb:CONSOLE_WARN');
var debugConsoleError = require('debug')('psydb:CONSOLE_ERROR');

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
        return (
            bq`
                --- CONSOLE_${type} ${origin}
                ${formattedMessage}
                ---
            `
        );
    }

    //XXX: app.emit erroer in middleware error-handling (main-package)
    // error (...args) {
    //     var str = args.map((it) => inspect(it, { colors: true })).join(' ');
    //     debugConsoleError(
    //         this._format('ERROR', this._getOrigin(), str)
    //     );
    // }
    
    warn (...args) {
        var str = args.map((it) => inspect(it, { colors: true })).join(' ');
        debugConsoleWarn(
            this._format('WARN', this._getOrigin(), str)
        );
    }

    log (...args) {
        var str = args.map((it) => inspect(it, { colors: true })).join(' ');
        debugConsoleLog(
            this._format('LOG', this._getOrigin(), str)
        );
    }

    dir (obj, options) {
        var str = inspect(obj, { colors: true, ...options });
        debugConsoleDir(
            this._format('DIR', this._getOrigin(), str)
        );
    }

    forceLog (...args) {
        super.log(...args)
    }
}

module.exports = CustomConsole;
