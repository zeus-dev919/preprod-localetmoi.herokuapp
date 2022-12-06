'use strict';

module.exports = {
    validateEmail: function (email) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w+)+$/.test(email)) {
            return true;
        }
        return false;
    }
};
