if (undefined === Object.assignRecursive) {
    Object.defineProperty(Object.prototype, 'assignRecursive', {
        value: function (target, source) {
            if (Array.isArray(source)) {
                if (source.length) {
                    target = source.map((val, key) => {
                        if (undefined === target[key]) {
                            target[key] = val;
                        }
                        return Object.assignRecursive(target[key], val);
                    });
                } else {
                    target = [];
                }
            } else if (null === source || null === target) {
                target = source;
            } else if ('object' === typeof source) {
                if (Object.keys(source).length) {
                    Object.keys(source).forEach(key => {
                        if (undefined === target[key]) {
                            target[key] = source[key];
                        }
                        target[key] = Object.assignRecursive(target[key], source[key]);
                    })
                } else {
                    target = {};
                }
            } else {
                target = source;
            }

            return target;
        }
    });
}

if (undefined === Object.isEmpty) {
    Object.defineProperty(Object.prototype, 'isEmpty', {
        value: (target) => {
            return !Object.keys(target).length;
        }
    });
}
