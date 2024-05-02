const initDatabase = require("./init");
const { fetchSession, fetchWebStats } = require("./fetch");
const { insertNewSession } = require("./insert");



// Call the initDatabase function and handle the promise
initDatabase()
    .then(() => {
        console.log('Database initialization successful.');
        // You can continue with other operations that depend on the database here
    })
    .catch(err => {
        console.error('Database initialization failed:', err);
    });

module.exports = {
    initDatabase,
    fetchSession,
    insertNewSession,
    fetchWebStats,
}