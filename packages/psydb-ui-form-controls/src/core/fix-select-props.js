export const fixSelectProps = ({
    actualValueList,
    value,
    onChange: originalOnChange,
}) => {

    return {
        value: actualValueList.findIndex(it => it === value),
        onChange: (event) => {
            var { target: { value: index }} = event;
            var out = actualValueList[index];
            return originalOnChange(out);
        }
    }
}
