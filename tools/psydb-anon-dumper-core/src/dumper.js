
var updateFieldCache = require('./update-field-cache');
var checkSchemas = require('./check-schemas');
var checkAnonymizers = require('./check-anonymizers');
var dump = require('./dump');

var Dumper = (bag) => {
    var { config, schemas, anonymizers } = bag;

    var dumper = {};
    
    dumper.updateFieldCache = () => updateFieldCache({
        config
    });
    
    dumper.checkSchemas = () => checkSchemas({
        config, schemas
    });

    dumper.checkAnonymizers = () => checkAnonymizers({
        config, anonymizers
    });

    dumper.dump = () => dump({
        config, schemas, anonymizers
    });

    return dumper;
}

module.exports = Dumper;
