export const withDestructuredEvent = (originalOnChange) => (event) => {
    var { target: { value }} = event;
    return originalOnChange(value);
}
