export const siretValidation = {
    validateSiret
}

function validateSiret(value) {
    if (!value) return false;

    let siret = value.slice();
    siret = siret.replace(/\s|-|,|\./g, '');
    siret = siret
        .split('')
        .reverse()
        .join(''); // easier for the test

    if (value.length !== 14 || isNaN(+siret)) {
        return false;
    }

    let sum = 0;
    for (let i = 0; i < siret.length; i++) {
        if (i % 2 === 1) {
            const op = +siret[i] * 2;
            sum = sum + (op > 9 ? op - 9 : op);
        } else {
            sum = sum + +siret[i];
        }
    }
    if (sum % 10 !== 0) {
        return false;
    }
    return true;
}
