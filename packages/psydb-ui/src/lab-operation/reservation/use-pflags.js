import { usePermissions } from '@mpieva/psydb-ui-hooks';

const usePFlags = () => {
    var permissions = usePermissions();
    
    var pflags = permissions.gatherFlags((p) => ({
        canReserveLocations: p.hasSomeLabOperationFlags({
            types: [ 'inhouse', 'online-video-call' ],
            flags: [ 'canWriteReservations' ]
        }),
        canReserveTeams: p.hasSomeLabOperationFlags({
            types: [ 'away-team' ],
            flags: [ 'canWriteReservations' ]
        })
    }));

    return pflags;
}

export default usePFlags;
