'use strict';
var fs = require('fs');
var formidable = require('formidable');
var { entries } = require('@mpieva/psydb-core-utils');
var { createId, ResponseBody, ApiError } = require('@mpieva/psydb-api-lib');

var fileUploadEndpoint = async (context, next) => {
    var { db, permissions, self } = context;
    if (!permissions.isRoot()) {
        throw new ApiError(403);
    }

    var form = formidable({
        hashAlgorithm: 'md5',
        maxFileSize: 12 * 1024 * 1024,
        multiples: true
    });

    var { fields, files } = await new Promise((resolve, reject) => {
        form.parse(context.req, (error, fields, files) => {
            if (error) {
                reject(error);
                return;
            }

            resolve({ fields, files });
        })
    });

    var correlationId = await createId();
    var now = new Date();
    var mongoDocs = [];

    for (var [ key, file ] of entries(files)) {
        var { filepath, originalFilename, mimetype, hash } = file;
        var buffer = fs.readFileSync(filepath);

        mongoDocs.push({
            _id: await createId(),
            correlationId,
            createdBy: self._id,
            createdAt: now,
            uploadKey: key,
            hash,
            mimetype,
            originalFilename,
            blob: buffer
        });
    }

    await db.collection('file').insertMany(mongoDocs);
    
    context.body = ResponseBody({ data: {
        records: mongoDocs.map(
            ({ blob, ...pass }) => ({ ...pass, blob: '__OMITTED__' })
        ),
    }});
    
    for (var [ key, file ] of entries(files)) {
        var { filepath } = file;
        fs.unlinkSync(filepath);
    }
    await next();
}

module.exports = fileUploadEndpoint;
