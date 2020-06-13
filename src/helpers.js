import { cloneDeep, isEqual } from "lodash";

/**
 * Remove object keys with null of empty values.
 */
function clean(object) {
    if (typeof object !== "object" || object === null) {
        return object;
    }
    if (Array.isArray(object)) {
        let newArray = [];
        for (let val of object) {
            newArray.push(clean(val));
        }
        return newArray;
    }
    // The following should handle both arrays and objects.
    let newObject = {};
    for (const key in object) {
        let val = clean(object[key]);
        if (isEqual(val, {}) || val === null || isEqual(val, [])) {
            continue;
        }
        newObject[key] = val;
    }
    return newObject;
}

/**
 * Extended set with common binary set operations as instance methods.
 */
class xSet extends Set {
    union(other) {
        return new Set([...this, ...other]);
    }

    intersection(other) {
        return new Set([...this].filter((x) => other.has(x)));
    }

    difference(other) {
        return new Set([...this].filter((x) => !other.has(x)));
    }
}


/**
 * Return an object with properties filtered.
 */
function filterProps(filter, obj) {
    let newObject = {};
    for (const prop in obj) {
        if (filter(prop)) {
            newObject[prop] = obj[prop];
        }
    }
    return newObject;
}


/**
 * Return a new object, which merges the supplied ones.
 *
 * When called with one object this acts as a copy.
 */
function merge(...objects) {
    return Object.assign({}, ...objects);
}

/**
 * Dotted path object with helper methods.
 */
class Path extends String {
    static join(...args) {
        return new Path(args.filter(Boolean).join("."));
    }

    get segments() {
        return this.split(".").filter(Boolean);
    }

    get depth() {
        return this.segments.length;
    }

    get(object, defaultValue = null) {
        if (!this.length) {
            return object;
        }
        try {
            const getOne = (obj, key) => obj[key];
            const returnValue = this.segments.reduce(getOne, object);
            if (typeof returnValue === "undefined") {
                return defaultValue;
            }
            return returnValue;
        } catch (_err) {
            return defaultValue;
        }
    }

    set(object, value) {
        let newObject = cloneDeep(object);
        let target = newObject;
        if (!this.length) {
            return value;
        }
        for (let segment of this.segments.slice(0, -1)) {
            if (!(segment in target)) {
                target[segment] = {};
            }
            target = target[segment];
        }
        target[this.segments.slice(-1)[0]] = value;
        return newObject;
    }

    remove(object) {
        let newObject = cloneDeep(object);
        let target = newObject;
        if (!this.length) {
            return undefined;
        }
        for (let segment of this.segments.slice(0, -1)) {
            if (!(segment in target)) {
                return newObject;
            }
            target = target[segment];
        }
        delete target[this.segments.slice(-1)[0]]
        return newObject;
    }
}

export { Path, merge, filterProps, xSet, clean };
