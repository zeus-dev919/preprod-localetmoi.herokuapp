export const normalizer = {
    booleanNormalizer: function(value) {
        if ('string' === typeof(value)) {
            value = value === 'true';
        }

        return value;
    },
    boolToYesNo: function(value) {
        return value ? 'Oui' : 'Non';
    },
    boolToOpenClose: function(value) {
        return value ? 'Ouvert' : 'Fermé';
    },
    secondsToStrTime(seconds) {
        let hours = Math.floor(seconds / 3600);
        let minutes = Math.floor((seconds % 3600) / 60);
        if (hours < 10 ) {
            hours = '0' + hours;
        }
        if (minutes < 10 ) {
            minutes = '0' + minutes;
        }

        return `${hours}:${minutes}`;
    },
    strTimeToSeconds(strtime) {
        if ('' === strtime) {
            return null;
        }

        if (/\d{2}:\d{2}/.test(strtime)) {
            let time = strtime.split(':');
            return (parseInt(time[0]) * 3600) + (parseInt(time[1]) * 60);
        }

        if (strtime) {
            throw 'Invalid time format. Expected syntax: hh:mm';
        }

        return strtime;
    },
    toStrTimeRange(startTime, endTime) {
        if (startTime && endTime) {
            let transformStart = normalizer.secondsToStrTime(startTime);
            let transformEnd = normalizer.secondsToStrTime(endTime);
            return transformStart + ' - ' + transformEnd;
        } else {
            return 'Non définis';
        }
    },
    toFrenchDate(isoDate) {
        if (!isoDate) {
            return null;
        }
    
        const date = new Date(isoDate);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const formatMonth = month < 10 ? `0${month}` : month;
        const formatDay = day < 10 ? `0${day}` : day;
    
        return `${formatDay}/${formatMonth}/${year}`;
    },
    floatNormalizer(value) {
        return parseFloat(value.includes(',') ? value.replace(',', '.') : value);
    },
    normalizePartnerHistory(data) {
        return this.normalizeEntity(data, [ 'partnerHistories' ]);
    },
    normalizeEntity(data, excludes) {
        let objectFinder = new ObjectFinder(data);
        objectFinder.processEntity(data);

        const formatObject = function(_data, _depthLevel, _xpath, _objectPath) {
            if (undefined === _data || null === _data) {
                return _data;
            }

            let currentObjectPath = Array.from(_objectPath);

            if (_data['@type']) {
                currentObjectPath = [ ...currentObjectPath, _data['@type'] ];
            }

            const processObject = function(object, currentXpath) {
                objectFinder
                    .setCurrentDepthLevel(_depthLevel)
                    .setCurrentXpath(currentXpath)
                    .setCurrentObjectPath(currentObjectPath)
                    .processEntity(object);

                return objectFinder.isPreviouslyProcessed()
                    ? object['@id']
                    : formatObject(object, _depthLevel + 2, currentXpath, currentObjectPath);
            };

            Object.keys(_data).forEach(propName => {
                const propValue = _data[propName];

                if (undefined === propValue ||
                    null === propValue ||
                    !(Array.isArray(propValue) || 'object' === typeof propValue)
                ) {
                    return;
                }

                if (excludes && -1 !== excludes.indexOf(propName)) {
                    delete _data[propName];
                    return;
                }

                if (Array.isArray(propValue)) {
                    _data[propName] = propValue.map((value, index) => {
                        if ('object' === typeof value && value['@id']) {
                            return processObject(value, [..._xpath, propName, index]);
                        }

                        return value;
                    }).filter(item => {
                        if (undefined === item) {
                            return false;
                        }
                        if (null === item) {
                            return true;
                        }
                        if (Array.isArray(item) && !item.length) {
                            return false;
                        }

                        return 'object' !== typeof item || Object.keys(item).length;
                    });
                } else if ('object' === typeof propValue) {
                    _data[propName] = processObject(propValue, [ ..._xpath, propName ]);
                }
            });

            return _data;
        };

        return formatObject(data, 0, [], []);
    }
};

const ObjectFinder = function(_entity) {
    const initialEntity = _entity;
    let entities = {};
    let currentDepthLevel = 0;
    let currentXpath = [];
    let currentObjectPath = [];
    let isPreviouslyProcessed = false;

    this.setCurrentDepthLevel = function(_level) {
        currentDepthLevel = _level;

        return this;
    }

    this.setCurrentXpath = function(_xpath) {
        currentXpath = _xpath;

        return this;
    }

    this.setCurrentObjectPath = function(_oblectPath) {
        currentObjectPath = _oblectPath;

        return this;
    }

    this.processEntity = function(entityToProcess) {
        let oldEntity = entities[entityToProcess['@id']];
        const typeAlreadySet = entityToProcess['@type'] && -1 !== currentObjectPath.indexOf(entityToProcess['@type']);
        isPreviouslyProcessed = typeAlreadySet ? currentDepthLevel > currentObjectPath.indexOf(entityToProcess['@type']) : false;

        let path = currentXpath.map(offset => `['${offset}']`).join('');
        if (typeAlreadySet) {
            let tmp = initialEntity;
            const xpathExists = currentXpath.every(offset => (tmp = tmp[offset]) && undefined !== tmp);
            if (xpathExists && isPreviouslyProcessed) {
                try {
                    eval(`initialEntity${path} = entityToProcess['@id'];`);
                } catch (e) {
                    console.warn(e);
                }
            }

            return this;
        }

        if (!oldEntity) {
            if (entityToProcess['@id']) {
                entities[entityToProcess['@id']] = {
                    depthLevel: currentDepthLevel,
                    entity: entityToProcess,
                    xpath: Array.from(currentXpath)
                }
            }
        } else {
            let tmp = initialEntity;
            if (currentDepthLevel < oldEntity.depthLevel) {
                const xpathExists = oldEntity.xpath.every(offset => (tmp = tmp[offset]) && undefined !== tmp);
                if (xpathExists) {
                    path = oldEntity.xpath.map(offset => `['${offset}']`).join('');
                    try {
                        eval(`initialEntity${path} = oldEntity.entity['@id'];`);
                    } catch (e) {
                        console.warn(e);
                    }
                    entities[entityToProcess['@id']] = {
                        depthLevel: currentDepthLevel,
                        entity: entityToProcess,
                        xpath: Array.from(currentXpath)
                    }
                }
            } else {
                const xpathExists = currentXpath.every(offset => (tmp = tmp[offset]) && undefined !== tmp);
                if (xpathExists) {
                    try {
                        eval(`initialEntity${path} = oldEntity.entity['@id'];`);
                    } catch (e) {
                        console.warn(e);
                    }
                }
            }
        }

        return this;
    };

    this.isPreviouslyProcessed = function() {
        return isPreviouslyProcessed;
    };
}
