const { fetchWebStats } = require("./fetch")

module.exports = async () => {
    try {
        await fetchWebStats();

    } catch (err) {
        throw err;
    }
}