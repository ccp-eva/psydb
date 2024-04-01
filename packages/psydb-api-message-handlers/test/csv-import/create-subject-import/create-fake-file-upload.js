'use strict';
var createFakeFileUpload = async (bag) => {
    var {
        db,
        buffer,
        mimetype = 'text/csv',
        originalFilename = 'import.csv',
    } = bag;

    var mongoDoc = {
        _id: await createId(),
        correlationId: await createId(),
        createdBy: await createId(),
        createdAt: new Date(),
        uploadKey: 'import',
        hash: 'xxx',
        mimetype,
        originalFilename,
        blob: buffer
    }

    await withRetracedErrors(
        db.collection('file').insertOne(mongoDoc)
    );

    return mongoDoc;
}

module.exports = createFakeFileUpload;
