import { range } from '@mpieva/psydb-core-utils';

export const Custom = (options) => {
    var { fieldDefinitions, subChannelKey } = options;
    var fields = (
        subChannelKey
        ? fieldDefinitions[subChannelKey]
        : fieldDefinitions
    );
    
    return (
        fields
        .filter(it => (
            !it.isRemoved
            && (it.type || it.systemType) !== 'Lambda'
        ))
        .reduce((acc, it) => ({
            ...acc,
            [it.key]: CustomFieldDefault(it)
        }), {})
    )
}

const CustomFieldDefault = (options) => {
    var { type, props } = options;
    type = fixSystemType(type);
    
    switch (type) {
        case 'SaneString':
        case 'FullText':
            return '';
        case 'DefaultBool':
            return false;
        case 'Address':
            return { 'country': 'DE' };
        case 'Integer':
            var { isNullable } = props;
            return (
                isNullable
                ? null
                : 0
            );

        case 'DateOnlyServerSide':
        case 'DateTime':
            var { isNullable } = props;
            return (
                isNullable
                ? null
                : undefined
            );
            break;
        case 'ExtBool':
        case 'BiologicalGender':
            return undefined;
        case 'ForeignId':
        case 'HelperSetItemId':
            var { isNullable } = props;
            return (
                isNullable
                ? null
                : undefined
            );

        case 'EmailWithPrimaryList':
        case 'PhoneWithTypeList':
            var { minItems } = props;
            return range(minItems || 0).map(() => ({}));

        case 'SaneStringList':
        case 'URLStringList':
        case 'PhoneList':
        case 'HelperSetItemIdList':
        case 'ForeignIdList':
            var { minItems } = props;
            return range(minItems || 0).map(() => undefined);

        case 'ListOfObjects':
            return range(minItems || 0).map(() => ({}));

        default:
            throw new Error(`unknown systemType "${type}"`)
    }
}

const fixSystemType = (systemType) => {
    // TODO: make sure that we dont need this mapping anymore
    switch (systemType) {
        case 'EmailList':
            return 'EmailWithPrimaryList';
        case 'TestingPermissions':
            return 'SubjectTestingPermissionList';
        default:
            return systemType;
    }
};
