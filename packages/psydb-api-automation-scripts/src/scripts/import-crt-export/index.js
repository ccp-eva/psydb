'use strict';
// Recreates the custom record types (and the helper sets their fields
// reference) from a file created by GET /api/crt-settings/export
//
// usage:
//   node src/run.js src/scripts/import-crt-export \
//       --url https://target/api/ --api-key <root api key> \
//       --input-file ./crt-export.ejson
//
// NOTE: record ids of crts, helper sets and helper set items are kept,
// so HelperSetItemId fields and data that is moved later on keep
// pointing to the right records
var debug = require('debug')('psydb:api-automation:import-crt-export');
var fs = require('fs');
var fspath = require('path');
var { ejson } = require('@mpieva/psydb-core-utils');

var EXPORT_FORMAT = 'psydb-crt-export';
var SUPPORTED_VERSIONS = [ 1 ];

// state key => target for custom-record-types/set-display-fields
var DISPLAY_FIELD_TARGETS = [
    [ 'tableDisplayFields', 'table' ],
    [ 'optionListDisplayFields', 'optionlist' ],
    [ 'extraDescriptionDisplayFields', 'extra-description' ],
    [ 'selectionSummaryDisplayFields', 'selection-summary' ],
    // NOTE: the handler stores into "inviteConfirmSummaryDisplayFields"
    // while the state schema defines "inviteConfirmationSummary..."
    [ 'inviteConfirmationSummaryDisplayFields', 'invite-confirm-summary' ],
    [ 'inviteConfirmSummaryDisplayFields', 'invite-confirm-summary' ],
    [ 'selectionRowDisplayFields', 'invite-selection-list' ],
    [ 'awayTeamSelectionRowDisplayFields', 'away-team-selection-list' ],
];

module.exports = async (bag) => {
    var { driver, extraOptions } = bag;
    var { inputFile } = extraOptions;

    var data = readExportFile(inputFile);
    var { customRecordTypes, helperSets } = data;

    console.log(
        `import: ${customRecordTypes.length} crts,`,
        `${helperSets.length} helper sets`,
        `(exported at ${data.exportedAt})`
    );

    for (var crt of customRecordTypes) {
        if (crt.state.isDirty) {
            console.warn(
                `WARNING: ${crtName(crt)} has uncommitted field changes`,
                'on the source system; only committed settings are imported'
            );
        }
    }

    await checkNoCRTConflicts({ driver, customRecordTypes });
    var existingHelperSetIds = await fetchExistingHelperSetIds({
        driver, helperSets
    });

    // 1. helper sets referenced by crt fields
    for (var set of helperSets) {
        await importHelperSet({ driver, set, existingHelperSetIds });
    }

    // 2. create all crts first, so that ForeignId fields can
    // reference crts that come later in the list
    for (var crt of customRecordTypes) {
        console.log(`creating crt ${crtName(crt)}`);
        await driver.sendMessage({
            type: 'custom-record-types/create',
            payload: {
                id: crt._id,
                collection: crt.collection,
                type: crt.type,
                props: {
                    label: crt.state.label,
                    displayNameI18N: crt.state.displayNameI18N || {},
                }
            }
        });
    }

    // 3. fields
    for (var crt of customRecordTypes) {
        var fields = getActiveFields(crt);
        if (fields.length < 1) {
            continue;
        }
        debug(`adding ${fields.length} fields to ${crtName(crt)}`);
        for (var { subChannelKey, field } of fields) {
            warnOnConstraints({ crt, field });
            await driver.sendMessage({
                type: 'custom-record-types/add-field-definition',
                payload: {
                    id: crt._id,
                    ...(subChannelKey && { subChannelKey }),
                    props: stripFieldInternals(field),
                }
            });
        }
        await driver.sendMessage({
            type: 'custom-record-types/commit-settings',
            payload: { id: crt._id }
        });
    }

    // 4. general data, labels, display settings etc.
    for (var crt of customRecordTypes) {
        console.log(`setting up ${crtName(crt)}`);
        await setupCRTSettings({ driver, crt });
    }

    console.log('done');
}

var readExportFile = (inputFile) => {
    if (!inputFile) {
        throw new Error('script requires --input-file <path>');
    }
    var path = fspath.resolve(process.cwd(), inputFile);
    var data = ejson.parse(fs.readFileSync(path, 'utf8'), {
        // NOTE: ids are sent as hex strings anyway
        createObjectId: (hex) => hex,
        createDate: (str) => new Date(str),
    });

    if (data.format !== EXPORT_FORMAT) {
        throw new Error(`"${path}" is not a crt export file`);
    }
    if (!SUPPORTED_VERSIONS.includes(data.version)) {
        throw new Error(`unsupported crt export version "${data.version}"`);
    }
    return data;
}

var checkNoCRTConflicts = async (bag) => {
    var { driver, customRecordTypes } = bag;

    var response = await driver.get({ url: '/crt-settings/export' });
    var existing = response.data.customRecordTypes;

    var conflicts = [];
    for (var crt of customRecordTypes) {
        var match = existing.find(it => (
            (it.collection === crt.collection && it.type === crt.type)
            || oidToString(it._id) === crt._id
        ));
        if (match) {
            conflicts.push(crtName(crt));
        }
    }
    if (conflicts.length > 0) {
        throw new Error(
            'crts already exist on target (type or id): '
            + conflicts.join(', ')
        );
    }
}

var fetchExistingHelperSetIds = async (bag) => {
    var { driver, helperSets } = bag;
    if (helperSets.length < 1) {
        return [];
    }

    var response = await driver.post({
        url: '/helperSet/list',
        payload: {
            filters: {},
            constraints: { '/_id': helperSets.map(it => it._id) },
            showHidden: true,
            offset: 0,
            limit: 1000,
        }
    });

    return response.data.records.map(it => oidToString(it._id));
}

var importHelperSet = async (bag) => {
    var { driver, set, existingHelperSetIds } = bag;
    var { _id, state, items = [] } = set;

    if (existingHelperSetIds.includes(_id)) {
        console.log(
            `helper set "${state.label}" (${_id}) already exists;`,
            'skipping it and its items'
        );
        return;
    }

    console.log(
        `creating helper set "${state.label}" with ${items.length} items`
    );
    await driver.sendMessage({
        type: 'helperSet/create',
        payload: { id: _id, props: {
            label: state.label,
            displayNameI18N: state.displayNameI18N || {},
        }}
    });

    for (var item of items) {
        await driver.sendMessage({
            type: 'helperSetItem/create',
            payload: { id: item._id, setId: _id, props: {
                label: item.state.label,
                displayNameI18N: item.state.displayNameI18N || {},
            }}
        });
    }
}

var setupCRTSettings = async (bag) => {
    var { driver, crt } = bag;
    var { _id: id, collection, state } = crt;

    var removedPointers = getRemovedFieldPointers(crt);
    var isUsable = (pointer) => !removedPointers.includes(pointer);

    // NOTE: must come before set-form-order since it pushes/pulls
    // sequenceNumber/onlineId/testingPermissions into the form order
    await driver.sendMessage({
        type: 'custom-record-types/set-general-data',
        payload: {
            id,
            label: state.label,
            displayNameI18N: state.displayNameI18N || {},
            ...getCollectionGeneralData({ collection, state }),
        }
    });

    var { recordLabelDefinition } = state;
    if (recordLabelDefinition?.tokens?.length > 0) {
        var tokens = recordLabelDefinition.tokens.map(it => it.dataPointer);
        if (tokens.every(isUsable)) {
            await driver.sendMessage({
                type: 'custom-record-types/set-record-label-definition',
                payload: { id, props: {
                    format: recordLabelDefinition.format,
                    tokens,
                }}
            });
        }
        else {
            console.warn(
                `WARNING: ${crtName(crt)} record label references`,
                'removed fields; label definition not imported'
            );
        }
    }

    for (var [ stateKey, target ] of DISPLAY_FIELD_TARGETS) {
        var displayFields = state[stateKey];
        if (!displayFields?.length) {
            continue;
        }
        await sendPointerList({
            crt, what: `display fields "${target}"`,
            pointers: (
                displayFields.map(it => it.dataPointer).filter(isUsable)
            ),
            send: (fieldPointers) => driver.sendMessage({
                type: 'custom-record-types/set-display-fields',
                payload: { id, target, fieldPointers }
            })
        });
    }

    var fieldSettings = state.duplicateCheckSettings?.fieldSettings;
    if (fieldSettings?.length > 0) {
        await driver.sendMessage({
            type: 'custom-record-types/set-duplicate-check-settings',
            payload: {
                id,
                fieldSettings: fieldSettings.filter(it => (
                    isUsable(it.pointer)
                )),
            }
        });
    }

    var extraIdFields = state.importSettings?.extraIdFields;
    if (extraIdFields?.length > 0) {
        await driver.sendMessage({
            type: 'custom-record-types/import-settings-ops/set-extra-id-fields',
            payload: {
                _id: id,
                values: extraIdFields.filter(it => isUsable(it.pointer)),
            }
        });
    }

    if (state.formOrder?.length > 0) {
        await sendPointerList({
            crt, what: 'form order',
            pointers: state.formOrder.filter(isUsable),
            send: (formOrder) => driver.sendMessage({
                type: 'custom-record-types/set-form-order',
                payload: { id, formOrder }
            })
        });
    }
}

// NOTE: pointers that are valid on the source system might not be
// on the target, e.g. "/state/experimentNames" for studies only exists
// when IS_WKPRC is set; such pointers are dropped with a warning
var sendPointerList = async (bag) => {
    var { crt, what, pointers, send } = bag;
    var current = [ ...pointers ];

    var dropPointer = (pointer) => {
        console.warn(
            `WARNING: ${crtName(crt)} ${what}: pointer "${pointer}"`,
            'is invalid on the target system; dropped'
        );
        current = current.filter(it => it !== pointer);
    }

    while (true) {
        try {
            await send(current);
            return;
        }
        catch (e) {
            if (e.apiStatus !== 'InvalidFieldPointer') {
                throw e;
            }
            var invalid = e.response?.data?.data?.fieldPointer;
            if (invalid && current.includes(invalid)) {
                dropPointer(invalid);
                continue;
            }

            // NOTE: some handlers dont report the offending pointer
            // so we try them one by one; the final send overwrites
            for (var pointer of [ ...current ]) {
                try {
                    await send([ pointer ]);
                }
                catch (e) {
                    if (e.apiStatus !== 'InvalidFieldPointer') {
                        throw e;
                    }
                    dropPointer(pointer);
                }
            }
            await send(current);
            return;
        }
    }
}

var getCollectionGeneralData = ({ collection, state }) => {
    switch (collection) {
        case 'subject':
            return {
                requiresTestingPermissions: (
                    state.requiresTestingPermissions ?? true
                ),
                commentFieldIsSensitive: (
                    state.commentFieldIsSensitive ?? false
                ),
                showSequenceNumber: state.showSequenceNumber ?? true,
                showOnlineId: state.showOnlineId ?? true,
            };
        case 'location':
            return {
                reservationType: state.reservationType || 'inhouse',
            };
        case 'study':
            return {
                enableSubjectSelectionSettings: (
                    state.enableSubjectSelectionSettings ?? false
                ),
                enableLabTeams: state.enableLabTeams ?? false,
            };
        default:
            return {};
    }
}

var getAllFields = (crt) => {
    var { fields, subChannelFields } = crt.state.settings || {};
    if (subChannelFields) {
        return Object.entries(subChannelFields).flatMap(
            ([ subChannelKey, fields ]) => fields.map(field => ({
                subChannelKey, field
            }))
        );
    }
    return (fields || []).map(field => ({ subChannelKey: undefined, field }));
}

var getActiveFields = (crt) => (
    getAllFields(crt).filter(it => !it.field.isRemoved)
);

var getRemovedFieldPointers = (crt) => (
    getAllFields(crt)
    .filter(it => it.field.isRemoved)
    .map(it => it.field.pointer)
);

var stripFieldInternals = (field) => {
    var { pointer, isNew, isDirty, isRemoved, ...props } = field;
    return props;
}

var warnOnConstraints = ({ crt, field }) => {
    var { constraints } = field.props || {};
    var hasIds = Object.values(constraints || {}).some(it => (
        /^[0-9a-f]{24}$/i.test(oidToString(it))
    ));
    if (hasIds) {
        console.warn(
            `WARNING: ${crtName(crt)} field "${field.key}" has constraints`,
            JSON.stringify(constraints),
            '- make sure referenced ids exist on the target system'
        );
    }
}

var crtName = (crt) => `${crt.collection}/${crt.type}`;

// NOTE: axios parses the raw ejson response, so ids are { $oid }
var oidToString = (that) => (
    that?.$oid ? that.$oid : String(that)
);
