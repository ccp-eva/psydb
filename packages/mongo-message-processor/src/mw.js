var msg = {
    type: 'test-child',
    payload: {
        childId,
        studyId,
    }
}

var msg2 = {
    type: 'update-child-data',
    payload: {
        childId,
        name
    }
}

router([
    initDb,
    checkRequestBody,
    (ctx) => { ctx.message = ctx.request.body }
    withRohrpost(),
    (ctx, next) => {
        var { childId, ...payload } = ctx.message.payload;
        await (
            ctx.rohrpost
            .openCollection('child')
            .openChannel(childId)
            .dispatch({
                type: 'patch',
                payload,
            })
        );

        await ctx.rohrpost.dispatch({
            collection: 'child',
            channel: childId,
            message: {
                type: 'patch',
                payload,
            }
        });

        ctx.recalculateChannels();
        ctx.rohrpost.unlockChannels()
    }
])


