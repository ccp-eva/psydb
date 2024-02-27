import { jsonpointer } from '@mpieva/psydb-core-utils';
import { CRTSettings, SmartArray } from '@mpieva/psydb-common-lib';
import { useFetchChain } from '@mpieva/psydb-ui-hooks';

const useCustomFetchChain = (ps) => {
    var { subjectType, preselectedSubject } = ps;

    return useFetchChain(() => SmartArray([
        SubjectGroupFieldDefStage({ subjectType }),
        ( preselectedSubject && ([
            MaybeFetchSubjectGroupStage({ preselectedSubject }),
            MaybeFetchLocationStage()

        ]))
    ], {
        execLambdas: false,
        spreadArrayItems: true,
    }), [ subjectType, preselectedSubject?._id ]);
}

const SubjectGroupFieldDefStage = (bag) => {
    var { subjectType } = bag;

    return ({ agent }) => ({
        subjectGroupFieldDef: agent.readCRTSettings({
            collection: 'subject',
            recordType: subjectType
        }).then(response => {
            var subjectCRT = CRTSettings({
                data: response.data.data
            });
            var [ subjectGroupField ] = subjectCRT.findCustomFields({
                'type': 'ForeignId',
                'props.collection': 'subjectGroup'
            });

            return { ...response, data: { data: subjectGroupField }}
        }),
    });
}

const MaybeFetchSubjectGroupStage = (bag) => {
    var { preselectedSubject } = bag;

    return ({ agent, context }) => {
        var def = context.subjectGroupFieldDef.data;
        if (!def) {
            return;
        }

        var { pointer } = def;
        var subjectGroupId = (
            jsonpointer.get(preselectedSubject, pointer)
        );

        if (!subjectGroupId) {
            return;
        }

        return ({
            subjectGroup: agent.readRecord({
                collection: 'subjectGroup',
                id: subjectGroupId,
            })
        })
    }
}

const MaybeFetchLocationStage = (bag) => {
    return ({ agent, context }) => {
        console.log(context);
        if (!context.subjectGroup) {
            return;
        }

        var { locationId } = context.subjectGroup.data.record.state;
        return ({
            location: agent.readRecord({
                collection: 'location',
                id: locationId
            })
        });
    }
}

export default useCustomFetchChain;
