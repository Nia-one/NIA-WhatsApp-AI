function logSection(title) {

    console.log("\n======================================");
    console.log(title);
    console.log("======================================");

}

function logInfo(label, value) {

    console.log(`${label.padEnd(18)} :`, value);

}

function logSuccess(message) {

    console.log(`✅ ${message}`);

}

function logError(message) {

    console.log(`❌ ${message}`);

}

module.exports = {
    logSection,
    logInfo,
    logSuccess,
    logError
};