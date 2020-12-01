var foo = ({ records }) => {
    var typedSchemas = createTypedSchemas({ records, instructions }),
        schemaTree = createTree(typedSchemas);
    return {
        ...schemaTree,
        ...staticSchemas,
        systemRole: {
            state: SystemRoleState({ schemaTree })
        }
    }
}
