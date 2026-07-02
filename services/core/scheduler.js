function startScheduler(job, intervalMinutes = 2) {

    console.log("================================");
    console.log("NIA Scheduler Started");
    console.log(`Running every ${intervalMinutes} minute(s)`);
    console.log("================================");

    // Run immediately
    job();

    // Run repeatedly
    setInterval(() => {

        job();

    }, intervalMinutes * 60 * 1000);

}

module.exports = {
    startScheduler
};