export const validateSection = {
    validateRequiredFields,
    displayColorStateOnSection,
    isUnique,
    expected: {
        validate(value) {
            return !isEmpty(value);
        },
    },
    expectedUniqueValues: {
        params: [ 'values' ],
        validate(value, { values }) {
            return isUnique(values);
        },
        message: 'Veuillez saisir un nom unique.'
    },
    expectedCheckedField: {
        params: [ 'checked' ],
        validate(value, { checked }) {
            return isCheckedFieldValid(value, checked);
        },
        message: 'Ce champ est attendu.'
    },
    expectedCheckboxValidator: {
        validate(value) {
            return !isSingleCheckboxEmpty(Boolean(value));
        },
        message: 'Ce champ est attendu.'
    },
    requiredCheckedField: {
        params: [ 'checked' ],
        validate(value, { checked }){
            return isCheckedFieldValid(value, checked);
        },
        message: 'Ce champ est requis.'
    },
    expectedFloat: {
        validate(value) {
            return /^\d*([,.]?\d+)$/.test(value);
        },
        message: 'Ce champs doit être numérique.'
    },
    phoneValidator: {
        validate(value) {
            return /^(\+33|0033|0)[1-9][0-9]{8}$/.test(value);
        },
        message: 'Ce champs n\'est pas valide'
    },
    checkPeriodDates: {
        params: ['startDate', 'endDate'],
        validate(value, { startDate, endDate }) {
            return 0 <= new Date(endDate) - new Date(startDate);
        },
        message: 'La date de fin doit être supérieure à la date de début.'
    }
}

function getRequiredFields(fields) {
    return getFieldsBy(fields, 'required');
}

function getExpectedFields(fields) {
    return getFieldsBy(fields, 'expected');
}

function getExpectedCheckboxFields(fields) {
    return getFieldsBy(fields, 'expectedCheckbox');
}

function getFieldsBy(fields, filterBy) {
    return Object.entries(fields)
        .map(field => {
            field[1] = field[1] && field[1][0] ? field[1][0] : field[1];
            return field;
        })
        .filter(field => {
            if (!field[1] || !field[1].rules) {
                return false;
            }

            let rules = field[1].rules;
            if ('required' === filterBy) {
                switch (typeof rules) {
                    case 'string':
                        if (rules.includes('expected') || rules.includes('expectedCheckedField')) {
                            return false;
                        }
                        return rules.includes('required') || rules.includes('requiredCheckedField');
                    case 'object':
                        if (undefined !== rules.expected || undefined !== rules.expectedCheckedField) {
                            return false;
                        }
                        return rules.required || rules.requiredCheckedField;
                }
            } else if ('expected' === filterBy) {
                switch (typeof rules) {
                    case 'string':
                        return rules.includes('expected') || rules.includes('expectedCheckedField');
                    case 'object':
                        return rules.expected || rules.expectedCheckedField;
                }
            } else if ('expectedCheckbox' === filterBy) {
                switch (typeof rules) {
                    case 'string':
                        return rules.includes('expectedCheckbox');
                    case 'object':
                        return rules.expected;
                }
            }

            return false;
        });
}

async function validateRequiredFields(entity, fields, skipFields) {
    let emptyRequiredFields = getRequiredFields(fields).filter(
        field => {
            if (undefined !== skipFields) {
                if ('string' === typeof skipFields) {
                    skipFields = [ skipFields ];
                }

                if (skipFields.length &&
                    skipFields.some(skipField => field[0].includes(skipField))
                ) {
                    return null;
                }
            }

            return isEmpty(getValueFromFieldPath(entity, field[0]))
        }
    );

    for (let i = 0; i < emptyRequiredFields.length; i++) {
        await emptyRequiredFields[i][1].validate();
    }

    if (emptyRequiredFields.length) {
        return false;
    }

    let emptyExpectedFields = getExpectedFields(fields).filter(
        field => isEmpty(getValueFromFieldPath(entity, field[0]))
    );

    if (emptyExpectedFields.length) {
        return null;
    }

    let checkboxExpectedField = getExpectedCheckboxFields(fields).filter(
        field => isSingleCheckboxEmpty(getValueFromFieldPath(entity, field[0]))
    );

    if (checkboxExpectedField.length) {
        return null;
    }

    return true;
}

function addInvalidClassOnSection(sectionName) {
    const section = document.querySelector(`#${sectionName} button.btn-dp-section`);
    if (section) {
        resetClassOnSection(sectionName);
        section.classList.add('field-invalid');
    }
}

function addValidClassOnSection(sectionName) {
    const section = document.querySelector(`#${sectionName} button.btn-dp-section`);
    if (section) {
        resetClassOnSection(sectionName);
        section.classList.add('field-valid');
    }
}

function addPartialValidClassOnSection(sectionName) {
    const section = document.querySelector(`#${sectionName} button.btn-dp-section`);
    if (section) {
        resetClassOnSection(sectionName);
        section.classList.add('field-touched');
    }
}

function resetClassOnSection(sectionName) {
    const section = document.querySelector(`#${sectionName} button.btn-dp-section`);
    if (section) {
        section.classList.remove('field-invalid');
        section.classList.remove('field-valid');
        section.classList.remove('field-touched');
    }
}

function displayColorStateOnSection(cssClass, isValid) {
    switch (true) {
        case true === isValid:
            addValidClassOnSection(cssClass);
            break;
        case false === isValid:
            addInvalidClassOnSection(cssClass);
            break;
        case null === isValid:
            addPartialValidClassOnSection(cssClass);
            break;
        case 'reset' === isValid:
            resetClassOnSection(cssClass);
            break;
    }
}

function getValueFromFieldPath(entity, fieldPath) {
    let result = Object.assign({}, entity);
    fieldPath.split('.').forEach(offset => {
        result = undefined !== result ? result[offset] : undefined;
    });
    return result;
}

function isEmpty(result) {
    return undefined === result || '' === result || null === result || 0 === result.length;
}

function isCheckedFieldValid(value, checked) {
    return !checked || (checked && !isEmpty(value));
}

function isSingleCheckboxEmpty(value) {
    return false === value;
}

function isUnique(values) {
    return values.every((item, index) => values.indexOf(item) === index);
}
