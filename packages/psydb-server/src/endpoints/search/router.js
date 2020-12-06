var KoaRouter = require('koa-router'),
    mongobody = require('@mpieva/koa-mongodb-extjson-body'),
    search = require('./search');

var router = KoaRouter({
    prefix: '/search'
});

//router.use(secured);

router.post('/',
    mongobody({
        //mimeType: 'application/mongodb-extjson',
        mimeType: 'application/json',
    }),
    search,
)
