import jsonpointer from 'jsonpointer';

const convertAjvErrors = (ajvErrors, data) => {
    console.log({ ajvErrors });
    let errors = {};
    for (let err of ajvErrors) {
        let { keyword, instancePath, message, params } = err;

        if (!jsonpointer.get(errors, instancePath)) {
            let value = jsonpointer.get(data, instancePath);
            let dataType = undefined;
            if (Array.isArray(value)) {
                dataType = 'array';
            }
            else if (typeof value === 'object') {
                dataType = 'object';
            }
            else {
                dataType = 'scalar';
            }
            jsonpointer.set(errors, instancePath, {
                '@@DATA_TYPE': dataType
            });
        }

        let errorPath = `${instancePath}/@@ERRORS/-`;

        if (keyword === 'const') {
            let { allowedValue } = params;
            message = `${message} "${allowedValue}"`;
            jsonpointer.set(errors, errorPath, err);
        }
        else if (keyword === 'required') {
            let { missingProperty } = params;
            jsonpointer.set(
                errors, errorPath, err
            );
            jsonpointer.set(
                errors,
                `${instancePath}/${missingProperty}/@@DATA_TYPE`,
                'scalar', // FIXME: this might not be true all the time
            );
            jsonpointer.set(
                errors,
                `${instancePath}/${missingProperty}/@@ERRORS/-`,
                err
            );
        }
        else {
            jsonpointer.set(errors, errorPath, err);
        }

    }
    return errors;
}

export default convertAjvErrors;
