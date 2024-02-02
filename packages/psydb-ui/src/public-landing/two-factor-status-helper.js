export const TwoFactorAuthCodeRequired = 801;
export const TwoFactorAuthCodeMismatch = 803;

export const checkIfAnyTwoFactorStatusCode = (statusCode) => (
    [
        TwoFactorAuthCodeRequired,
        TwoFactorAuthCodeMismatch,
    ].includes(statusCode)
);
