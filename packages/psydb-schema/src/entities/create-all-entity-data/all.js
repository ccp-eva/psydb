var foo = ({ records }) => {
    var typedSchemas = createTypedSchemas({ records, instructions });
    return {
        ...createTree(typedSchemas),
        ...staticSchemas,
        systemRole: {
            state: SystemRoleState({ typodSchemas })
        }
    }
}
