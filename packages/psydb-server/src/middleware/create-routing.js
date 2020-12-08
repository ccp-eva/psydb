var KoaRouter = require('koa-router'),
    withKoaBody = require('koa-body'),
    withMongoBody = require('@mpieva/koa-mongodb-extjson-body'),
    
    withProtection = require('./create-protection-middleware'),

    public = require('./public-endpoints'),
    protected = require('./protected-endpoints/');

var createRouting = ({
    prefix = '/',
}) => {
    var router = KoaRouter({
        prefix,
    });

    router.post('/sign-in', withKoaBody(), public.signIn);
    router.post('/sign-out', public.signOut);

    /*router.get('/self',
        withProtection(),
        protected.self
    );*/

    /*router.post('/search/:collectionName(^(_helper_)?[A-Za-z]+$)',
        withProtection(),
        withMongoBody({
            //mimeType: 'application/mongodb-extjson',
            ejsonMimeType: 'application/json',
            ejsonOptions: { relaxed: true },
        }),
        protected.search,
    );*/

    //router.get('/read/:collectionName(...)/:recordId(...)');
    //router.post('/search-for-study')
    //router.post(/event)
}

module.exports = createRouting;
