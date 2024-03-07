
var updateFieldCache = require('./update-field-cache');
var checkSchemas = require('./check-schemas');
var checkAnonymizers = require('./check-anonymizers');
var dump = require('./dump');

var Dumper = (bag) => {
    var { config, cachedir, schemas, anonymizers } = bag;

    var dumper = {};
    
    dumper.updateFieldCache = () => updateFieldCache({
        config, cachedir
    });
    
    dumper.checkSchemas = () => checkSchemas({
        config, cachedir, schemas
    });

    dumper.checkAnonymizers = () => checkAnonymizers({
        config, cachedir, anonymizers
    });

    dumper.dump = () => dump({
        config, schemas, anonymizers
    });

    return dumpers;
}

module.exports = Dumper;
