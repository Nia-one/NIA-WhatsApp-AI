function normalize(value) {

    if (value === null || value === undefined) {
        return "";
    }

    // Handle booleans
    if (typeof value === "boolean") {
        return value ? "TRUE" : "FALSE";
    }

    // Handle numbers
    if (typeof value === "number") {
        return String(value);
    }

    return String(value).trim().toUpperCase();

}

function compareObjects(source, target, fields) {

    for (const field of fields) {

        if (normalize(source[field]) != normalize(target[field])) {

            return {
                changed: true,
                field
            };

        }

    }

    return {
        changed: false,
        field: null
    };

}

module.exports = {
    compareObjects
};