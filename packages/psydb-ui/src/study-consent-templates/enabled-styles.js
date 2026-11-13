// NOTE: shared by consent template and consent form record lists;
// disabled records are greyed out like hidden records elsewhere
export const getEnabledRowClassName = (record) => (
    record.state?.isEnabled ? undefined : 'bg-light text-grey'
);

export const getEnabledCellClassName = ({ record, definition }) => {
    if (definition.pointer !== '/state/isEnabled') {
        return undefined;
    }
    return record.state?.isEnabled ? 'text-success' : 'text-danger';
}
