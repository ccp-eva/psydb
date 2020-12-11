var KoaRouter = require('koa-router'),
    mongobody = require('@mpieva/koa-mongodb-extjson-body'),
    search = require('./search');

var router = KoaRouter({
    prefix: '/search'
});

//router.use(secured);

router.post('/:collectionName(^(_helper_)?[A-Za-z]+$)',
    mongobody({
        //mimeType: 'application/mongodb-extjson',
        ejsonMimeType: 'application/json',
        ejsonOptions: { relaxed: true },
    }),
    search,
)
