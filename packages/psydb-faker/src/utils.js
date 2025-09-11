'use strict';
var { Fields: BaseFields } = require('@mpieva/psydb-custom-fields-faker');

//var fakeval = (systemType, props) => (
//    Fields[systemType].getRandomValue({ definition: { props }});
//)
var Fields = {};
for (let [ systemType, fn ] of Object.entries(Fields)) {
    Fields[systemType] = (props = {}) => (
        BaseFields[systemType].getRandomValue({ props })
    );
}

module.exports = { Fields };
