controller.testChild = async (context, next) => {
    var message = context.body;

    checkValidity('test-child-message', message);
    checkPlausibility('test-child-message', message);

    var correlationMessage = await context.mq.add(message);

    var study = context.createBroker('study', correlationMessage._id),
        child = context.createBroker('child', correlationMessage._id);

    var { studyId, childId } = message;

    await study.openChannel(studyId).dispatch({
        type: 'add-tested-child',
        payload: { childId }
    });

    await child.openChannel(childId).dispatch({
        type: 'add-participated-study',
        payload: { studyId }
    });

    context.recalculateChannels();
    
    context.persistCorrelationMessage(correlationMessage);
    context.mq.remove(correlationMessage._id);

    context.unlockChannels();

    await next;
};
