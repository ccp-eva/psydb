import { range } from '@mpieva/psydb-core-utils';

export const Custom = (options) => {
    var {
        fieldDefinitions,
        subChannelKey,
        permissions = undefined
    } = options;

    var fields = (
        subChannelKey
        ? fieldDefinitions[subChannelKey]
        : fieldDefinitions
    );
   
    var defaults = (
        fields
        .filter(it => {
            if (it.isRemoved) {
                return false;
            }
            if ((it.type || it.systemType) === 'Lambda') {
                return false;
            }
            if (
                it.props?.isSensitive
                && permissions
                && !permissions.hasFlag('canAccessSensitiveFields')
            ) {
                return false
            }
            return true;
        })
        .reduce((acc, it) => ({
            ...acc,
            [it.key]: CustomFieldDefault(it)
        }), {})
    );

    return defaults;
}

const CustomFieldDefault = (options) => {
    var { type, props } = options;
    type = fixSystemType(type);
    
    switch (type) {
        case 'SaneString':
        case 'FullText':
        case 'Email':
        case 'Phone':
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
            var { minItems } = props;
            return range(minItems || 0).map(() => ({
                isPrimary: true
            }));
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
