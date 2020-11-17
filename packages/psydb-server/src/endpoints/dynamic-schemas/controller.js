'use strct';
var DynamicSchemaCollection = require('collections/dynamic-schema');

var controller = module.exports = {};

controller.index = async (context, next) => {
    var allSchemas = await (
        DynamicSchemaCollection()
        .find()
        .toArray()
    );

    context.body = {
        data: allSchemas
    }

    await next();
}

controller.read = async (context, next) => {
    var { collectionName } = context.urlParams;
    
    var schema = await (
        DynamicSchemaCollection()
        .findOne({ _id: collectionName })
    );

    if (!schema) {
        // 400
    }

    context.body = {
        data: schema,
    }
    
    await next();
}

controller.create = async (context, next) => {
    await next();
}

controller.update = async (context, next) => {
    await next();
}
