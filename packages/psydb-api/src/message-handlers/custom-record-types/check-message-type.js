'use strict';
var parseMessageType = (type) => {
}

var checkType = (type) => {
    var { op, collection, type, subtype } = parseMessageType(type);

    if (!op || !collection) {
    }
}

var prefix = 'custom-record-types'; // ^(prefix)\/?$

routes.add(
    'custom-record-types/create/',
    require('./create')
)

'/:op(create|patch)/:collection(location)/:type(room|building)/:subtype()'

routes.add(
    'custom-record-types/create/'
)

routes.prefix('set-personnel-password');
routes.add(
    '/',
    default
);

var MessageHandler = ({ ...spec }) => () => {
    if (spec.matches(type)) {

    }
}

var MessageHandler = ({ ...spec }) => {
    var handler = {};
    
    handler.match = (message) => (
        spec.match.test(message.type)
    )
    handler.execute = async (message) => {
        spec.validateParams();
        spec.validateBody();
        spec.checkAllowedAndPlausible();
        spec.triggerSystemEvents();
        spec.triggerOtherEvents();
    };
}

MessageHandler({
    messageType: 'set-personnel-password',
    ...other
});

var MessageRouter = ({ ...spec }) => (message) => {};

MessageRouter({
    match: /^custom-record-types\//,
    routes: [
        Handler({
        })
    ]
});
