// NOTE: forcing UTC here since dumps from
// diffrent servers that use DateOnlyServerSide
// would get incompatible with one another
// when servers have different timezones
process.env.TZ = 'UTC';

//require('debug').enable('json-schema-lazy-resolve-oneof*,psydb:*');
require('debug').enable('psydb:*');

var Koa = require('koa');
var KeyGrip = require('keygrip');
var psydbConfig = require('@mpieva/psydb-api-config');
var createApi = require('./middleware/api');

var app = new Koa();

var { sessionSig = {} } = psydbConfig;

if (sessionSig.keys) {
    app.keys = new KeyGrip(
        sessionSig.keys,
        sessionSig.digest || 'sha256'
    );
}

app.use(
    createApi({
        app,
        config: psydbConfig,
        prefix: '/'
    })
);

app.listen(3012);
