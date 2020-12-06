'use strict';
var signIn = async (context, next) => {
    var { db, session, request } = context;
    var { email, password } = request.body;

    var records = await (
        db.collection('personnel').find({
            $and: [
                { 'scientific.state.systemRoleId': {
                    $exists: true
                }},
                { 'scientific.state.systemRoleId': {
                    $type: 7, // bson type of object id
                }},
            ],
            'gdpr.state.emails': { $elemMatch: {
                email,
                isPrimary: true,
            }},
        }, {
            'gdpr.state.internals.passwordHash': true
        })
        .toArray()
    );

    if (records.length < 1) {
        throw new Error(); // TODO: 401
    }
    if (records.length > 1) {
        throw new Error(); // TODO: 401
    }

    var storedHash = (
        records[0]
        .gdpr.state.internals.passwordHash
    );

    if (bcrypt.compareSync(password, storedHash)) {
        session.userId = records[0]._id;
    }
    else {
        throw new Error(); // TODO: 401
    }

    await next();
}
