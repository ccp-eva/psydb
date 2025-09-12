'use strict';
var { Fields: BaseFields } = require('@mpieva/psydb-custom-fields-faker');

//var fakeval = (systemType, props) => (
//    Fields[systemType].getRandomValue({ definition: { props }});
//)
var Fields = {};
for (let [ systemType, fn ] of Object.entries(BaseFields)) {
    Fields[systemType] = (...args) => {
        var [ props = {}, extra ] = args;

        return BaseFields[systemType].getRandomValue({
            definition: { props }, ...extra
        })
    };
}

module.exports = { Fields };
